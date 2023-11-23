import { DataConnection, MediaConnection, Peer } from 'peerjs'
import { BasePeer } from './BasePeer'

class ServerPeer extends BasePeer {
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
        console.log('receive data')
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
