import { io } from 'socket.io-client';

// export let socket = io('http://localhost:4000', {autoConnect: false})
export let socket = io('https://munchkin-companion-server.glitch.me', {autoConnect: false})

