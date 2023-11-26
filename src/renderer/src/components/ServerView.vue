<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ServerPeer } from '../PeerHelper/ServerPeer'

const connectState = ref({
  connect2Server: false,
  connect2Peer: false,
  callMap: new Map()
})

const countRef = ref(0)
const clients = ref([])

const server = new ServerPeer((state) => {
  console.log('cb', state)
  Object.assign(connectState.value, state)
  countRef.value = connectState.value.callMap.size
  clients.value = Array.from(connectState.value.callMap.keys())
  console.log(clients.value)
})

const disconnect = (key: number) => {
  server.disconnect2PeerCall(key)
}
</script>

<template>
  <div class="p-[10px] text-2xl">
    <n-grid :cols="2">
      <n-gi>
        <span class="mr-[10px]">信令服务器连接状态：</span>
        <n-switch size="large" disabled v-model:value="connectState.connect2Server" />
      </n-gi>
      <n-gi>
        <p>连接客户端数量：{{ countRef }}</p>
      </n-gi>
    </n-grid>
    <template v-if="clients.length > 0">
      <span>断开连接：</span>
      <n-button
        type="warning"
        style="margin-right: 10px"
        v-for="(item, index) in clients"
        :key="item"
        @click="disconnect(item)"
        >客户端{{ index + 1 }}
      </n-button>
    </template>
  </div>
</template>

<style scoped></style>
