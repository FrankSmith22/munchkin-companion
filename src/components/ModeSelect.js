import { useState, useEffect } from 'react';
import { EVENTS as E } from '../app/events.mjs';

const LS_DEFAULT_ROOM_ID = "defaultRoomId"
const LS_DEFAULT_PLAYER_NAME = "defaultPlayerName"

export default function ModeSelect({socket}){

    let defaultPlayerName = localStorage.getItem(LS_DEFAULT_PLAYER_NAME)
    const [playerName, setPlayerName] = useState(defaultPlayerName)
    let defaultRoomId = localStorage.getItem(LS_DEFAULT_ROOM_ID)
    const [roomId, setRoomId] = useState(defaultRoomId ? defaultRoomId : "")

    useEffect(() => {
        localStorage.setItem(LS_DEFAULT_ROOM_ID, roomId)
        localStorage.setItem(LS_DEFAULT_PLAYER_NAME, playerName)
    }, [roomId, playerName])

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