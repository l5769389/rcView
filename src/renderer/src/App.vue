<script setup lang="ts">
import { Peer } from 'peerjs'
import { ref } from 'vue'

const peer = new Peer('1', {
  host: '192.168.31.52',
  port: 9000
})
const connect2ServerFlag = ref(false)
peer.on('open', () => {
  console.log('open')
  connect2ServerFlag.value = true
})

const connect = () => {
  peer.connect('1')
}
</script>

<template>
  <div>
    连接到服务器：{{ connect2ServerFlag }}
    <button @click="connect">连接到对方</button>
  </div>
</template>

<style lang="less"></style>
