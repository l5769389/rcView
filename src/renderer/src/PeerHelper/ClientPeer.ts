import {DataConnection, MediaConnection, Peer} from 'peerjs'
import {BasePeer} from "./BasePeer";
import type {PeerMsgType} from "../types";

export class ClientPeer extends BasePeer {
  peer: Peer | null = null
  call: MediaConnection | null = null
  conn: DataConnection | null = null
  connectCb: Function | null = null


  constructor(connectStateChangeCb?: (state) => void) {
    super(connectStateChangeCb)
    this.connect2Server()
  }

  private connect2Server() {
    this.peer = new Peer(this.VIEWID, {
      host: this.HOST,
      port: this.PORT
    })
    this.addListen()
  }

  private addListen() {
    this.peer!.on('open', () => {
      console.log('connect success')
      this.updateConnectState({
        connect2Server: true
      })
    })

    this.peer!.on('connection', (conn) => {
      this.conn = conn
      this.conn.on('data', (data: any) => {
        console.log('receive data', data)
      })
    })

    this.peer!.on('disconnected', () => {
      this.updateConnectState({
        connect2Server: false
      })
    })
  }

  connect2MainPeer = async (connectCb: Function) => {
    this.connectCb = connectCb
    this.conn = this.peer!.connect(this.MAINID)
    this.conn.on('open', async () => {
      const localStream: MediaStream = await this.getLocalStream()
      this.call = this.peer!.call(this.MAINID, localStream)
      this.addCallListen()
    })
  }

  private addCallListen = () => {
    this.call!.on('stream', (stream) => {
      this.updateConnectState({
        connect2Peer: true
      })
      this.connectCb!(stream)
    })
    this.call?.on('close',() => {
      this.updateConnectState({
        connect2Peer: false
      })
    })
  }

  sendMsg = (msg: PeerMsgType) => {
    this.conn!.send(msg)
  }
}
