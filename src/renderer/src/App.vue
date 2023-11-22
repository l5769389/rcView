<script setup lang="ts">
import {Peer} from 'peerjs'
import {ref} from 'vue'
import _ from 'lodash'

const MAINID = '1'
const VIEWID = '2'
const HOST = '192.168.31.52'
const currentID = ref(VIEWID)


const peer = new Peer(currentID.value, {
  host: HOST,
  port: 9000
})
const connect2ServerFlag = ref(false)
const connect2PeerFlag = ref(false)
// 与信令服务器
peer.on('open', () => {
  connect2ServerFlag.value = true
})
// 与信令服务器
peer.on('disconnected', () => {
  connect2ServerFlag.value = false
})

// 与peer
peer.on('connection', async (conn) => {
  connect2PeerFlag.value = true
  conn.on('data', function (data) {
    console.log('Received', data);
  });

  conn.on('close', () => {
    connect2PeerFlag.value = false
  })
})

peer.on('call', async (call) => {
  const localStream: MediaStream = await getLocalStream()
  call.answer(localStream)
})

const remoteViewRef = ref()

const getLocalStream = () => {
  return navigator.mediaDevices.getUserMedia({
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
      },
      optional: [
        {minFrameRate: 10},
        {maxFrameRate: 90}
      ]
    },
    audio: false,
  })
}
let conn
const connect = () => {
  conn = peer.connect(MAINID)
  setTimeout(async () => {
    const localStream: MediaStream = await getLocalStream()
    const call = peer.call(MAINID, localStream)
    call.on('stream', (stream) => {
      connect2PeerFlag.value = true
      remoteViewRef.value.srcObject = stream
    })
  }, 1000)
}


const handleEvent = _.throttle((e) => {
  if (currentID.value === VIEWID && connect2PeerFlag.value) {
    const msg = getMsg(e)
    conn.send(msg)
  }
}, 20)
let mousedownFlag = false;
const getMsg = (e) => {
  const {type, clientX, clientY} = e;
  let ansType = type;
  if (type === 'mousedown') {
    mousedownFlag = true;
  } else if (type === 'mouseup') {
    mousedownFlag = false;
  } else if (type === 'mousemove' && mousedownFlag) {
    // 鼠标按下左键且拖动。
    ansType = 'dragMouse'
  }
  const ratio = 1
  const deltaX = 0
  const deltaY = 0
  return {
    type: 'operate',
    data: {
      mouseType: ansType,
      clientX: (ratio * (clientX - deltaX)).toFixed(0),
      clientY: (ratio * (clientY - deltaY)).toFixed(0)
    }
  }
}

</script>

<template>
  <div>
    <p>信令服务器连接状态：{{ connect2ServerFlag }}</p>
    <p>远程桌面连接状态:{{ connect2PeerFlag }}</p>
    <template v-if="currentID === VIEWID">
      <button @click="connect">连接到主控</button>
    </template>
    <video ref="remoteViewRef"
           autoplay playsinline muted
           style="width: 1000px; height: 1000px"
           @click="handleEvent"
           @mousedown="handleEvent"
           @mousemove="handleEvent"
           @mouseup="handleEvent"
    ></video>
  </div>
</template>

<style lang="less"></style>
