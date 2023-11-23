import { DataConnection, MediaConnection, Peer } from 'peerjs'
import { PeerMsgType } from '../../types'

export class BasePeer {
  MAINID = '1'
  VIEWID = '2'
  HOST: string = '192.168.3.243'
  PORT: number = 9000
  connectState = {
    connect2Server: false,
    connect2Peer: false
  }

  updateConnectState(newState: Object) {
    Object.assign(this.connectState, newState)
    this.connectStateChangeCb(this.connectState)
  }

  getLocalStream = () => {
    const constraint: MediaStreamConstraints = {
      video: {
        mandatory: {
          chromeMediaSource: 'desktop'
        },
        optional: [{ minFrameRate: 10 }, { maxFrameRate: 90 }]
      },
      audio: false
    }
    return navigator.mediaDevices.getUserMedia(constraint)
  }
}

// export class PeerHelper {
//   #MAINID = '1'
//   #VIEWID = '2'
//   connectState = {
//     connect2Server: false,
//     connect2Peer: false
//   }
//   currentRole
//   HOST: string = '192.168.3.243'
//   PORT: number = 9000
//   peer: Peer | null = null
//   call: MediaConnection | null = null
//   conn: DataConnection | null = null
//   connectCb: Function | null = null
//   connectStateChangeCb: Function
//
//   constructor(roleType: string, connectStateChangeCb = () => {}) {
//     if (roleType === 'view') {
//       this.currentRole = this.#VIEWID
//     } else {
//       this.currentRole = this.#MAINID
//     }
//     this.connectStateChangeCb = connectStateChangeCb
//     this.connect2Server()
//   }
//
//   connect2Server() {
//     this.peer = new Peer(this.currentRole, {
//       host: this.HOST,
//       port: this.PORT
//     })
//     this.addListen()
//   }
//
//   updateConnectState(newState: Object) {
//     Object.assign(this.connectState, newState)
//     this.connectStateChangeCb(this.connectState)
//   }
//
//   private addListen() {
//     this.peer!.on('open', () => {
//       console.log('connect success')
//       this.updateConnectState({
//         connect2Server: true
//       })
//     })
//     this.peer!.on('connection', (conn) => {
//       this.conn = conn
//       this.conn.on('data', (data) => {
//         console.log('receive data')
//       })
//     })
//
//     this.peer!.on('disconnected', () => {
//       this.updateConnectState({
//         connect2Server: false
//       })
//     })
//     this.peer!.on('call', async (call) => {
//       this.call = call
//       const localStream: MediaStream = await this.getLocalStream()
//       this.call.answer(localStream)
//     })
//   }
//
//
// }
