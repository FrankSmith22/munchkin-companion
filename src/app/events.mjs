import deepFreeze from "deep-freeze"

export const EVENTS = deepFreeze({
    CONNECTION: "connect",
    DISCONNECTION: "disconnect",
    DISCONNECT_ROOM: "disconnect-room",
    PLAYER_CONNECT: "player-connect",
    PLAYER_JOIN: "player-join",
    TV_CONNECT: "tv-connect",
    PLAYER_LEVEL_INC: "player-level-inc",
    PLAYER_LEVEL_DEC: "player-level-dec",
    PLAYER_GEAR_INC: "player-gear-inc",
    PLAYER_GEAR_DEC: "player-gear-dec",
    COMBAT_PARTY_MOD_INC: "combat-party-mod-inc",
    COMBAT_PARTY_MOD_DEC: "combat-party-mod-dec",
    COMBAT_MONSTER_MOD_INC: "combat-monster-mod-inc",
    COMBAT_MONSTER_MOD_DEC: "combat-monster-mod-dec",
    PLAYER_UPDATE: "player-update",
    PARTY_UPDATE: "party-update",
    TV_RECONNECT: "tv-reconnect",
    PLAYER_RECONNECT: "player-reconnect",
    SEND_HELP: "send-help"
})