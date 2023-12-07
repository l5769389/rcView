<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import _ from 'lodash'
import type { PeerMsgType } from '@config/types'
import { OpType } from '@config/types'
import { ClientPeer } from '@renderer/PeerHelper/ClientPeer'
import { ArrowMove20Filled } from '@vicons/fluent'
import { AngleDoubleLeft, AngleDoubleRight, Eye } from '@vicons/fa'

const remoteViewRef = ref()
const isOperatorRef = ref(true)
let peerHelper: ClientPeer

onMounted(() => {
  connect2peer()
})

const connect2peer = () => {
  peerHelper = new ClientPeer((state) => {
    Object.assign(connectState, state)
  })
}

const connectState = reactive({
  connect2Server: false,
  connect2Peer: false
})

class VideoOp {
  static mousedownFlag = false

  static handleTouchstart = (e: TouchEvent) => {
    console.log('touch start')
    const clientX = e.touches[0]?.clientX
    const clientY = e.touches[0]?.clientY
    const { x, y } = this.getUniformedPosition(clientX, clientY)
    const msg: PeerMsgType = {
      type: 'operate',
      data: {
        mouseType: OpType.mousedown,
        x,
        y
      }
    }
    this.sendMsg(msg)
  }

  static handleMousedown = (e: MouseEvent) => {
    console.log('mousedown')
    const clientX = e.clientX
    const clientY = e.clientY
    this.mousedownFlag = true
    const { x, y } = this.getUniformedPosition(clientX, clientY)
    const msg: PeerMsgType = {
      type: 'operate',
      data: {
        mouseType: OpType.mousedown,
        x,
        y
      }
    }
    this.sendMsg(msg)
  }

  static handleTouchMove = _.throttle((e: TouchEvent) => {
    const clientX = e.touches[0]?.clientX
    const clientY = e.touches[0]?.clientY
    const { x, y } = this.getUniformedPosition(clientX, clientY)
    const msg: PeerMsgType = {
      type: 'operate',
      data: {
        mouseType: OpType.dragMouse,
        x,
        y
      }
    }
    this.sendMsg(msg)
  }, 50)

  static handleMouseMove = _.throttle((e: MouseEvent) => {
    const clientX = e.clientX
    const clientY = e.clientY
    const { x, y } = this.getUniformedPosition(clientX, clientY)
    const msg: PeerMsgType = {
      type: 'operate',
      data: {
        mouseType: this.mousedownFlag ? OpType.dragMouse : OpType.mousemove,
        x,
        y
      }
    }
    this.sendMsg(msg)
  }, 20)

  static handleTouchend = () => {
    this.mousedownFlag = false
    const msg: PeerMsgType = {
      type: 'operate',
      data: {
        mouseType: OpType.mouseup
      }
    }
    this.sendMsg(msg)
  }
  static handleTouchCancel = () => {
    this.mousedownFlag = false
    const msg: PeerMsgType = {
      type: 'operate',
      data: {
        mouseType: OpType.mouseup
      }
    }
    this.sendMsg(msg)
  }
  static handleMouseup = () => {
    console.log('mouse up')
    this.mousedownFlag = false
    const msg: PeerMsgType = {
      type: 'operate',
      data: {
        mouseType: OpType.mouseup
      }
    }
    this.sendMsg(msg)
  }

  static handleMouseleave = () => {
    this.mousedownFlag = false
    const msg: PeerMsgType = {
      type: 'operate',
      data: {
        mouseType: OpType.mouseup
      }
    }
    this.sendMsg(msg)
  }

  static handleMouseout = () => {
    this.mousedownFlag = false
    const msg: PeerMsgType = {
      type: 'operate',
      data: {
        mouseType: OpType.mouseup
      }
    }
    this.sendMsg(msg)
  }
  static handleWheel = (e: WheelEvent) => {
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
    this.sendMsg(msg)
  }

  static handleContextmenu = () => {
    const msg: PeerMsgType = {
      type: 'operate',
      data: {
        mouseType: OpType.contextmenu
      }
    }
    this.sendMsg(msg)
  }

  static sendMsg = (msg) => {
    if (!isOperatorRef.value || !peerHelper.connectState.connect2Peer) {
      return
    }
    peerHelper.sendMsg(msg)
  }

  static getUniformedPosition = (clientX: number, clientY: number) => {
    const { width, height, left, top } = remoteViewRef.value.getBoundingClientRect()
    videoSizeRef.value = {
      width: width,
      height: height
    }
    const x = clientX - left
    const y = clientY - top
    return {
      x: x / videoSizeRef.value.width,
      y: y / videoSizeRef.value.height
    }
  }

  static getKeydownMsg = (e: KeyboardEvent) => {
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

  static handleKeyEvent = (e) => {
    const msg = VideoOp.getKeydownMsg(e)
    peerHelper.sendMsg(msg)
  }
}

const videoSizeRef = ref({
  width: 1,
  height: 1
})

const videoActualSizeRef = ref({
  width: 1,
  height: 1
})

const connect = () => {
  isOperatorRef.value = true
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
  document.addEventListener(OpType.keydown, VideoOp.handleKeyEvent)
}
const removeKeyInputListen = () => {
  document.removeEventListener(OpType.keydown, VideoOp.handleKeyEvent)
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
  <div class="text-[25px] bg-black w-full h-full relative overflow-hidden">
    <div class="h-[50px] absolute top-0 left-0 z-10">
      <div
        v-if="!isFoldRef"
        class="w-full h-full bg-amber-300 flex justify-between space-x-[20px] pl-[20px] pr-[20px]"
      >
        <div>
          <span class="mr-[10px]">信令服务器连接状态：</span>
          <n-switch v-model:value="connectState.connect2Server" size="large" disabled />
          <n-button v-if="!connectState.connect2Server" @click="connect2peer"
            >连接信令服务器
          </n-button>
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
    <div class="w-full h-full flex justify-center items-center">
      <video
        ref="remoteViewRef"
        class="video object-contain"
        :class="isOperatorRef ? 'cursor-none' : ''"
        autoplay
        playsinline
        muted
        @canplay="handleCanplay"
        @touchstart="VideoOp.handleTouchstart"
        @mousedown="VideoOp.handleMousedown"
        @touchmove="VideoOp.handleTouchMove"
        @mousemove="VideoOp.handleMouseMove"
        @touchend="VideoOp.handleTouchend"
        @touchcancel="VideoOp.handleTouchCancel"
        @mouseup="VideoOp.handleMouseup"
        @mouseleave="VideoOp.handleMouseleave"
        @mouseout="VideoOp.handleMouseout"
        @wheel="VideoOp.handleWheel"
        @contextmenu="VideoOp.handleContextmenu"
      ></video>
    </div>
  </div>
</template>

<style scoped>
.video {
  width: 100%;
  height: calc(100% - 100px);
}
</style>
