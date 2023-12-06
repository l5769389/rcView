import { MediaConnection, Peer } from 'peerjs'
import { BasePeer } from './BasePeer'
import type { PeerMsgType } from '@config/types'
import { stateChangeCbType } from './PeerTypes'
import log from 'electron-log/renderer'

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
    const { width, height, scaleFactor } = this.screenSize
    return {
      x: Math.round(width * x * scaleFactor),
      y: Math.round(height * y * scaleFactor)
    }
  }

  addListen() {
    this.peer?.on('open', () => {
      this.updateConnectState({
        connect2Server: true
      })
    })

    this.peer?.on('connection', (conn) => {
      conn.on('data', (data) => {
        const {
          type,
          data: { x = -1, y = -1, mouseType, keys, deltaX, deltaY }
        } = data as PeerMsgType
        if (type === 'operate') {
          const { x: mapX, y: mapY } = this.map2ScreenPosition(x, y)
          this.robotOp({
            mouseType,
            x: mapX,
            y: mapY,
            keys,
            deltaX,
            deltaY
          })
        }
      })
    })

    // 与信令服务器断开
    this.peer?.on('disconnected', () => {
      this.updateConnectState({
        connect2Server: false
      })
    })
    this.peer?.on('error', (e) => {
      this.updateConnectState({
        connect2Server: false
      })
      log.error(`peer error: ${e.message}`)
    })

    this.peer?.on('call', async (call) => {
      const callKey = Date.now()
      call.on('close', () => {
        this.disconnect2PeerCall(callKey)
      })
      call.on('error', () => {
        this.disconnect2PeerCall(callKey)
      })
      this.addCallMap(callKey, call)
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
    ;(window as any).electron.ipcRenderer.send('robotOp', msg)
  }
}
