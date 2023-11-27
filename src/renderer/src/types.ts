interface PeerMsgType {
  type: 'operate'
  data: {
    x?: number
    y?: number
    mouseType: string
    keys?: {
      key?: string
      ctrlKey?: boolean
      shiftKey?: boolean
      altKey?: boolean
    }
  }
}

export type { PeerMsgType }
