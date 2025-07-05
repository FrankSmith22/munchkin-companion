import { io } from 'socket.io-client';

// dev
export let socket = io('http://192.168.1.169:4000', {autoConnect: false})
// live
// export let socket = io('https://munchkin-companion-server.glitch.me', {autoConnect: false})

