import Config from '@config/config'
import { ipcMain, desktopCapturer } from 'electron'
import robot from 'robotjs'

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
      const { mouseType: type, x: clientX, y: clientY, keys } = msg
      if (type === 'mousemove') {
        robot.moveMouse(clientX, clientY)
      } else if (type === 'mousedown') {
        robot.mouseToggle('down')
      } else if (type === 'mouseup') {
        robot.mouseToggle('up')
      } else if (type === 'dragMouse') {
        robot.dragMouse(clientX, clientY)
      } else if (type === 'keydown') {
        const { key, ctrlKey, shiftKey, altKey } = keys
        let tapkey = ''
        tapkey = key
        if (key.length === 1) {
          tapkey = key
        } else {
          tapkey = key.toLocaleLowerCase()
        }
        try {
          if (shiftKey) {
            robot.keyTap(tapkey, ['shift'])
          } else if (ctrlKey) {
            robot.keyTap(tapkey, ['control'])
          } else if (altKey) {
            robot.keyTap(tapkey, ['alt'])
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
