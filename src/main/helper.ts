import { ipcMain, desktopCapturer } from 'electron'
import robot from 'robotjs'
import Config from '../config/config'

export const getDifferentWin = async () => {
  if (Config.ROLE === Config.SERVER) {
    ipcMain.addListener('robotOp', (e: any, msg) => {
      try {
        robotOp(msg)
      } catch (e) {
        console.log(e)
      }
    })
    const robotOp = (msg) => {
      const { mouseType: type, x: clientX, y: clientY, key } = msg
      if (type === 'mousemove') {
        robot.moveMouse(clientX, clientY)
      } else if (type === 'mousedown') {
        console.log('down')
        robot.mouseToggle('down')
      } else if (type === 'mouseup') {
        console.log('up')
        robot.mouseToggle('up')
      } else if (type === 'dragMouse') {
        console.log('drag')
        robot.dragMouse(clientX, clientY)
      } else if (type === 'keydown') {
        console.log(`tap: ${key}`)
        let tapkey = ''
        if (key.length === 1) {
          tapkey = key
        } else {
          tapkey = key.toLocaleLowerCase()
        }
        try {
          robot.keyTap(tapkey)
        } catch (e) {
          console.log(`${tapkey} is error`)
          console.log(e)
        }
      } else if (type === 'contextmenu') {
        console.log('right click')
        robot.mouseClick('right')
      }
    }
  }

  ipcMain.handle('desktop', async () => {
    return await desktopCapturer
      .getSources({
        types: ['screen'],
        thumbnailSize: {
          width: 0,
          height: 0
        }
      })
      .then(async (sources) => {
        if (sources.length >= 1) {
          return sources[0].id
        } else {
          return -1
        }
      })
  })
}
