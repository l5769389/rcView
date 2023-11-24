<script setup lang="ts">
import { ref } from 'vue'
import _ from 'lodash'
import { PeerMsgType } from '@renderer/types'
import { ClientPeer } from '@renderer/PeerHelper/ClientPeer'

type getMsgType = (e: MouseEvent) => PeerMsgType

const remoteViewRef = ref()

const peerHelper: ClientPeer = new ClientPeer((state) => {
  Object.assign(connectState.value, state)
})

const connectState = ref({
  connect2Server: false,
  connect2Peer: false
})

const handleEvent = _.throttle((e) => {
  if (peerHelper.connectState.connect2Peer) {
    const msg = getMsg(e)
    peerHelper.sendMsg(msg)
  }
}, 20)

let mousedownFlag = false

const getMsg: getMsgType = (e: MouseEvent) => {
  const { type, clientX, clientY } = e
  const { x, y } = getUniformedPosition(clientX, clientY)
  let ansType = type
  if (type === 'mousedown') {
    mousedownFlag = true
  } else if (type === 'mouseup') {
    mousedownFlag = false
  } else if (type === 'mousemove' && mousedownFlag) {
    // 鼠标按下左键且拖动。
    ansType = 'dragMouse'
  }
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: ansType,
      x,
      y
    }
  }
  return msg
}

const getUniformedPosition = (clientX: number, clientY: number) => {
  const { width, height, left, top } = remoteViewRef.value.getBoundingClientRect()
  const x = clientX - left
  const y = clientY - top
  return {
    x: x / width,
    y: y / height
  }
}
const connect = () => {
  peerHelper.connect2MainPeer((stream) => {
    remoteViewRef.value.srcObject = stream
  })
}
</script>

<template>
  <div>
    <p class="text-red-400 text-5xl">信令服务器连接状态：{{ connectState.connect2Server }}</p>
    <p>远程桌面连接状态:{{ connectState.connect2Peer }}</p>
    <button @click="connect">连接到主控</button>
    <video
      v-if="connectState.connect2Peer"
      ref="remoteViewRef"
      autoplay
      playsinline
      muted
      style="width: 100%; height: 100%"
      @click="handleEvent"
      @mousedown="handleEvent"
      @mousemove="handleEvent"
      @mouseup="handleEvent"
    ></video>
  </div>
</template>

<style scoped></style>
