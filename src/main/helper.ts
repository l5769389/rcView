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
      const {
        mouseType: type,
        x: clientX,
        y: clientY,
        keys: { key, ctrlKey, shiftKey, altKey }
      } = msg
      if (type === 'mousemove') {
        robot.moveMouse(clientX, clientY)
      } else if (type === 'mousedown') {
        robot.mouseToggle('down')
      } else if (type === 'mouseup') {
        robot.mouseToggle('up')
      } else if (type === 'dragMouse') {
        robot.dragMouse(clientX, clientY)
      } else if (type === 'keydown') {
        let tapkey = ''
        if (key.length === 1) {
          tapkey = key
        } else {
          tapkey = key.toLocaleLowerCase()
        }
        try {
          if (shiftKey) {
            robot.keyToggle('shift', tapkey)
          } else if (ctrlKey) {
            robot.keyToggle('control', tapkey)
          } else if (altKey) {
            robot.keyToggle('alt', tapkey)
          } else {
            robot.keyTap(tapkey)
          }
        } catch (e) {
          console.log(e)
        }
      } else if (type === 'contextmenu') {
        robot.mouseClick('right')
      } else if (type === 'wheel') {
        robot.scrollMouse(clientX, clientY)
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
