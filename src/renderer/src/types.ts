interface PeerMsgType {
  type: 'operate'
  data: {
    mouseType: string
    x?: number
    y?: number
    deltaX?: number
    deltaY?: number
    keys?: {
      key?: string
      ctrlKey?: boolean
      shiftKey?: boolean
      altKey?: boolean
    }
  }
}

export type { PeerMsgType }
