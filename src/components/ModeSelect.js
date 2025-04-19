import React, { useState, useEffect } from 'react';
import { EVENTS as E } from '../app/events.mjs';

export default function ModeSelect({socket}){

    const [playerName, setPlayerName] = useState("")

    function onModeSelect(mode) {
        if (mode === "player"){
            socket.emit(E.PLAYER_CONNECT, {"playerName": playerName})
        }
        else {
            socket.emit(E.TV_CONNECT)
        }
        // TODO display loading icon
    }

    return (
        <div>
            <button onClick={e => onModeSelect('tv')}>TV mode</button>
            <button onClick={e => onModeSelect('player')}>Player mode</button>
            <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)}/>
        </div>
    )
}