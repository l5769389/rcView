import Config from '@config/config'
import { desktopCapturer, ipcMain, screen } from 'electron'
import { execSync, spawn } from 'child_process'
import { join, resolve } from 'path'
import { OpType, RobotMsgType } from '@config/types'
import os from 'os'

let client
let basePath = ''

let jsProcess
let pyProcess

if (import.meta.env.PROD) {
  basePath = join(__dirname, '..', '..', '..', '..', './thirdPartyProj')
} else {
  basePath = join(__dirname, '..', '..', './thirdPartyProj')
}

const startPeerServer = async () => {
  const js_path = resolve(basePath, './peerServer/main.exe')
  jsProcess = spawn(js_path)
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
    listenExit()
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
  pyProcess = spawn(py_path)
  pyProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  pyProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  pyProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
}

const killSubProcess = () => {
  if (jsProcess) {
    try {
      if (os.platform() == 'darwin') {
        execSync(`kill -9 ${jsProcess.pid}`)
      } else {
        execSync(`taskkill /f /t /im "${jsProcess.pid}"`)
      }
    } catch (e) {
      console.log(`py kill err:${e}`)
    }
  }
  if (pyProcess) {
    try {
      if (os.platform() == 'darwin') {
        execSync(`kill -9 ${pyProcess.pid}`)
      } else {
        execSync(`taskkill /f /t /im "${pyProcess.pid}"`)
      }
    } catch (e) {
      console.log(`py kill err:${e}`)
    }
  }
  process.exit(0)
}

const listenExit = () => {
  const events = ['exit', 'SIGINT', 'SIGTERM']
  events.forEach((item) => {
    process.on(item, killSubProcess)
  })
}
