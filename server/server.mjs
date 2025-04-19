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
    let playerRoomId
    let playerObj
    // Connected as PLAYER
    socket.on(E.PLAYER_CONNECT, ({playerName, roomId}) => {
        playerRoomId = roomId
        playerObj = new Player(socket.id, playerName)
        socket.join(playerRoomId)
        console.log(`${playerName} has joined room: ${playerRoomId}`)
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        // TODO Will also need to emit another event so that TV mode (and other players) get the message
    })
    socket.on(E.PLAYER_LEVEL_INC, () => {
        playerObj.level++
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
    })
    socket.on(E.PLAYER_LEVEL_DEC, () => {
        playerObj.level = Math.max(playerObj.level - 1, 1)
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
    })
    socket.on(E.PLAYER_GEAR_INC, () => {
        playerObj.gearBonus++
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
    })
    socket.on(E.PLAYER_GEAR_DEC, () => {
        playerObj.gearBonus = Math.max(playerObj.gearBonus - 1, 0)
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
    })
    // Connected as TV
    // TODO Write me
})
io.on(E.DISCONNECTION, socket => {
    console.log('client disconnected: ' + socket.id)
})