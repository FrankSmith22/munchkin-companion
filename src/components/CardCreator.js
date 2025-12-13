import BackButton from "./BackButton";
import { FormSelect } from "react-bootstrap";
import { Container, Row, Col, Button } from "reactstrap";
import Modal from 'react-bootstrap/Modal';
import { useState } from "react";

export default function CardCreator({socket, setDisplayMode, isConnected, setShowDisconnectedToast}){

    const [newCardModalIsOpen, setNewCardModalIsOpen] = useState(false)
    const [cardType, setCardType] = useState("")

    const toggleNewCardModalIsOpen = () => setNewCardModalIsOpen(!newCardModalIsOpen)

    const cardSetupModal = () => {
        return (
            <Modal show={newCardModalIsOpen} onHide={toggleNewCardModalIsOpen} className="munchkinModal newCardCreatorModal">
                <Modal.Body className="mx-auto mt-4 mt-md-0">
                    <div draggable>hello world</div>
                </Modal.Body>
            </Modal>
        )
    }
    

    return (
        <>
        <BackButton socket={socket} confirm={false} setDisplayMode={setDisplayMode} isConnected={isConnected} setShowDisconnectedToast={setShowDisconnectedToast}/>
        {cardSetupModal()}
        <div className="container-fluid">
            <Row className="justify-content-evenly">
                <Col xs="3" md="2" className="mx-1 my-1 p-0">
                    <div onClick={toggleNewCardModalIsOpen} className="customCardThumbnailAdd d-flex justify-content-center">
                        <div className="align-self-center">
                            <span>Create +</span>
                        </div>
                    </div>
                </Col>
                <Col xs="3" md="2" className="mx-1 my-1 p-0">
                    <div className="customCardThumbnail">
                        ===I am a placeholder card===
                    </div>
                </Col>
                <Col xs="3" md="2" className="mx-1 my-1 p-0">
                    <div className="customCardThumbnail">
                        ===I am a placeholder card===
                    </div>
                </Col>
                
            </Row>
        </div>
        </>
    )
}