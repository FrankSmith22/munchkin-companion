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

const rooms = {}

io.on(E.CONNECTION, socket => {
    console.log('client connected: ' + socket.id)
    let playerRoomId
    let playerObj
    // Connected as PLAYER
    socket.on(E.PLAYER_CONNECT, ({playerName, roomId}) => {
        playerRoomId = roomId
        playerObj = new Player(socket.id, playerName)
        socket.join(playerRoomId)
        if (! (playerRoomId in rooms)) {
            rooms[playerRoomId] = {}
        }
        rooms[playerRoomId][socket.id] = playerObj
        console.log(`${playerName} has joined room: ${playerRoomId}`)
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        // socket.to(playerRoomId).emit(E.PARTY_UPDATE, {"allPlayers": JSON.stringify(rooms[roomId])})
        // TODO Will also need to emit another event so that TV mode (and other players) get the message
    })

    socket.on(E.PLAYER_LEVEL_INC, () => {
        playerObj.level++
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        // socket.to(playerRoomId).emit(E.PARTY_UPDATE, {"allPlayers": JSON.stringify(rooms[roomId])})
    })

    socket.on(E.PLAYER_LEVEL_DEC, () => {
        playerObj.level = Math.max(playerObj.level - 1, 1)
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        // socket.to(playerRoomId).emit(E.PARTY_UPDATE, {"allPlayers": JSON.stringify(rooms[roomId])})
    })

    socket.on(E.PLAYER_GEAR_INC, () => {
        playerObj.gearBonus++
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        // socket.to(playerRoomId).emit(E.PARTY_UPDATE, {"allPlayers": JSON.stringify(rooms[roomId])})
    })

    socket.on(E.PLAYER_GEAR_DEC, () => {
        playerObj.gearBonus = Math.max(playerObj.gearBonus - 1, 0)
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        // socket.to(playerRoomId).emit(E.PARTY_UPDATE, {"allPlayers": JSON.stringify(rooms[roomId])})
    })
    // Connected as TV
    socket.on(E.TV_CONNECT, ({roomId}) => {
        socket.join(playerRoomId)
        socket.emit(E.TV_CONNECT, {"allPlayers": JSON.stringify(rooms[roomId])})
    })
})
io.on(E.DISCONNECTION, socket => {
    console.log('client disconnected: ' + socket.id)
})