import BackButton from "./BackButton";
import { FormSelect } from "react-bootstrap";
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useState } from "react";

export default function CardCreator({socket, setDisplayMode}){

    const [cardTypeSelectIsOpen, setCardTypeSelectIsOpen] = useState(false)
    const [cardType, setCardType] = useState(null)

    const toggleCardTypeSelect = () => setCardTypeSelectIsOpen(!cardTypeSelectIsOpen)

    return (
        <>
        <BackButton socket={socket} confirm={false} setDisplayMode={setDisplayMode}/>
        <Modal size="sm" isOpen={cardTypeSelectIsOpen} className="munchkinModal">
            <ModalHeader toggle={toggleCardTypeSelect}>New card type</ModalHeader>
            <ModalBody>
                <FormSelect value={cardType} onChange={e => setCardType(e.target.value)}>
                    <option selected disabled>Card type...</option>
                    <option value="door">Door</option>
                    <option value="treasure">Treasure</option>
                </FormSelect>
            </ModalBody>
            <ModalFooter>
                <Button className='munchkinButton' disabled={!cardType} onClick={toggleCardTypeSelect}>Submit</Button>
                <Button className='munchkinButton' style={{ backgroundColor: "#f48d5aff" }} onClick={toggleCardTypeSelect}>Cancel</Button>
            </ModalFooter>
        </Modal>
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