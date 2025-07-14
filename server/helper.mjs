import { logger } from "./logger.mjs";
import { EVENTS as E} from "./events.mjs"

export function emitAllPlayersUpdate(io, rooms, playerRoomId) {
    let allPlayersJson = JSON.stringify(rooms[playerRoomId])
    logger.debug(`allPlayersJson=${allPlayersJson}`)
    io.to(playerRoomId).emit(E.PARTY_UPDATE, {"allPlayers": allPlayersJson})
}