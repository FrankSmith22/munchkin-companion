import { io } from 'socket.io-client';

let socket_url = process.env.REACT_APP_MUNCHKIN_SERVER_URL

if (!socket_url) {
    socket_url = 'https://munchkin-companion-server.onrender.com'
}

export let socket = io(socket_url, {autoConnect: false})