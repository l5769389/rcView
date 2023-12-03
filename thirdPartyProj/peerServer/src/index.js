import {PeerServer} from 'peer'

PeerServer({
    port: 9000,
    path: '/'
}, server => {
    console.log('peer server start')
})
