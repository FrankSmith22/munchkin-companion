import { useState, useEffect } from 'react';
import { EVENTS as E } from '../app/events.mjs';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import munchkinGuy from "../res/munchkin-guy.png"
import { PICTURES as P } from '../app/pictureMapping';
import CardCreatorButton from './CardCreatorButton';

const LS_DEFAULT_ROOM_ID = "defaultRoomId"
const LS_DEFAULT_PLAYER_NAME = "defaultPlayerName"

export default function ModeSelect({socket, isConnected, setShowDisconnectedToast, setDisplayMode}){

    let defaultPlayerName = localStorage.getItem(LS_DEFAULT_PLAYER_NAME)
    const [playerName, setPlayerName] = useState(defaultPlayerName)
    let defaultRoomId = localStorage.getItem(LS_DEFAULT_ROOM_ID)
    const [roomId, setRoomId] = useState(defaultRoomId ? defaultRoomId : "")
    const [isPictureSelectModalOpen, setIsPictureSelectModalOpen] = useState(false)
    const [selectedPicture, setSelectedPicture] = useState(null)

    const togglePictureSelectModal = () => {
        if (!isConnected){
            setShowDisconnectedToast()
            return
        }
        setIsPictureSelectModalOpen(!isPictureSelectModalOpen)
    }

    useEffect(() => {
        localStorage.setItem(LS_DEFAULT_ROOM_ID, roomId)
        localStorage.setItem(LS_DEFAULT_PLAYER_NAME, playerName)
    }, [roomId, playerName])

    function onModeSelect(mode, roomId) {
        if (!isConnected){
            setShowDisconnectedToast()
            return
        }
        mode = mode.toLowerCase()
        roomId = roomId.toLowerCase()
        if (mode === "player"){
            socket.emit(E.PLAYER_CONNECT, {playerName, selectedPicture, roomId})
        }
        else {
            socket.emit(E.TV_CONNECT, {roomId})
        }
    }

    function submitButton(){
        onModeSelect('player', roomId)
        setIsPictureSelectModalOpen(false)
    }

    function pictureSelect(picture){
        console.log(picture)
        setSelectedPicture(picture)
    }

    function formPictureCards(){
        let allImgs = []
        for (const [key, val] of Object.entries(P)){
            allImgs.push(
                <Col xs="5" md="3" key={key} className="mt-2 mx-auto">
                    <img
                        src={val}
                        className={key === selectedPicture ? "playerPictureSelected img-thumbnail" : "playerPictureSelect img-thumbnail"}
                        onClick={() => pictureSelect(key)}></img>
                </Col> 
            )
        }
        return allImgs
    }

    return (
        <>
        <Modal isOpen={isPictureSelectModalOpen} toggle={togglePictureSelectModal} className="munchkinModal">
            <ModalHeader toggle={togglePictureSelectModal}>Select Picture</ModalHeader>
            <ModalBody>
                <Container className="overflow-auto" style={{ maxHeight: "60vh" }}>
                    <Row className="text-center">
                        {formPictureCards()}
                    </Row>
                </Container>
            </ModalBody>
            <ModalFooter>
                <Button className='munchkinButton' disabled={!selectedPicture} onClick={submitButton}>Submit</Button>
                <Button className='munchkinButton' style={{ backgroundColor: "#f48d5aff" }} onClick={togglePictureSelectModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
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
                    <Button className="munchkinButton" style={{ fontSize: "1rem" }} onClick={togglePictureSelectModal}>
                        <FontAwesomeIcon style={{color: "#441B06", cursor: "pointer" }} icon={faArrowRight}/>
                    </Button>
                </Col>
            </Row>
        </Container>
        {/* floating card creator button */}
        <CardCreatorButton setDisplayMode={setDisplayMode}/>
        </>
    )
}