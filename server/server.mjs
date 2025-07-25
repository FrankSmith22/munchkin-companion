import { Server } from "socket.io"
import { createServer } from 'http'
import { EVENTS as E} from "./events.mjs"
import { Player } from "./models.mjs"
import { v4 as uuidv4 } from 'uuid';
import { emitAllPlayersUpdate } from "./helper.mjs"
import { logger } from "./logger.mjs";



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
        emitAllPlayersUpdate(io, rooms, playerRoomId)
    })
    
    // level and modifier inc/dec
    // Player
    socket.on(E.PLAYER_LEVEL_INC, () => {
        if (!playerObj){
            socket.emit(E.DISCONNECT_ROOM)
            return
        }
        playerObj.level++
        rooms[playerRoomId][connId] = playerObj
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        emitAllPlayersUpdate(io, rooms, playerRoomId)
    })

    socket.on(E.PLAYER_LEVEL_DEC, () => {
        if (!playerObj){
            socket.emit(E.DISCONNECT_ROOM)
            return
        }
        playerObj.level = Math.max(playerObj.level - 1, 1)
        rooms[playerRoomId][connId] = playerObj
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        emitAllPlayersUpdate(io, rooms, playerRoomId)
    })

    socket.on(E.PLAYER_GEAR_INC, () => {
        if (!playerObj){
            socket.emit(E.DISCONNECT_ROOM)
            return
        }
        playerObj.gearBonus++
        rooms[playerRoomId][connId] = playerObj
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        emitAllPlayersUpdate(io, rooms, playerRoomId)
    })

    socket.on(E.PLAYER_GEAR_DEC, () => {
        if (!playerObj){
            socket.emit(E.DISCONNECT_ROOM)
            return
        }
        playerObj.gearBonus = Math.max(playerObj.gearBonus - 1, 0)
        rooms[playerRoomId][connId] = playerObj
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        emitAllPlayersUpdate(io, rooms, playerRoomId)
    })

    // Combat
    socket.on(E.COMBAT_PARTY_MOD_INC, () => {
        if (!playerObj){
            socket.emit(E.DISCONNECT_ROOM)
            return
        }
        playerObj.combat.partyModifier++
        rooms[playerRoomId][connId] = playerObj
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
    })
    socket.on(E.COMBAT_PARTY_MOD_DEC, () => {
        if (!playerObj){
            socket.emit(E.DISCONNECT_ROOM)
            return
        }
        playerObj.combat.partyModifier = Math.max(playerObj.combat.partyModifier - 1, 0)
        rooms[playerRoomId][connId] = playerObj
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
    })
    socket.on(E.COMBAT_MONSTER_MOD_INC, () => {
        if (!playerObj){
            socket.emit(E.DISCONNECT_ROOM)
            return
        }
        playerObj.combat.monsterModifier++
        rooms[playerRoomId][connId] = playerObj
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
    })
    socket.on(E.COMBAT_MONSTER_MOD_DEC, () => {
        if (!playerObj){
            socket.emit(E.DISCONNECT_ROOM)
            return
        }
        playerObj.combat.monsterModifier = Math.max(playerObj.combat.monsterModifier - 1, 0)
        rooms[playerRoomId][connId] = playerObj
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
    })
    // Connected as TV
    socket.on(E.TV_CONNECT, ({roomId}) => {
        playerRoomId = roomId
        socket.join(playerRoomId)
        socket.emit(E.TV_CONNECT, {"allPlayers": JSON.stringify(rooms[playerRoomId]), "roomId": playerRoomId})
    })
    // Reconnect
    socket.on(E.PLAYER_RECONNECT, ({localConnId, roomId}) => {
        connId = localConnId
        if (roomId in rooms && connId in rooms[roomId]) {
            playerRoomId = roomId
            playerObj = rooms[playerRoomId][connId]
            socket.join(playerRoomId)
            console.log(`Player reconnecting: ${JSON.stringify(playerObj)}`)
            socket.emit(E.PLAYER_CONNECT, {"playerObj": JSON.stringify(playerObj), "roomId": playerRoomId})
        }
        else {
            // If the room ID the player tried to connect to doesn't exist, or the connId doesnt exist in that room,
            // send room disconnect
            socket.emit(E.DISCONNECT_ROOM)
        }
    })
    socket.on(E.PARTY_UPDATE, () => {
        if (!playerRoomId){
            socket.emit(E.DISCONNECT_ROOM)
            return
        }
        emitAllPlayersUpdate(io, rooms, playerRoomId)
    })
    // Disconnect from room
    socket.on(E.DISCONNECT_ROOM, () => {
        if (rooms[playerRoomId] != null){
            delete rooms[playerRoomId][connId]
        }
        socket.to(playerRoomId).emit(E.PARTY_UPDATE, {"allPlayers": JSON.stringify(rooms[playerRoomId])})
        socket.leave(playerRoomId)
        playerRoomId = null
        playerObj = null
        socket.emit(E.DISCONNECT_ROOM)
    })
    socket.on(E.SEND_HELP, ({helperConnIds}) => {
        if (!playerObj){
            socket.emit(E.DISCONNECT_ROOM)
            return
        }
        for (let roomConnId in rooms[playerRoomId]){
            let selectedPlayer = rooms[playerRoomId][roomConnId]
            if (helperConnIds.includes(roomConnId)){
                if (!selectedPlayer.helping.includes(connId)){
                    selectedPlayer.helping.push(connId)
                }
            }
            else {
                selectedPlayer.helping = selectedPlayer.helping.filter(helper => helper !== connId)
            }
            rooms[playerRoomId][roomConnId] = selectedPlayer
        }
        emitAllPlayersUpdate(io, rooms, playerRoomId)
    })
    socket.on(E.RESOLVE_COMBAT, () => {
        if (!playerObj){
            socket.emit(E.DISCONNECT_ROOM)
            return
        }
        playerObj.combat.partyModifier = 0
        playerObj.combat.monsterModifier = 0
        rooms[playerRoomId][connId] = playerObj
        socket.emit(E.PLAYER_UPDATE, {"playerObj": JSON.stringify(playerObj)})
        for (let roomConnId in rooms[playerRoomId]){
            let player = rooms[playerRoomId][roomConnId]
            player.helping = player.helping.filter(helper => helper !== connId)
            rooms[playerRoomId][roomConnId] = player
        }
        emitAllPlayersUpdate(io, rooms, playerRoomId)
    })
})
io.on(E.DISCONNECTION, socket => {
    console.log('client disconnected: ' + socket.id)
})


console.log("Server booted")