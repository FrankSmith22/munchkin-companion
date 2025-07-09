import { io } from 'socket.io-client';

// dev
export let socket = io('http://192.168.1.169:4000', {autoConnect: false})
// live
// TODO find a new hosting platform, RIP glitch hosting
// export let socket = io('https://munchkin-companion-server.glitch.me', {autoConnect: false})

