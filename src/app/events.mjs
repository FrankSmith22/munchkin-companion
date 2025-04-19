import deepFreeze from "deep-freeze"

export const EVENTS = deepFreeze({
    CONNECTION: "connection",
    DISCONNECTION: "disconnect",
    PLAYER_CONNECT: "player-connect",
    PLAYER_JOIN: "player-join",
    TV_CONNECT: "tv-connect",
    PLAYER_LEVEL_INC: "player-level-inc",
    PLAYER_LEVEL_DEC: "player-level-dec",
    PLAYER_GEAR_INC: "player-gear-inc",
    PLAYER_GEAR_DEC: "player-gear-dec",
    PLAYER_UPDATE: "player-update"
})