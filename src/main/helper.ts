import Config from '@config/config'
import { desktopCapturer, ipcMain, screen } from 'electron'
import robot from 'robotjs'
import { spawn } from 'child_process'
import { resolve } from 'path'
import { OpType } from '@config/types'

import grpc from '@grpc/grpc-js'
import { proto } from './grpc/proto'
interface RobotMsgType {
  mouseType: OpType
  x: number
  y: number
  keys: any
  deltaX?: number
  deltaY?: number
}

let client

export const getDifferentWin = async () => {
  if (Config.ROLE === Config.SERVER) {
    ipcMain.addListener('robotOp', (_e, msg) => {
      try {
        opCompute(msg)
      } catch (e) {
        console.log(e)
      }
    })
    // createGrpcClient()
    // startPeerServer()
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

const createGrpcClient = () => {
  client = new proto.robotOp('127.0.0.1:50052', grpc.credentials.createInsecure())
}

const opCompute = (msg) => {
  robotOp(msg)
  client.Opmouse(msg, function (err, response) {
    if (err) {
      console.log(err)
    } else {
      console.log('Greeting:', response)
    }
  })
}

const robotOp = (msg: any) => {
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
  } else if (type === OpType.contextmenu) {
    robot.mouseClick('right')
  } else if (type === OpType.wheel) {
    const { deltaX, deltaY } = msg as RobotMsgType
    console.log(type, deltaX, deltaY)

    robot.scrollMouse(0, 10)
  }
}

const startPeerServer = () => {
  const js_path = resolve(__dirname, './peerServer.js')
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
