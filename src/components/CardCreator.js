import BackButton from "./BackButton";
import { FormSelect } from "react-bootstrap";
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useState } from "react";

export default function CardCreator({socket, setDisplayMode}){

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
        <BackButton socket={socket} confirm={false} setDisplayMode={setDisplayMode}/>
        {cardSetupModal()}
        <Container>
            <Row className="text-center">
                <Col xs="10" className="mx-auto">
                    <Button onClick={() => setCardTypeSelectIsOpen(true)} className="munchkinButton mt-3" style={{ width: "100%", height: "25px", fontSize: ".8rem", lineHeight: "10px" }}>New Card +</Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    BEHOLD.... our cards
                </Col>
            </Row>
        </Container>
        </>
    )
}