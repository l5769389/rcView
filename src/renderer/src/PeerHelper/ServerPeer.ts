import { DataConnection, MediaConnection, Peer } from 'peerjs'
import { BasePeer } from './BasePeer'
import { PeerMsgType } from '../../types'

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
          console.log(mapX, mapY)
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
}
