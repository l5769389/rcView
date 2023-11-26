<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import _ from 'lodash'
import { PeerMsgType } from '@renderer/types'
import { ClientPeer } from '@renderer/PeerHelper/ClientPeer'
import { ArrowMove20Filled } from '@vicons/fluent'
import { Eye } from '@vicons/fa'

type getMsgType = (e: MouseEvent | TouchEvent | WheelEvent, type?: string) => PeerMsgType

const remoteViewRef = ref()
const isOperatorRef = ref(true)

const peerHelper: ClientPeer = new ClientPeer((state) => {
  Object.assign(connectState, state)
})

const connectState = reactive({
  connect2Server: false,
  connect2Peer: false
})

const handleEvent = (e: MouseEvent | TouchEvent | WheelEvent) => {
  console.log(e.type)
  if (!isOperatorRef.value) {
    return
  }
  if (peerHelper.connectState.connect2Peer) {
    const msg = getMsg(e)
    peerHelper.sendMsg(msg)
  }
}

const handleMove = _.throttle(handleEvent, 20)

const handleUp = (e) => {
  if (!isOperatorRef.value) {
    return
  }
  if (peerHelper.connectState.connect2Peer) {
    const msg = getMsg(e, 'mouseup')
    peerHelper.sendMsg(msg)
  }
}
let mousedownFlag = false
const getMsg: getMsgType = (e: WheelEvent | MouseEvent | TouchEvent, type = e.type) => {
  let clientX, clientY
  if (e instanceof WheelEvent) {
    clientX = e.deltaX
    clientY = e.deltaY
  } else if (e instanceof MouseEvent) {
    clientX = e.clientX
    clientY = e.clientY
  } else if (e instanceof TouchEvent) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  }
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

const viewConnect = () => {
  isOperatorRef.value = false
  peerHelper.connect2MainPeer((stream) => {
    remoteViewRef.value.srcObject = stream
  })
}

watch(
  () => connectState.connect2Peer,
  (newVal) => {
    if (newVal) {
      listenKeyInput()
    } else {
      removeKeyInputListen()
    }
  }
)

const listenKeyInput = () => {
  document.addEventListener('keydown', handleKeyEvent)
}
const removeKeyInputListen = () => {
  document.removeEventListener('keydown', handleKeyEvent)
}

const getKeydownMsg = (e) => {
  const { key } = e
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: 'keydown',
      x: -1,
      y: -1,
      key: key
    }
  }
  return msg
}

const handleKeyEvent = (e) => {
  const msg = getKeydownMsg(e)
  peerHelper.sendMsg(msg)
}

const disconnect = () => {
  peerHelper.disconnect()
}
</script>

<template>
  <div class="p-[10px] pt-[20px] text-[25px] bg-black w-full h-full relative overflow-hidden">
    <div class="h-[50px] absolute top-0 left-0 bg-amber-600 w-full z-10">
      <n-grid :cols="3">
        <n-gi>
          <span class="mr-[10px]">信令服务器连接状态：</span>
          <n-switch size="large" disabled v-model:value="connectState.connect2Server" />
        </n-gi>

        <n-gi>
          <span class="mr-[10px]">远程桌面连接状态:</span>
          <n-switch size="large" disabled v-model:value="connectState.connect2Peer" />
        </n-gi>

        <n-gi>
          <n-button
            size="large"
            type="primary"
            @click="connect"
            :disabled="connectState.connect2Peer"
          >
            <span class="mr-[5px]">操作主控制盒</span>
            <n-icon size="20">
              <arrow-move20-filled />
            </n-icon>
          </n-button>
          <n-button
            size="large"
            type="primary"
            @click="viewConnect"
            :disabled="connectState.connect2Peer"
          >
            <span class="mr-[5px]">镜像主控制盒</span>
            <n-icon size="20">
              <eye />
            </n-icon>
          </n-button>
          <n-button
            size="large"
            type="warning"
            @click="disconnect"
            :disabled="!connectState.connect2Peer"
            >断开连接
          </n-button>
        </n-gi>
      </n-grid>
    </div>
    <div class="w-full h-full flex justify-center">
      <video
        class="w-max-[100%] h-max-[100%]"
        :class="isOperatorRef ? 'cursor-none' : ''"
        v-show="connectState.connect2Peer"
        ref="remoteViewRef"
        autoplay
        playsinline
        muted
        @mousedown="handleEvent"
        @mousemove="handleMove"
        @mouseup="handleUp"
        @mouseleave="handleUp"
        @mouseout="handleUp"
        @wheel="console.log($event)"
        @contextmenu="handleEvent"
      ></video>
    </div>
  </div>
</template>

<style scoped></style>
