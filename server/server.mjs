import { Server } from "socket.io"
import { createServer } from 'http'
import { EVENTS as E} from "./events.mjs"
import Player from "./models.mjs"

const httpServer = createServer()

const io = new Server(4000, {
    cors: {
        origin: ["http://localhost:3000", "http://192.168.1.169:3000", "http://192.168.1.155:3000", "https://franksmith22.github.io"]
    }
})

const users = {}

io.on(E.CONNECTION, socket => {
    console.log('client connected: ' + socket.id)
    // Connected as PLAYER
    socket.on(E.PLAYER_CONNECT, ({playerName}) => {
        console.log(playerName)
        let newPlayer = new Player(socket.id, playerName)
        socket.emit(E.PLAYER_JOIN, {"newPlayer": JSON.stringify(newPlayer)})
    })
    // Connected as TV
})
io.on(E.DISCONNECTION, socket => {
    console.log('client disconnected: ' + socket.id)
})