import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import electronRenderer from 'vite-plugin-electron-renderer'
import fullReload from 'vite-plugin-full-reload'

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  build: {
    target: 'esnext',
    modulePreload: {
      polyfill: false
    },
    outDir: 'app/dist',
    reportCompressedSize: false
  },
  server: {
    hmr: true
  },
  plugins: [
    fullReload('src/**/*'),
    electron({
      entry: 'src/mainProcess/index.ts',
      vite: {
        build: {
          outDir: 'app',
          reportCompressedSize: false
        },
        esbuild: {
          legalComments: 'none'
        }
      }
    }),
    electronRenderer()
  ]
})
