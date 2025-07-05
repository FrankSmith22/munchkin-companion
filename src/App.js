import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { EVENTS as E } from './app/events.mjs';
import Player from './app/models.mjs';
import ModeSelect from './components/ModeSelect';
import BackButton from './components/BackButton';
import PlayerCard from './components/PlayerCard';
import TvCard from './components/TvCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignal } from '@fortawesome/free-solid-svg-icons/faSignal'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'


function ConnectionState({ isConnected }) {
    const color = isConnected ? 'green' : 'red'
    return <FontAwesomeIcon style={{color: color, fontWeight: 'bold', fontSize: '1rem'}} icon={faSignal} />
}

export default function App() {
    const [isConnected, setIsConnected] = useState(false)
    const [displayModeSelect, setDisplayModeSelect] = useState(true)
    const [playerConnect, setPlayerConnect] = useState(false)
    const [tvConnect, setTvConnect] = useState(false)
    const [playerObj, setPlayerObj] = useState(null)
    const [allPlayers, setAllPlayers] = useState(null)

    /* Handling refresh:
    1. Upon player connect or tv connect, save to localstorage:
        connectionType: "player|tv"
        roomId: "r1"
        connId: "<uuid>"
    2. Upon page load, attempt to pull from localstorage.
    2.a. If connectionType == "tv", send e.RECONNECT_TV to server with roomId
    2.b. If connectionType == "player", send e.RECONNECT_PLAYER to server with roomId and connId
    3. Server handles e.RECONNECT_TV/PLAYER and sets connId and playerRoomId, and sends back E.TV_CONNECT with all players or E.PLAYER_CONNECT with playerObj
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
        function onPlayerConnect({playerObj, roomId}) {
            setDisplayModeSelect(false)
            setPlayerConnect(true)
            playerObj = Object.assign(new Player(), JSON.parse(playerObj))
            setPlayerObj(playerObj)

            // Save to localStorage
            localStorage.setItem("connectionType", "player")
            localStorage.setItem("roomId", roomId)
            localStorage.setItem("connId", playerObj.connId)
        }

        function onTvConnect({allPlayers, roomId}){
            setDisplayModeSelect(false)
            setTvConnect(true)

            allPlayers = allPlayers || "{}"

            const parsedAllPlayers = JSON.parse(allPlayers)
            const allPlayerObjs = {}
            for (const [socket_id, playerObj] of Object.entries(parsedAllPlayers)) {
                allPlayerObjs[socket_id] = Object.assign(new Player(), playerObj)
            }
            setAllPlayers(allPlayerObjs)

            // Save to localStorage
            localStorage.setItem("connectionType", "tv")
            localStorage.setItem("roomId", roomId)
        }

        function onPlayerUpdate({playerObj}) {
            setPlayerObj(Object.assign(new Player(), JSON.parse(playerObj)))
        }

        function onPartyUpdate({allPlayers}) {
            console.log("Received party update")
            allPlayers = allPlayers || "{}"
            const parsedAllPlayers = JSON.parse(allPlayers)
            const allPlayerObjs = {}
            for (const [socket_id, playerObj] of Object.entries(parsedAllPlayers)) {
                allPlayerObjs[socket_id] = Object.assign(new Player(), playerObj)
            }
            setAllPlayers(allPlayerObjs)
        }

        function onDisconnectRoom(){
            setDisplayModeSelect(true)
            setPlayerConnect(false)
            setTvConnect(false)
            setAllPlayers(null)
            setPlayerObj(null)
            localStorage.setItem("connectionType", "")
            localStorage.setItem("roomId", "")
            localStorage.setItem("connId", "")
        }


        socket.connect()

        // Attempt reconnect using localstorage
        let connectionType = localStorage.getItem("connectionType")
        let roomId = localStorage.getItem("roomId")
        switch(connectionType){
            case "player":
                let connId = localStorage.getItem("connId")
                if(roomId && connId){
                    socket.emit(E.PLAYER_RECONNECT, {connId, roomId})
                }
                break
            case "tv":
                if (roomId){
                    socket.emit(E.TV_CONNECT, {roomId})
                }
                break
            default:
                console.log("No localStorage, starting fresh session")
        }



        socket.on(E.CONNECTION, onConnect)
        socket.on(E.DISCONNECTION, onDisconnect)
        socket.on(E.PLAYER_CONNECT, onPlayerConnect)
        socket.on(E.TV_CONNECT, onTvConnect)
        socket.on(E.PLAYER_UPDATE, onPlayerUpdate)
        socket.on(E.PARTY_UPDATE, onPartyUpdate)
        socket.on(E.DISCONNECT_ROOM, onDisconnectRoom)
        
        return () => {
            socket.off(E.CONNECTION, onConnect)
            socket.off(E.DISCONNECTION, onDisconnect)
            socket.off(E.PLAYER_CONNECT, onPlayerConnect)
            socket.off(E.TV_CONNECT, onTvConnect)
            socket.off(E.PLAYER_UPDATE, onPlayerUpdate)
            socket.off(E.PARTY_UPDATE, onPartyUpdate)
            socket.off(E.DISCONNECT_ROOM, onDisconnectRoom)
        }
    }, [])

    return (
        <div className="App">
            <ConnectionState isConnected={isConnected}/>
            <br/>
            {playerConnect || tvConnect ? <BackButton socket={socket}/> : <></>}
            <br/>
            {displayModeSelect ? <ModeSelect socket={socket}/> : <></>}
            {playerConnect ? <PlayerCard socket={socket} playerObj={playerObj}/> : <></>}
            {tvConnect ? <TvCard socket={socket} allPlayers={allPlayers}/> : <></>}
        </div>
    );
}