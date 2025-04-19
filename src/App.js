import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { EVENTS as E } from './app/events.mjs';
import Player from './app/models.mjs';
import ModeSelect from './components/ModeSelect';
import PlayerCard from './components/PlayerCard';

export default function App() {
    const [isConnected, setIsConnected] = useState(socket.connected)
    const [displayModeSelect, setDisplayModeSelect] = useState(true)
    const [playerObj, setPlayerObj] = useState(null)

    
    useEffect(() => {
        function onConnect() {
            setIsConnected(true)
        }
        function onDisconnect() {
            setIsConnected(false)
        }
        function onPlayerJoin({newPlayer}) {
            console.log("Player has joined")
            console.log(newPlayer)
            setDisplayModeSelect(false)
            setPlayerObj(Object.assign(new Player(), JSON.parse(newPlayer)))
        }


        socket.on(E.CONNECTION, onConnect)
        socket.on(E.DISCONNECTION, onDisconnect)
        socket.on(E.PLAYER_JOIN, onPlayerJoin)
        
        
        return () => {
            socket.off(E.CONNECTION, onConnect)
            socket.off(E.DISCONNECTION, onDisconnect)
            socket.off(E.PLAYER_JOIN, onPlayerJoin)
        }
    }, [])

    return (
        <div className="App">
            {displayModeSelect ? <ModeSelect socket={socket}/> : <></>}
            {playerObj ? <PlayerCard socket={socket} playerObj={playerObj}/> : <></>}
        </div>
    );
}