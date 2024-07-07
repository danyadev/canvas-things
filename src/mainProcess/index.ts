import path from 'path'
import fs from 'fs'
import * as electronMain from '@electron/remote/main'
import { app, BrowserWindow, shell, screen } from 'electron'
import { buildMacOSMenu } from './buildMacOSMenu'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

const isMacOS = process.platform === 'darwin'

const appDataPath = path.join(app.getPath('appData'), 'canvas-things')
const storePath = path.join(appDataPath, 'storage-v1.json')

type MainSettings = {
  bounds: Electron.Rectangle | null
}

let mainSettings: MainSettings = {
  bounds: null
}

try {
  const localMainSettings = JSON.parse(fs.readFileSync(storePath, 'utf-8')) as MainSettings
  console.log('read', localMainSettings)
  mainSettings = {
    ...mainSettings,
    ...localMainSettings
  }
} catch {
  if (!fs.existsSync(appDataPath)) {
    console.log('create', appDataPath)
    fs.mkdirSync(appDataPath)
  }
  console.log('write', JSON.stringify(mainSettings))
  fs.writeFileSync(storePath, JSON.stringify(mainSettings))
}

electronMain.initialize()

function createWindow() {
  const win = new BrowserWindow({
    minWidth: 400,
    minHeight: 550,
    show: false,
    alwaysOnTop: true,
    webPreferences: {
      webSecurity: false,
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  win.webContents.session.setSpellCheckerLanguages(['ru', 'en-US'])
  electronMain.enable(win.webContents)

  return win
}

app.once('ready', () => {
  const mainWindow = createWindow()

  const updateWindowBounds = debounce(() => {
    mainWindow.webContents.send('bounds-change', mainWindow.getBounds())
  }, 500)

  mainWindow.on('move', updateWindowBounds)
  mainWindow.on('resize', updateWindowBounds)

  mainWindow.webContents.once('dom-ready', () => {
    if (mainSettings.bounds) {
      const { bounds } = mainSettings
      const { width, height } = screen.getPrimaryDisplay().workAreaSize
      const isMaximized = bounds.width >= width && bounds.height >= height

      mainWindow.setBounds({
        x: bounds.x,
        y: bounds.y,
        width: isMaximized ? width : bounds.width,
        height: isMaximized ? height : bounds.height
      })

      if (isMaximized) {
        mainWindow.maximize()
      }
    }

    mainWindow.show()
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile('dist/index.html')
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (isMacOS) {
    buildMacOSMenu()

    let forceClose = false

    app.on('before-quit', () => {
      forceClose = true
    })

    mainWindow.on('close', (event) => {
      // Позволяем полностью закрыть приложение
      if (forceClose) {
        return
      }

      event.preventDefault()

      if (mainWindow.isFullScreen()) {
        mainWindow.setFullScreen(false)
        mainWindow.once('leave-full-screen', () => mainWindow.hide())
      } else {
        mainWindow.hide()
      }
    })

    app.on('activate', (event, hasVisibleWindows) => {
      // Приложение было закрыто через ⌘ + W
      if (!hasVisibleWindows) {
        mainWindow.show()
      }
    })
  } else {
    mainWindow.setMenuBarVisibility(false)
  }
})

if (!isMacOS) {
  app.on('window-all-closed', () => {
    app.quit()
  })
}

/**
 * Вызывает целевую функцию через delay мс после последнего вызова обертки
 */
export function debounce<T extends ((...args: never[]) => void)>(fn: T, delay: number) {
  let timerId: NodeJS.Timeout | null = null

  return function(this: unknown, ...args: Parameters<T>) {
    if (timerId) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      fn.apply(this, args)
      timerId = null
    }, delay)
  }
}
