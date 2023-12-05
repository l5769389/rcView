import { DataConnection, MediaConnection, Peer } from 'peerjs'
import { BasePeer } from './BasePeer'
import type { PeerMsgType } from '@config/types'
import type { connectCbType } from './PeerTypes'
import { stateChangeCbType } from './PeerTypes'

export class ClientPeer extends BasePeer {
  peer: Peer | null = null
  call: MediaConnection | null | undefined = null
  conn: DataConnection | null | undefined = null
  connectCb: connectCbType | null = null

  constructor(stateChangeCb: stateChangeCbType) {
    super(stateChangeCb)
    this.connect2Server()
  }

  private connect2Server() {
    this.peer = new Peer({
      host: this.HOST,
      port: this.PORT
    })
    this.addListen()
  }

  private addListen() {
    this.peer?.on('open', (id) => {
      console.log(`connect success, peer id: ${id}`)
      this.updateConnectState({
        connect2Server: true
      })
    })

    this.peer?.on('connection', (conn) => {
      this.conn = conn
      this.conn.on('data', (data: any) => {
        console.log('receive data', data)
      })
    })

    this.peer?.on('disconnected', () => {
      this.updateConnectState({
        connect2Server: false
      })
    })
  }

  connect2MainPeer = async (connectCb: connectCbType) => {
    this.connectCb = connectCb
    this.conn = this.peer?.connect(this.MAINID)
    this.conn?.on('open', async () => {
      const localStream: MediaStream = await this.getLocalStream()
      this.call = this.peer?.call(this.MAINID, localStream)
      this.addCallListen()
    })
  }

  private addCallListen = () => {
    this.call?.on('stream', (stream: MediaStream) => {
      this.updateConnectState({
        connect2Peer: true
      })
      this.connectCb?.(stream)
    })
    this.call?.on('close', () => {
      this.updateConnectState({
        connect2Peer: false
      })
    })
  }

  disconnect = () => {
    this.conn?.close()
    this.call?.close()
    this.conn = null
    this.updateConnectState({
      connect2Peer: false
    })
  }

  sendMsg = (msg: PeerMsgType) => {
    this.conn?.send(msg)
  }
}
