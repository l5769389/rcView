import { DataConnection, MediaConnection, Peer } from 'peerjs'
import { BasePeer } from './BasePeer'
import { PeerMsgType } from '../../types'
import robot from 'robotjs'

export class ServerPeer extends BasePeer {
  peer: Peer | null = null
  call: MediaConnection | null = null
  conn: DataConnection | null = null
  connectStateChangeCb: Function = () => {}
  currentRole: string

  constructor(connectStateChangeCb = () => {}) {
    super()
    this.connectStateChangeCb = connectStateChangeCb
    this.currentRole = this.MAINID
    this.connect2Server()
  }

  connect2Server() {
    this.peer = new Peer(this.currentRole, {
      host: this.HOST,
      port: this.PORT
    })
    this.addListen()
  }

  map2ScreenPosition(x: number, y: number) {
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height
    return {
      x: screenWidth * x,
      y: screenHeight * y
    }
  }

  addListen() {
    this.peer!.on('open', () => {
      console.log('connect success')
      this.updateConnectState({
        connect2Server: true
      })
    })

    this.peer!.on('connection', (conn) => {
      this.conn = conn
      this.conn.on('data', (data) => {
        const {
          type,
          data: { x, y, mouseType }
        } = data as PeerMsgType
        if (type === 'operate') {
          const { x: mapX, y: mapY } = this.map2ScreenPosition(x, y)
          this.robotOp(mouseType, x, y)
        }
      })
    })

    this.peer!.on('disconnected', () => {
      this.updateConnectState({
        connect2Server: false
      })
    })

    this.peer!.on('call', async (call) => {
      this.call = call
      const localStream: MediaStream = await this.getLocalStream()
      this.call.answer(localStream)
    })
  }

  robotOp(type, clientX, clientY) {
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
