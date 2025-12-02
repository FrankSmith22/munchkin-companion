import { useState } from 'react';
import { EVENTS as E } from '../app/events.mjs';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { DISPLAY_MODES } from '../App';

export default function BackButton({socket, confirm, setDisplayMode}){

    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen(!isOpen)

    const sendDisconnect = () => {
        socket.emit(E.DISCONNECT_ROOM)
        setDisplayMode(DISPLAY_MODES.MODE_SELECT)
    }

    return (
        <div style={{ display: "inline" }}>
            <Modal isOpen={isOpen} toggle={toggle} className="munchkinModal">
                <ModalHeader toggle={toggle}>Are you sure?</ModalHeader>
                <ModalBody>
                    Are you sure? Your progress will be lost.
                </ModalBody>
                <ModalFooter>
                    <Button className="munchkinButton" onClick={sendDisconnect}>Yes</Button>
                    <Button className="munchkinButton" style={{ backgroundColor: "#f48d5aff" }} onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <span>
                <FontAwesomeIcon
                    style={{ fontSize: "2rem", color: "#441B06", cursor: "pointer" }}
                    icon={faArrowLeft}
                    onClick={e => confirm ? setIsOpen(true) : sendDisconnect()}
                />
            </span>
        </div>
    )
}