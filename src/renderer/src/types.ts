interface PeerMsgType {
  type: 'operate'
  data: {
    x: number
    y: number
    mouseType: string,
    key?: string
  }
}

export type { PeerMsgType }
