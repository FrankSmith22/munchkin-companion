import { useEffect, useState } from 'react';
import { EVENTS as E } from '../../app/events.mjs';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan, faPencil } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col, Card, CardHeader, CardTitle, CardBody, Collapse, CardFooter } from 'reactstrap';

export default function CardCreatorListItem({socket, card, setSelectedCard, selectedCard, isConnected, setShowDisconnectedToast}) {

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [deletingCard, setDeletingCard] = useState("")

    const toggleConfirmModal = (cardId = null) => {
        if (!isConnected){
            setShowDisconnectedToast()
            return
        }
        setIsConfirmModalOpen(!isConfirmModalOpen)
        if (cardId) {
            setDeletingCard(cardId)
        }
    }

    function sendDeleteCard() {
        toggleConfirmModal()
        socket.emit(E.DELETE_CARD, {cardId: deletingCard})
    }

    return (
        <>
            <Modal isOpen={isConfirmModalOpen} toggle={toggleConfirmModal} size="sm" className="munchkinModal">
                <ModalHeader className="mHeaderFont" toggle={toggleConfirmModal}>Are you sure?</ModalHeader>
                <ModalBody>
                    Are you sure you want to permanently delete this custom card?
                </ModalBody>
                <ModalFooter>
                    <Button className="munchkinButton" onClick={sendDeleteCard}>Yes</Button>
                    <Button className="munchkinButton" style={{ backgroundColor: "#f48d5aff" }} onClick={toggleConfirmModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <div style={{ position: "relative" }}>
                <div className="newCardCreatorCard d-flex" onClick={() => setSelectedCard(card)} style={{
                    flexFlow: "column", 
                    overflow: "hidden", 
                    filter: selectedCard.id === card.id ? "blur(5px)" : "unset",
                    opacity: selectedCard.id === card.id ? "0.8" : "1",
                    transition: "0.3s"
                }}>
                    <div className="text-center mHeaderFont mx-auto" style={{fontSize: "0.33rem", width: "90%", overflowY: "auto", minHeight: ".45rem"}}>
                        {card.data.supertitle}
                    </div>
                    <div className="text-center mHeaderFont" style={{fontSize: "0.6rem", overflowY: "auto", minHeight: "1rem", maxHeight: "2rem"}}>
                        {card.data.title}
                    </div>
                    <div className="text-center mHeaderFont" style={{fontSize: "0.3rem", overflowY: "auto", minHeight: ".45rem"}}>
                        {card.data.subtitle}
                    </div>
                    <div>
                        <label className="newCardCreatorUploadImage mx-auto d-flex" style={{backgroundImage: `url(${card.data.image})`}} />
                    </div>
                    <div className="newCardCreatorDescription">
                        {card.data.description}
                    </div>
                    <div className="d-flex justify-content-between" style={{overflowY: "hidden"}}>
                        <div style={{width: "45%", display: "inline-block", overflowY: "auto", fontSize: ".4rem"}}>
                            {card.data.footerLeft}
                        </div>
                        <div style={{width: "45%", display: "inline-block", textAlign: "end", overflowY: "auto", fontSize: ".4rem"}}>
                            {card.data.footerRight}
                        </div>
                    </div>
                </div>
                <div className="" style={{display: selectedCard.id === card.id ? "flex" : "none", position: "absolute", top: "50%", width: "100%", flexDirection: "row", placeContent: "center space-around"}}>
                    <FontAwesomeIcon
                        style={{ color: "#441B06", cursor: "pointer" }}
                        icon={faPencil}
                        onClick={() => {}}
                    />
                    <FontAwesomeIcon
                        style={{ color: "#441B06", cursor: "pointer" }}
                        icon={faTrashCan}
                        onClick={() => {toggleConfirmModal(card.id)}}
                    />
                </div>
            </div>
        </>
    )
}