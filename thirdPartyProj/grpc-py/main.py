import signal
import sys
import time
from concurrent import futures
import grpc
import pyautogui

import robotOp_pb2, robotOp_pb2_grpc



class Handler(robotOp_pb2_grpc.robotOpServicer):

  def Opmouse(self, request, context):
    mouseType = request.mouseType
    if mouseType == 'mousemove':
      pyautogui.moveTo(request.x, request.y)
    elif mouseType == 'mousedown':
      pyautogui.mouseDown()
    elif mouseType == 'mouseup':
      pyautogui.mouseUp()
    elif mouseType == 'dragMouse':
      pyautogui.moveTo(request.x, request.y)
    elif mouseType == 'keydown':
      self.input_key(request.keys)
    elif mouseType == 'contextmenu':
      pyautogui.rightClick()
    elif mouseType == 'wheel':
      pyautogui.scroll(request.deltaY)
    return robotOp_pb2.Reply(message="success")

  def input_key(self, keys):
    key = keys.key
    dict = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right'
    }
    if key in dict:
      return pyautogui.press(dict[key])
    ctrKey = keys.ctrKey
    shiftKey = keys.shiftKey
    altKey = keys.altKey
    params = []
    if shiftKey is True:
      params.append('shift')
    elif ctrKey is True:
      params.append('ctrl')
    elif altKey is True:
      params.append('alt')
    params.append(key)
    pyautogui.hotkey(*params)


def run():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  robotOp_pb2_grpc.add_robotOpServicer_to_server(Handler(), server)
  server.add_insecure_port('0.0.0.0:50052')
  server.start()
  print("start service...")
  try:
    while True:
      time.sleep(60 * 60 * 24)
  except KeyboardInterrupt:
    server.stop(0)


if __name__ == '__main__':
  run()
