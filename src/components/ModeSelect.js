import { useState, useEffect } from 'react';
import { EVENTS as E } from '../app/events.mjs';
import { Container, Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import munchkinGuy from "../res/munchkin-guy.png"

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
        <Container>
            <Row className="mt-3">
                <Col className="text-center" xs="12"><h1>Munchkin Companion</h1></Col>
            </Row>
            <Row>
                <Col className="text-center">
                    <img src={munchkinGuy} style={{ height: "auto", width: "150px" }}/>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col className="text-center" xs="12">
                    Room ID <br/>
                    <input className="form-control" style={{ width: "7rem", display: "inline-block" }} type="text" value={roomId} onChange={e => setRoomId(e.target.value)}/>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col className="text-center" xs="6">
                    TV Mode
                    <br/>
                    <input className="form-control" style={{ width: "10rem", display: "none" }} type="text"/>
                </Col>
                <Col className="text-center" xs="6">
                    Player Mode
                    <br/>
                    <input className="form-control" style={{ width: "10rem", display: "inline-block" }} type="text" value={playerName} onChange={e => setPlayerName(e.target.value)}/>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col className="text-center" xs="6">
                    <Button className="munchkinButton" style={{ fontSize: "1rem" }} onClick={e => onModeSelect('tv', roomId)}>
                        <FontAwesomeIcon style={{color: "#441B06", cursor: "pointer" }} icon={faArrowRight}/>
                    </Button>
                </Col>
                <Col className="text-center" xs="6">
                    <Button className="munchkinButton" style={{ fontSize: "1rem" }} onClick={e => onModeSelect('player', roomId)}>
                        <FontAwesomeIcon style={{color: "#441B06", cursor: "pointer" }} icon={faArrowRight}/>
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}