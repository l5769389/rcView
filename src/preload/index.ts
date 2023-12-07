import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fs from 'fs'
import { join, resolve } from 'path'
import log from 'electron-log/main'
// Custom APIs for renderer
const api = {
  readConfig: () => {
    let configPath
    if (import.meta.env.PROD) {
      configPath = join(__dirname, '..', '..', '..', '..', './config/config.json')
    } else {
      configPath = join(__dirname, '..', '..', './config/config.json')
    }
    log.log(`configPath:${configPath}`)
    return fs.readFileSync(resolve(configPath), 'utf-8')
  }
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
