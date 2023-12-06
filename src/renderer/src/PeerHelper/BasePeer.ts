import { ConnectStateType, stateChangeCbType } from './PeerTypes'
import { MediaConnection } from 'peerjs'
import { config } from '@/config/config'

console.log(`config: ${JSON.stringify(config)}`)

export class BasePeer {
  MAINID = config.SERVER_ID
  HOST = config.SIGNAL_SERVER_IP
  PORT = config.SIGNAL_SERVER_PORT
  connectState: ConnectStateType = {
    connect2Server: false,
    connect2Peer: false,
    callMap: new Map<number, MediaConnection>()
  }
  screenSize = {
    width: 1,
    height: 1,
    scaleFactor: 1
  }
  connectStateChangeCb?: stateChangeCbType

  constructor(connectStateChangeCb?: stateChangeCbType) {
    this.connectStateChangeCb = connectStateChangeCb
  }

  updateConnectState(newState: ConnectStateType) {
    Object.assign(this.connectState, newState)
    this.connectStateChangeCb?.(this.connectState)
  }

  getLocalStream = async () => {
    const { sourceId, width, height, scaleFactor } =
      await window['electron'].ipcRenderer.invoke('desktop')
    this.screenSize = {
      width,
      height,
      scaleFactor
    }
    if (sourceId === -1) {
      throw new Error('get local stream sourceId error')
    }
    return await (navigator.mediaDevices as any).getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          minWidth: width,
          maxWidth: width,
          minHeight: height,
          maxHeight: height
        },
        optional: [{ minFrameRate: 15 }, { maxFrameRate: 30 }]
      }
    })
  }
}
