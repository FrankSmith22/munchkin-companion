import { useState } from 'react';
import { EVENTS as E } from '../app/events.mjs';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default function BackButton({socket}){

    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen(!isOpen)

    return (
        <div>
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>Are you sure?</ModalHeader>
                <ModalBody>
                    Are you sure? Current stats will be lost.
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={e => socket.emit(E.DISCONNECT_ROOM)}>Yes</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <span>
                <FontAwesomeIcon
                style={{ fontSize: "2rem", color: "#441B06", cursor: "pointer" }}
                icon={faArrowLeft}
                onClick={e => setIsOpen(true)}
                />
            </span>
        </div>
    )
}