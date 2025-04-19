import deepFreeze from "deep-freeze"

export const EVENTS = deepFreeze({
    CONNECTION: "connection",
    DISCONNECTION: "disconnect",
    PLAYER_CONNECT: "player-connect",
    PLAYER_JOIN: "player-join",
    TV_CONNECT: "tv-connect"
})