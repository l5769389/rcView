<script setup lang="ts">
import { Peer } from 'peerjs'
import { ref } from 'vue'

const peer = new Peer('1', {
  host: '192.168.3.243',
  port: 9000
})
const connect2ServerFlag = ref(false)
peer.on('open',() => {
  connect2ServerFlag.value = true
})

peer.on('connection', (conn) => {
  console.log('connect')
  conn.on('data', (data) => {
    // Will print 'hi!'
    console.log(data)
  })
  conn.on('open', () => {
    conn.send('hello!')
  })
})


const connect = () => {
  peer.connect('1')
}
</script>

<template>
  <div>
    连接到服务器：{{connect2ServerFlag}}
    <button @click="connect">连接到对方</button>
  </div>
</template>

<style lang="less"></style>
