<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import _ from 'lodash'
import { PeerMsgType } from '@renderer/types'
import { ClientPeer } from '@renderer/PeerHelper/ClientPeer'
import { ArrowMove20Filled } from '@vicons/fluent'
import { Eye, AngleDoubleLeft, AngleDoubleRight } from '@vicons/fa'
import { OpType } from '@config/types'

const remoteViewRef = ref()
const isOperatorRef = ref(true)

const peerHelper: ClientPeer = new ClientPeer((state) => {
  Object.assign(connectState, state)
})

const connectState = reactive({
  connect2Server: false,
  connect2Peer: false
})

let mousedownFlag = false
const handleTouchstart = (e: TouchEvent) => {
  console.log('touch start')
  const clientX = e.touches[0]?.clientX
  const clientY = e.touches[0]?.clientY
  const { x, y } = getUniformedPosition(clientX, clientY)
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: OpType.mousedown,
      x,
      y
    }
  }
  sendMsg(msg)
}

const handleMousedown = (e: MouseEvent) => {
  console.log('mousedown')
  const clientX = e.clientX
  const clientY = e.clientY
  mousedownFlag = true
  const { x, y } = getUniformedPosition(clientX, clientY)
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: OpType.mousedown,
      x,
      y
    }
  }
  sendMsg(msg)
}
const handleTouchMove = _.throttle((e: TouchEvent) => {
  const clientX = e.touches[0]?.clientX
  const clientY = e.touches[0]?.clientY
  const { x, y } = getUniformedPosition(clientX, clientY)
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: OpType.dragMouse,
      x,
      y
    }
  }
  sendMsg(msg)
}, 50)
const handleMouseMove = _.throttle((e: MouseEvent) => {
  const clientX = e.clientX
  const clientY = e.clientY
  const { x, y } = getUniformedPosition(clientX, clientY)
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: mousedownFlag ? OpType.dragMouse : OpType.mousemove,
      x,
      y
    }
  }
  sendMsg(msg)
}, 20)
const handleTouchend = () => {
  mousedownFlag = false
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: OpType.mouseup
    }
  }
  sendMsg(msg)
}
const handleTouchCancel = () => {
  mousedownFlag = false
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: OpType.mouseup
    }
  }
  sendMsg(msg)
}
const handleMouseup = () => {
  console.log('mouse up')
  mousedownFlag = false
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: OpType.mouseup
    }
  }
  sendMsg(msg)
}
const handleMouseleave = () => {
  mousedownFlag = false
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: OpType.mouseup
    }
  }
  sendMsg(msg)
}
const handleMouseout = () => {
  mousedownFlag = false
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: OpType.mouseup
    }
  }
  sendMsg(msg)
}
const handleWheel = (e: WheelEvent) => {
  const clientX = e.deltaX
  const clientY = e.deltaY
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: OpType.wheel,
      deltaX: clientX,
      deltaY: clientY
    }
  }
  console.log(JSON.stringify(msg))
  sendMsg(msg)
}
const handleContextmenu = () => {
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: OpType.contextmenu
    }
  }
  sendMsg(msg)
}

const sendMsg = (msg) => {
  if (!isOperatorRef.value || !peerHelper.connectState.connect2Peer) {
    return
  }
  peerHelper.sendMsg(msg)
}

const videoSizeRef = ref({
  width: 1,
  height: 1
})

const videoActualSizeRef = ref({
  width: 1,
  height: 1
})

const getUniformedPosition = (clientX: number, clientY: number) => {
  const { width, height, left, top } = remoteViewRef.value.getBoundingClientRect()
  videoSizeRef.value = {
    width: width,
    height: height
  }
  const x = clientX - left
  const y = clientY - top
  return {
    x: x / videoActualSizeRef.value.width,
    y: y / videoActualSizeRef.value.height
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
  document.addEventListener(OpType.keydown, handleKeyEvent)
}
const removeKeyInputListen = () => {
  document.removeEventListener(OpType.keydown, handleKeyEvent)
}

const getKeydownMsg = (e: KeyboardEvent) => {
  const { ctrlKey, shiftKey, altKey, key, code } = e
  let sendKey = key
  if (shiftKey) {
    // todo 键盘的映射。
    if (code.includes('Digit')) {
      sendKey = code[code.length - 1]
    }
  }
  const msg: PeerMsgType = {
    type: 'operate',
    data: {
      mouseType: OpType.keydown,
      keys: {
        key: sendKey,
        ctrlKey,
        shiftKey,
        altKey
      }
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

const isFoldRef = ref(false)

const handleCanplay = () => {
  videoActualSizeRef.value = {
    width: remoteViewRef.value.videoWidth,
    height: remoteViewRef.value.videoHeight
  }
}
</script>

<template>
  <div class="p-[10px] pt-[20px] text-[25px] bg-black w-full h-full relative overflow-hidden">
    <div class="h-[50px] absolute top-0 left-0 z-10">
      <div
        v-if="!isFoldRef"
        class="w-full h-full bg-amber-300 flex justify-between space-x-[20px] pl-[20px] pr-[20px]"
      >
        <div>
          <span class="mr-[10px]">信令服务器连接状态：</span>
          <n-switch v-model:value="connectState.connect2Server" size="large" disabled />
        </div>
        <div>
          <span class="mr-[10px]">远程桌面连接状态:</span>
          <n-switch v-model:value="connectState.connect2Peer" size="large" disabled />
        </div>
        <div>
          <n-button
            :disabled="connectState.connect2Peer"
            size="large"
            type="primary"
            @click="connect"
          >
            <span class="mr-[5px]">操作主控制盒</span>
            <n-icon size="20">
              <arrow-move20-filled />
            </n-icon>
          </n-button>
          <n-button
            :disabled="connectState.connect2Peer"
            size="large"
            type="primary"
            @click="viewConnect"
          >
            <span class="mr-[5px]">镜像主控制盒</span>
            <n-icon size="20">
              <eye />
            </n-icon>
          </n-button>
          <n-button
            :disabled="!connectState.connect2Peer"
            size="large"
            type="error"
            @click="disconnect"
            >断开连接
          </n-button>
        </div>
        <n-button text @click="isFoldRef = !isFoldRef">
          <n-icon size="40" class="text-gray-500">
            <angle-double-left />
          </n-icon>
        </n-button>
      </div>

      <div v-else>
        <n-button text @click="isFoldRef = !isFoldRef">
          <n-icon size="40" class="text-gray-500">
            <angle-double-right />
          </n-icon>
        </n-button>
      </div>
    </div>
    <div class="w-full h-full flex justify-center">
      <video
        ref="remoteViewRef"
        class="w-max-[100%] h-max-[100%]"
        :class="isOperatorRef ? 'cursor-none' : ''"
        autoplay
        playsinline
        muted
        @canplay="handleCanplay"
        @touchstart="handleTouchstart"
        @mousedown="handleMousedown"
        @touchmove="handleTouchMove"
        @mousemove="handleMouseMove"
        @touchend="handleTouchend"
        @touchcancel="handleTouchCancel"
        @mouseup="handleMouseup"
        @mouseleave="handleMouseleave"
        @mouseout="handleMouseout"
        @wheel="handleWheel"
        @contextmenu="handleContextmenu"
      ></video>
    </div>
  </div>
</template>

<style scoped></style>
