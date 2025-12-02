import { FormSelect } from "react-bootstrap";
import BackButton from "./BackButton";
import { Container, Row, Col } from "reactstrap";
import { useState } from "react";

export default function NewCard({socket}){

    const [cardType, setCardType] = useState(null)
    const [doorCardType, setDoorCardType] = useState(null)

    return (
        <>
        <Container>
            <Row className="text-center">
                <Col xs="6" className="mx-auto">
                    <FormSelect value={cardType} onChange={e => setCardType(e.target.value)}>
                        <option selected disabled>Card type...</option>
                        <option value="door">Door</option>
                        <option value="treasure">Treasure</option>
                    </FormSelect>
                </Col>
            </Row>
            {/* Door */}
            {
                cardType === "door" ? 
                <Row>
                <Col xs="8" className="mx-auto">
                    <FormSelect value={doorCardType} onChange={e => setDoorCardType(e.target.value)}>
                        <option selected disabled>Door Card type...</option>
                        <option value="door">Door</option>
                        <option value="treasure">Treasure</option>
                    </FormSelect>
                </Col>
            </Row>
            : <></>
            }
        </Container>
        </>
    )
}