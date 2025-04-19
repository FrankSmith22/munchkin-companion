import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { EVENTS as E } from './app/events.mjs';
import Player from './app/models.mjs';
import ModeSelect from './components/ModeSelect';
import PlayerCard from './components/PlayerCard';
import TvCard from './components/TvCard';

export default function App() {
    const [isConnected, setIsConnected] = useState(socket.connected)
    const [displayModeSelect, setDisplayModeSelect] = useState(true)
    const [playerObj, setPlayerObj] = useState(null)
    const [allPlayers, setAllPlayers] = useState(null)

    useEffect(() => {
        function onConnect() {
            setIsConnected(true)
        }
        function onDisconnect() {
            setIsConnected(false)
        }
        function onPlayerUpdate({playerObj}) {
            setDisplayModeSelect(false)
            setPlayerObj(Object.assign(new Player(), JSON.parse(playerObj)))
        }
        function onTvConnect({allPlayers}){
            setDisplayModeSelect(false)
            setPlayerObj(null)

            const parsedAllPlayers = JSON.parse(allPlayers)
            const allPlayerObjs = {}
            for (const [socket_id, playerObj] of Object.entries(parsedAllPlayers)) {
                allPlayerObjs[socket_id] = Object.assign(new Player(), playerObj)
            }
            setAllPlayers(allPlayerObjs)
        }


        socket.on(E.CONNECTION, onConnect)
        socket.on(E.DISCONNECTION, onDisconnect)
        socket.on(E.PLAYER_UPDATE, onPlayerUpdate)
        socket.on(E.TV_CONNECT, onTvConnect)
        socket.on(E.PARTY_UPDATE, onTvConnect)
        
        
        return () => {
            socket.off(E.CONNECTION, onConnect)
            socket.off(E.DISCONNECTION, onDisconnect)
            socket.off(E.PLAYER_UPDATE, onPlayerUpdate)
            socket.off(E.TV_CONNECT, onTvConnect)
            socket.off(E.PARTY_UPDATE, onTvConnect)
        }
    }, [])

    return (
        <div className="App">
            {displayModeSelect ? <ModeSelect socket={socket}/> : <></>}
            {playerObj ? <PlayerCard socket={socket} playerObj={playerObj}/> : <></>}
            {allPlayers ? <TvCard socket={socket} allPlayers={allPlayers}/>: <></>}
        </div>
    );
}