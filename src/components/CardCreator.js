import BackButton from "./BackButton";
import { FormSelect } from "react-bootstrap";
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useState } from "react";

export default function CardCreator({socket, setDisplayMode, isConnected, setShowDisconnectedToast}){

    const [cardTypeSelectIsOpen, setCardTypeSelectIsOpen] = useState(false)
    const [cardType, setCardType] = useState("")

    const toggleCardTypeSelect = () => setCardTypeSelectIsOpen(!cardTypeSelectIsOpen)

    const cardSetupModal = () => {
        return (
            <Modal
                size="sm"
                toggle={toggleCardTypeSelect}
                isOpen={cardTypeSelectIsOpen}
                className={cardType === "door"
                    ? "munchkinModal munchkinModalDoorCard"
                    : cardType === "treasure"
                    ? "munchkinModal munchkinModalTreasureCard"
                    : "munchkinModal cardTypeSelect"
                }
            >
                <ModalHeader onChange={() => console.log("new changes")} contentEditable={cardType != ""} className="text-center" toggle={toggleCardTypeSelect}>
                    {cardType ? "title..." : "New card type"}
                </ModalHeader>
                <ModalBody>
                    {cardType
                        ? ""
                        : <FormSelect value={cardType} onChange={e => setCardType(e.target.value)}>
                            <option value="" disabled>Card type...</option>
                            <option value="door">Door</option>
                            <option value="treasure">Treasure</option>
                        </FormSelect>
                    }
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </Modal>
            // TODO just define this modal manually.. reactstrap working its 'magic' is causing more heartache than I need for this more dynamic modal
        )
    }
    

    return (
        <>
        <BackButton socket={socket} confirm={false} setDisplayMode={setDisplayMode} isConnected={isConnected} setShowDisconnectedToast={setShowDisconnectedToast}/>
        {cardSetupModal()}
        <div className="container-fluid">
            <Row className="justify-content-evenly">
                <Col xs="3" md="2" className="mx-1 my-1 p-0">
                    <div className="customCardThumbnailAdd d-flex justify-content-center">
                        <span className="align-self-center">Add Card+</span>
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