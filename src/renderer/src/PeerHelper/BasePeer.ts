import { stateChangeCbType } from './PeerTypes'

export class BasePeer {
  MAINID = '1'
  VIEWID = '2'
  HOST: string = '192.168.31.52'
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
      video: true
    }
    return navigator.mediaDevices.getDisplayMedia(constraint)
  }
}
