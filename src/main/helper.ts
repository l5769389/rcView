import Config from '@config/config'
import { desktopCapturer, ipcMain, screen } from 'electron'
import { spawn } from 'child_process'
import { join, resolve } from 'path'
import { OpType, RobotMsgType } from '@config/types'

let client
const basePath = join(__dirname, '..', '..', './thirdPartyProj')

const startPeerServer = async () => {
  const js_path = resolve(basePath, './peerServer/dist/main.js')
  const childProcess = spawn('node', [js_path])
  childProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  childProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  childProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
}

if (Config.ROLE === Config.SERVER) {
  startPeerServer()
}

export const getDifferentWin = async () => {
  if (Config.ROLE === Config.SERVER) {
    ipcMain.addListener('robotOp', (_e, msg) => {
      try {
        opCompute(msg)
      } catch (e) {
        console.log(e)
      }
    })
    // startPeerServer()
    if (!Config.SERVER_AUTO_MACHINE_IS_ROBOT) {
      startPyGrpc()
      await createGrpcClient()
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
        const size = getScreenSize()
        if (sources.length >= 1) {
          return {
            sourceId: sources[0].id,
            ...size
          }
        } else {
          return {
            sourceId: -1,
            ...size
          }
        }
      })
  })
}

const getScreenSize = () => {
  const display = screen.getPrimaryDisplay()
  const { width: screenWidth, height: screenHeight } = display.size
  const width = screenWidth
  const height = screenHeight
  return {
    width,
    height,
    scaleFactor: display.scaleFactor
  }
}

const createGrpcClient = async () => {
  const grpc = await import('@grpc/grpc-js')
  const { proto } = await import('./grpc/proto')
  client = new proto.robotOp(Config.GRPC_IP, grpc.credentials.createInsecure())
}

const opCompute = async (msg: RobotMsgType) => {
  if (Config.SERVER_AUTO_MACHINE_IS_ROBOT) {
    const robot = await import('robotjs')
    robotOp(robot, msg)
  } else {
    client.Opmouse(msg, function (err, response) {
      if (err) {
        console.log(err)
      } else {
        console.log('Greeting:', response)
      }
    })
  }
}

const robotOp = (robot, msg: any) => {
  const { mouseType: type, x: clientX, y: clientY, keys } = msg as RobotMsgType
  if (type === OpType.mousemove) {
    robot.moveMouse(clientX, clientY)
  } else if (type === OpType.mousedown) {
    robot.mouseToggle('down')
  } else if (type === OpType.mouseup) {
    robot.mouseToggle('up')
  } else if (type === OpType.dragMouse) {
    robot.dragMouse(clientX, clientY)
  } else if (type === OpType.keydown) {
    const { key, ctrlKey, shiftKey, altKey } = keys
    let tapkey = key
    if (key?.length === 1) {
      tapkey = key as string
    } else {
      tapkey = (key as string).toLocaleLowerCase()
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
  } else if (type === OpType.contextmenu) {
    robot.mouseClick('right')
  } else if (type === OpType.wheel) {
    const { deltaX, deltaY } = msg as RobotMsgType
    console.log(type, deltaX, deltaY)
    robot.scrollMouse(0, 10)
  }
}

const startPyGrpc = () => {
  const py_path = resolve(basePath, './grpc-py/dist/main.exe')
  const childProcess = spawn(py_path)
  childProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  childProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  childProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
}
