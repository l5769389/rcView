import { ipcMain } from 'electron'

export const getDifferentWin = async () => {
  if ((import.meta.env.MAIN_VITE_ROLE = 'SERVER')) {
    const robot = await import('robotjs')
    ipcMain.addListener('robotOp', (e: any, msg) => {
      robotOp(msg)
    })
    const robotOp = (msg) => {
      const { mouseType: type, x: clientX, y: clientY } = msg
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
      } else if (type === 'click') {
        robot.mouseClick()
      } else if (type === 'keydown') {
        // console.log(`tap: ${key}`)
        // let tapkey = ''
        // if (key.length === 1) {
        //   tapkey = key
        // } else {
        //   tapkey = key.toLocaleLowerCase()
        // }
        // try {
        //   robot.keyTap(tapkey)
        // } catch (e) {
        //   console.log(`${tapkey} is error`)
        //   console.log(e)
        // }
      }
    }
  }
}
