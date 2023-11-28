import { MediaConnection } from 'peerjs'

export type stateChangeCbType = (state: ConnectStateType) => void
export type connectCbType = (stream: MediaStream) => void
export type ConnectStateType = {
  connect2Server?: boolean
  connect2Peer?: boolean
  callMap?: Map<number, MediaConnection>
}
