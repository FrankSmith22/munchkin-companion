import { useState, useEffect } from 'react';
import { socket } from './socket';
import { EVENTS as E } from './app/events.mjs';
import { Player } from './app/models.mjs';
import ModeSelect from './components/ModeSelect';
import PlayerCard from './components/PlayerCard';
import TvCard from './components/TvCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignal } from '@fortawesome/free-solid-svg-icons/faSignal'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

const LS_CONN_TYPE = "connectionType"
const LS_ROOM_ID = "roomId"
const LS_CONN_ID = "connId"


function ConnectionState({ isConnected, roomId }) {
    const color = isConnected ? 'green' : 'red'
    return (
        <div style={{ float: "right" }}>
            <FontAwesomeIcon style={{color: color, fontWeight: 'bold', fontSize: '1rem', float: "right"}} icon={faSignal} />
            <br/>
            {roomId ? <span className="roomIdSpan">Room ID: <b>{roomId}</b></span> : <></>}
        </div>
    )
}

export default function App() {
    const [isConnected, setIsConnected] = useState(false)
    const [displayModeSelect, setDisplayModeSelect] = useState(true)
    const [playerConnect, setPlayerConnect] = useState(false)
    const [tvConnect, setTvConnect] = useState(false)
    const [playerObj, setPlayerObj] = useState(null)
    const [allPlayers, setAllPlayers] = useState(null)
    const [roomId, setRoomId] = useState("")
    const [allRules, setAllRules] = useState([])
    const [rulesErrorMsg, setRulesErrorMsg] = useState("")

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
            setRoomId(roomId)

            // Save to localStorage
            try {
                localStorage.setItem(LS_CONN_TYPE, "player")
                localStorage.setItem(LS_ROOM_ID, roomId)
                localStorage.setItem(LS_CONN_ID, playerObj.connId)
            }
            catch (error) {
                console.warn("Could not access localstorage")
            }
        }

        function onTvConnect({allPlayers, roomId}){
            setDisplayModeSelect(false)
            setTvConnect(true)
            setRoomId(roomId)

            allPlayers = allPlayers || "{}"

            const parsedAllPlayers = JSON.parse(allPlayers)
            const allPlayerObjs = {}
            for (const [socket_id, playerObj] of Object.entries(parsedAllPlayers)) {
                allPlayerObjs[socket_id] = Object.assign(new Player(), playerObj)
            }
            setAllPlayers(allPlayerObjs)

            // Save to localStorage
            try {
                localStorage.setItem(LS_CONN_TYPE, "tv")
                localStorage.setItem(LS_ROOM_ID, roomId)
            }
            catch (error) {
                console.warn("Could not access localstorage")
            }
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
            console.log(`allPlayerObjs=${allPlayerObjs}`)
            setAllPlayers(allPlayerObjs)
        }

        function onDisconnectRoom(){
            setDisplayModeSelect(true)
            setPlayerConnect(false)
            setTvConnect(false)
            setAllPlayers(null)
            setPlayerObj(null)
            setRoomId("")
            try {
                localStorage.setItem(LS_CONN_TYPE, "")
                localStorage.setItem(LS_ROOM_ID, "")
                localStorage.setItem(LS_CONN_ID, "")
            }
            catch (error) {
                console.warn("Could not access localstorage")
            }
        }


        socket.connect()
        socket.emit(E.GET_RULES)

        // Attempt reconnect using localstorage
        try {
            let connectionType = localStorage.getItem(LS_CONN_TYPE)
            let roomId = localStorage.getItem(LS_ROOM_ID)
            switch(connectionType){
                case "player":
                    let connId = localStorage.getItem(LS_CONN_ID)
                    if(roomId && connId){
                        socket.emit(E.PLAYER_RECONNECT, {localConnId: connId, roomId})
                        socket.emit(E.PARTY_UPDATE)
                    }
                    break
                case "tv":
                    if (roomId){
                        socket.emit(E.TV_CONNECT, {roomId})
                        socket.emit(E.PARTY_UPDATE)
                    }
                    break
                default:
                    console.log("No localStorage, starting fresh session")
            }
        }
        catch (error) {
            console.warn("Could not access localstorage")
        }

        function onGetRules(allRules) {
            console.log("Got rules from server:")
            console.log(allRules)
            setAllRules(JSON.parse(allRules))
            setRulesErrorMsg("")
        }

        function onRulesError({message}) {
            console.log(`Got error message from server for getting rules: ${message}`)
            setRulesErrorMsg(message)
        }



        socket.on(E.CONNECTION, onConnect)
        socket.on(E.DISCONNECTION, onDisconnect)
        socket.on(E.PLAYER_CONNECT, onPlayerConnect)
        socket.on(E.TV_CONNECT, onTvConnect)
        socket.on(E.PLAYER_UPDATE, onPlayerUpdate)
        socket.on(E.PARTY_UPDATE, onPartyUpdate)
        socket.on(E.DISCONNECT_ROOM, onDisconnectRoom)
        socket.on(E.GET_RULES, onGetRules)
        socket.on(E.RULES_ERROR, onRulesError)
        
        return () => {
            socket.off(E.CONNECTION, onConnect)
            socket.off(E.DISCONNECTION, onDisconnect)
            socket.off(E.PLAYER_CONNECT, onPlayerConnect)
            socket.off(E.TV_CONNECT, onTvConnect)
            socket.off(E.PLAYER_UPDATE, onPlayerUpdate)
            socket.off(E.PARTY_UPDATE, onPartyUpdate)
            socket.off(E.DISCONNECT_ROOM, onDisconnectRoom)
            socket.off(E.GET_RULES, onGetRules)
            socket.off(E.RULES_ERROR, onRulesError)
        }
    }, [])

    return (
        <div className="App">
            <ConnectionState isConnected={isConnected} roomId={roomId}/>
            {displayModeSelect ? <ModeSelect socket={socket}/> : <></>}
            {playerConnect ? <PlayerCard socket={socket} playerObj={playerObj} allPlayers={allPlayers} allRules={allRules} rulesErrorMsg={rulesErrorMsg}/> : <></>}
            {tvConnect ? <TvCard socket={socket} allPlayers={allPlayers}/> : <></>}
        </div>
    );
}