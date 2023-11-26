import {stateChangeCbType} from './PeerTypes'

export class BasePeer {
    MAINID = '1'
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

    getLocalStream = async () => {
        const sourceId = await window.electron.ipcRenderer.invoke('desktop')
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    minWidth: 1280,
                    maxWidth: 1280,
                    minHeight: 720,
                    maxHeight: 720
                }
            }
        })
        return stream
    }
}
