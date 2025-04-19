import React, { useState, useEffect } from 'react';
import { EVENTS as E } from '../app/events.mjs';

export default function ModeSelect({socket}){

    const [playerName, setPlayerName] = useState("")
    const [roomId, setRoomId] = useState("")

    function onModeSelect(mode, roomId) {
        // TODO display loading icon
        mode = mode.toLowerCase()
        roomId = roomId.toLowerCase()
        if (mode === "player"){
            socket.emit(E.PLAYER_CONNECT, {playerName, roomId})
        }
        else {
            socket.emit(E.TV_CONNECT, {roomId})
        }
    }

    return (
        <div>
            <label>Room ID:</label><input type="text" value={roomId} onChange={e => setRoomId(e.target.value)}/>
            <br></br><br></br>
            <button onClick={e => onModeSelect('tv', roomId)}>TV mode</button>
            <br></br>
            <button onClick={e => onModeSelect('player', roomId)}>Player mode</button>
            <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)}/>
        </div>
    )
}