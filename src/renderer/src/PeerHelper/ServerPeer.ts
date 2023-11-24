import { DataConnection, MediaConnection, Peer } from 'peerjs'
import { BasePeer } from './BasePeer'
import type { PeerMsgType } from '../types.ts'
import { stateChangeCbType } from './PeerTypes'

export class ServerPeer extends BasePeer {
  peer: Peer | null = null
  callMap = new Map<number, MediaConnection>()

  constructor(connectStateChangeCb?: stateChangeCbType) {
    super(connectStateChangeCb)
    this.connect2Server()
  }

  addCallMap(k: number, v: MediaConnection) {
    this.callMap.set(k, v)
    this.updateConnectState({
      callMap: this.callMap
    })
  }

  removeCallMap(k: number) {
    this.callMap.delete(k)
    this.updateConnectState({
      callMap: this.callMap
    })
  }

  connect2Server() {
    this.peer = new Peer(this.MAINID, {
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
      this.updateConnectState({
        connect2Server: true
      })
    })

    this.peer!.on('connection', (conn) => {
      conn.on('data', (data) => {
        const {
          type,
          data: { x, y, mouseType }
        } = data as PeerMsgType
        if (type === 'operate') {
          const { x: mapX, y: mapY } = this.map2ScreenPosition(x, y)
          this.robotOp({
            mouseType,
            x: mapX,
            y: mapY
          })
        }
      })
    })

    // 与信令服务器断开
    this.peer!.on('disconnected', () => {
      this.updateConnectState({
        connect2Server: false
      })
    })

    this.peer!.on('call', async (call) => {
      const timestamp = Date.now()
      this.addCallMap(timestamp, call)
      const localStream: MediaStream = await this.getLocalStream()
      call.answer(localStream)
    })
  }

  disconnect2PeerCall(key: number) {
    const call: MediaConnection | undefined | null = this.callMap.get(key)
    call?.close()
    this.removeCallMap(key)
  }

  robotOp(msg) {
    window.Electron.ipcRenderer.send('robotOp', msg)
  }
}
