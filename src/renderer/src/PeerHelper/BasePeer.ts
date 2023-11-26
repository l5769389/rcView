import { stateChangeCbType } from './PeerTypes'
import Config from '../../../config/config'

export class BasePeer {
  MAINID = Config.SERVER_ID
  HOST = Config.SIGNAL_SERVER_IP
  PORT = Config.SIGNAL_SERVER_PORT
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

  getLocalStream = async () => {
    const { width: screenWidth, height: screenHeight } = screen
    const width = screenWidth * Config.VIEW_RESOLUTION
    const height = screenHeight * Config.VIEW_RESOLUTION
    const sourceId = await window['electron'].ipcRenderer.invoke('desktop')
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          minWidth: width,
          maxWidth: width,
          minHeight: height,
          maxHeight: height
        }
      }
    })
    return stream
  }
}
