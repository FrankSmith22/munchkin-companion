import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { EVENTS as E } from './app/events.mjs';
import Player from './app/models.mjs';
import ModeSelect from './components/ModeSelect';
import PlayerCard from './components/PlayerCard';
import TvCard from './components/TvCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignal } from '@fortawesome/free-solid-svg-icons/faSignal'

function ConnectionState({ isConnected }) {
    const color = isConnected ? 'green' : 'red'
    return <FontAwesomeIcon style={{color: color, fontWeight: 'bold', fontSize: '2rem'}} icon={faSignal} />
}

export default function App() {
    const [isConnected, setIsConnected] = useState(false)
    const [displayModeSelect, setDisplayModeSelect] = useState(true)
    const [playerConnect, setPlayerConnect] = useState(false)
    const [tvConnect, setTvConnect] = useState(false)
    const [playerObj, setPlayerObj] = useState(null)
    const [allPlayers, setAllPlayers] = useState(null)

    /* Handling refresh:
    1. Upon player connect or tv connect, save playerConnect or tvConnect to localstorage

    */


    useEffect(() => {
        function onConnect() {
            console.log("Connected")
            setIsConnected(true)
        }
        function onDisconnect() {
            console.log("Disconnected")
            setIsConnected(false)
        }
        function onPlayerConnect({playerObj}) {
            setDisplayModeSelect(false)
            setPlayerConnect(true)
            setPlayerObj(Object.assign(new Player(), JSON.parse(playerObj)))
        }

        function onTvConnect({allPlayers}){
            setDisplayModeSelect(false)
            setTvConnect(true)

            const parsedAllPlayers = JSON.parse(allPlayers)
            const allPlayerObjs = {}
            for (const [socket_id, playerObj] of Object.entries(parsedAllPlayers)) {
                allPlayerObjs[socket_id] = Object.assign(new Player(), playerObj)
            }
            setAllPlayers(allPlayerObjs)
        }

        function onPlayerUpdate({playerObj}) {
            setPlayerObj(Object.assign(new Player(), JSON.parse(playerObj)))
        }

        function onPartyUpdate({allPlayers}) {
            console.log("Received party update")
            const parsedAllPlayers = JSON.parse(allPlayers)
            const allPlayerObjs = {}
            for (const [socket_id, playerObj] of Object.entries(parsedAllPlayers)) {
                allPlayerObjs[socket_id] = Object.assign(new Player(), playerObj)
            }
            setAllPlayers(allPlayerObjs)
        }

        socket.connect()

        socket.on(E.CONNECTION, onConnect)
        socket.on(E.DISCONNECTION, onDisconnect)
        socket.on(E.PLAYER_CONNECT, onPlayerConnect)
        socket.on(E.TV_CONNECT, onTvConnect)
        socket.on(E.PLAYER_UPDATE, onPlayerUpdate)
        socket.on(E.PARTY_UPDATE, onPartyUpdate)
        
        
        return () => {
            socket.off(E.CONNECTION, onConnect)
            socket.off(E.DISCONNECTION, onDisconnect)
            socket.off(E.PLAYER_CONNECT, onPlayerConnect)
            socket.off(E.TV_CONNECT, onTvConnect)
            socket.off(E.PLAYER_UPDATE, onPlayerUpdate)
            socket.off(E.PARTY_UPDATE, onPartyUpdate)
        }
    }, [])

    return (
        <div className="App">
            <ConnectionState isConnected={isConnected}/>
            {displayModeSelect ? <ModeSelect socket={socket}/> : <></>}
            {playerConnect ? <PlayerCard socket={socket} playerObj={playerObj}/> : <></>}
            {tvConnect ? <TvCard socket={socket} allPlayers={allPlayers}/> : <></>}
        </div>
    );
}