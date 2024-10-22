import path from 'path'
import fsPromises from 'fs/promises'
import { ipcRenderer, IpcRendererEvent } from 'electron'
import * as electron from '@electron/remote'

subscribeToElectronEvent(() => {
  const onBoundsChange = (event: IpcRendererEvent, bounds: Electron.Rectangle) => {
    const storagePath = path.join(
      electron.app.getPath('appData'),
      'canvas-things',
      'storage-v1.json'
    )
    fsPromises.writeFile(storagePath, JSON.stringify({ bounds }))
  }

  ipcRenderer.on('bounds-change', onBoundsChange)
  return () => ipcRenderer.off('bounds-change', onBoundsChange)
})

export function subscribeToElectronEvent(subscribe: (() => () => void)) {
  const unsubscribe = subscribe()
  window.addEventListener('beforeunload', unsubscribe, { once: true })
}
