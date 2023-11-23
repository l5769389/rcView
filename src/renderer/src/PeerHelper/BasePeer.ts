import { DataConnection, MediaConnection, Peer } from 'peerjs'
import { PeerMsgType } from '../../../types'

export class BasePeer {
  MAINID = '1'
  VIEWID = '2'
  HOST: string = '192.168.31.52'
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

