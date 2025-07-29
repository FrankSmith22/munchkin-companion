import { useEffect, useState } from 'react';
import { EVENTS as E } from '../app/events.mjs';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col, Card, CardHeader, CardTitle, CardBody } from 'reactstrap';

export default function RulesButton({socket}){

    const [isOpen, setIsOpen] = useState(false)
    const [allRules, setAllRules] = useState([])
    const [rulesErrorMsg, setRulesErrorMsg] = useState("")

    const toggle = () => setIsOpen(!isOpen)

    console.log(`allRules=${allRules}`)

    useEffect(() => {
        function onGetRules(allRules) {
            setAllRules(JSON.parse(allRules))
            setRulesErrorMsg("")
        }

        function onRulesError({message}) {
            setRulesErrorMsg(message)
        }

        socket.on(E.GET_RULES, onGetRules)
        socket.on(E.RULES_ERROR, onRulesError)
        return () => {
            socket.off(E.GET_RULES, onGetRules)
            socket.off(E.RULES_ERROR, onRulesError)
        }
    })

    return (
        <div style={{ display: "inline" }}>
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>Rules</ModalHeader>
                <ModalBody>
                    <Container>
                        {rulesErrorMsg ? <Row>
                            <Col style={{ color: "red" }}>
                                Sorry, something went wrong interacting with the rules    
                            </Col>
                        </Row> : ""}
                        {allRules.map(rule => {
                            return <Row key={rule.id}>
                                <Col>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{rule.data.title}</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                            {rule.data.description}
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        })}
                    </Container>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Close</Button>
                </ModalFooter>
            </Modal>
            <span>
                <FontAwesomeIcon
                    style={{ fontSize: "2rem", color: "#441B06", cursor: "pointer", float: "right" }}
                    icon={faBook}
                    onClick={toggle}
                />
            </span>
        </div>
    )
}