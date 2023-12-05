export enum OpType {
  mousedown = 'mousedown',
  mousemove = 'mousemove',
  mouseup = 'mouseup',
  contextmenu = 'contextmenu',
  wheel = 'wheel',
  dragMouse = 'dragMouse',
  keydown = 'keydown'
}

export interface RobotMsgType {
  mouseType: OpType
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

export interface PeerMsgType {
  type: 'operate'
  data: RobotMsgType
}
