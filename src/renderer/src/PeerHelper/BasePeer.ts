import { stateChangeCbType } from './PeerTypes'

export class BasePeer {
  MAINID = '1'
  HOST: string = '192.168.3.243'
  PORT: number = 9000
  connectState = {
    connect2Server: false,
    connect2Peer: false,
    callMap: new Map<number, any>()
  }
  connectStateChangeCb?: stateChangeCbType

  constructor(connectStateChangeCb?: stateChangeCbType) {
    this.connectStateChangeCb = connectStateChangeCb
  }

  updateConnectState(newState: Object) {
    Object.assign(this.connectState, newState)
    this.connectStateChangeCb?.(this.connectState)
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
