interface PeerMsgType {
  type: 'operate'
  data: {
    x: number
    y: number
    mouseType: string
  }
}

export type { PeerMsgType }
