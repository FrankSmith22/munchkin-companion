import { Server } from "socket.io"
import { createServer } from 'http'
import { EVENTS as E} from "./events.mjs"
import Player from "./models.mjs"
import { v4 as uuidv4 } from 'uuid';

const httpServer = createServer()

const io = new Server(4000, {
    cors: {
        origin: ["http://localhost:3000", "http://192.168.1.169:3000", "http://192.168.1.155:3000", "http://192.168.1.176:3000", "https://franksmith22.github.io"]
    }
})

const rooms = {}

io.on(E.CONNECTION, socket => {
    console.log('client connected: ' + socket.id)
    let playerRoomId
    let playerObj
    let connId = uuidv4()
    // Connected as PLAYER
    socket.on(E.PLAYER_CONNECT, ({playerName, roomId}) => {
        playerRoomId = roomId
        playerObj = new Player(connId, playerName)
        socket.join(playerRoomId)
        if (! (playerRoomId in rooms)) {
            rooms[playerRoomId] = {}
        }
        rooms[playerRoomId][connId] = playerObj
        console.log(`${playerName} has joined room: ${playerRoomId}`)
        socket.emit(E.PLAYER_CONNECT, {"playerObj": JSON.stringify(playerObj), "roomId": playerRoomId})
        socket.to(playerRoomId).emit(E.PARTY_UPDATE, {"allPlayers": JSON.stringify(rooms[playerRoomId])})
    })
    
    socket.on(E.PLAYER_LEVEL_INC, () => {
        playerObj.level++
        rooms[playerRoomId][connId] = playerObj
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        socket.to(playerRoomId).emit(E.PARTY_UPDATE, {"allPlayers": JSON.stringify(rooms[playerRoomId])})
    })

    socket.on(E.PLAYER_LEVEL_DEC, () => {
        playerObj.level = Math.max(playerObj.level - 1, 1)
        rooms[playerRoomId][connId] = playerObj
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        socket.to(playerRoomId).emit(E.PARTY_UPDATE, {"allPlayers": JSON.stringify(rooms[playerRoomId])})
    })

    socket.on(E.PLAYER_GEAR_INC, () => {
        playerObj.gearBonus++
        rooms[playerRoomId][connId] = playerObj
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        socket.to(playerRoomId).emit(E.PARTY_UPDATE, {"allPlayers": JSON.stringify(rooms[playerRoomId])})
    })

    socket.on(E.PLAYER_GEAR_DEC, () => {
        playerObj.gearBonus = Math.max(playerObj.gearBonus - 1, 0)
        rooms[playerRoomId][connId] = playerObj
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        socket.to(playerRoomId).emit(E.PARTY_UPDATE, {"allPlayers": JSON.stringify(rooms[playerRoomId])})
    })
    // Connected as TV
    socket.on(E.TV_CONNECT, ({roomId}) => {
        playerRoomId = roomId
        socket.join(playerRoomId)
        socket.emit(E.TV_CONNECT, {"allPlayers": JSON.stringify(rooms[playerRoomId]), "roomId": playerRoomId})
    })
    // Reconnect
    socket.on(E.PLAYER_RECONNECT, ({connId, roomId}) => {
        playerRoomId = roomId
        connId = connId
        playerObj = rooms[playerRoomId][connId]
        socket.join(playerRoomId)
        socket.emit(E.PLAYER_CONNECT, {"playerObj": JSON.stringify(playerObj), "roomId": playerRoomId})
    })
})
io.on(E.DISCONNECTION, socket => {
    console.log('client disconnected: ' + socket.id)
})