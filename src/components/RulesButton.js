import { useEffect, useState } from 'react';
import { EVENTS as E } from '../app/events.mjs';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col, Card, CardHeader, CardTitle, CardBody, Collapse, CardFooter } from 'reactstrap';

export default function RulesButton({socket, allRules, rulesErrorMsg}){

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchField, setSearchField] = useState("")
    const [filteredRules, setFilteredRules] = useState(allRules)
    const [isNewRuleBoxOpen, setIsNewRuleBoxOpen] = useState(false)
    const [isNewRuleButtonDisabled, setIsNewRuleButtonDisabled] = useState(false)
    const [newRuleTitle, setNewRuleTitle] = useState("")
    const [newRuleDesc, setNewRuleDesc] = useState("")

    const toggleModal = () => setIsModalOpen(!isModalOpen)

    const toggleCollapse = () => setIsNewRuleBoxOpen(!isNewRuleBoxOpen)

    function searchRules(e){
        const searchStr = e.target.value
        setSearchField(searchStr)
        console.log(JSON.stringify(allRules.filter(rule => rule.data.title.includes(searchStr) || rule.data.description.includes(searchStr))))
        setFilteredRules(allRules.filter(rule => rule.data.title.includes(searchStr) || rule.data.description.includes(searchStr)))
    }

    function addNewRule() {
        setIsNewRuleButtonDisabled(true)
        socket.emit(E.NEW_RULE, {ruleTitle: newRuleTitle, ruleDesc: newRuleDesc})
    }

    useEffect(()=>{
        setFilteredRules(allRules.filter(rule => rule.data.title.includes(searchField) || rule.data.description.includes(searchField)))
    }, [allRules])

    function onNewRuleSuccess() {
        setIsNewRuleButtonDisabled(false)
    }

    useEffect(() => {
        socket.on(E.NEW_RULE_SUCCESS, onNewRuleSuccess)

        return () => {
            socket.off(E.NEW_RULE_SUCCESS, onNewRuleSuccess)
        }
    }, [])

    return (
        <div style={{ display: "inline" }}>
            <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Rules</ModalHeader>
                <ModalBody>
                    <Container>
                        <Row>
                            <Col>
                                <Button onClick={toggleCollapse} color="primary" className="mb-2" style={{ width: "100%", height: "25px", fontSize: ".8rem" }}>New Rule +</Button>
                                <Collapse isOpen={isNewRuleBoxOpen} className="mb-3">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle><input type="text" value={newRuleTitle} onChange={e => setNewRuleTitle(e.target.value)} placeholder="Rule title..." className="form-control"/></CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                            <textarea value={newRuleDesc} onChange={e => setNewRuleDesc(e.target.value)} placeholder="Rule description..." rows="3" className="form-control"></textarea>
                                        </CardBody>
                                        <CardFooter><Button color="primary" onClick={addNewRule} disabled={isNewRuleButtonDisabled} style={{ float: "right" }}>Add</Button></CardFooter>
                                    </Card>
                                </Collapse>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <input type="text" placeholder="search..." className="form-control" value={searchField} onChange={e => searchRules(e)}/>
                            </Col>
                        </Row>
                        {rulesErrorMsg ? <Row>
                            <Col style={{ color: "red" }}>
                                Sorry, something went wrong interacting with the rules    
                            </Col>
                        </Row> : ""}
                        {/* TODO Make it so rule descriptions are a collapse element */}
                        {filteredRules.map(rule => {
                            return <Row key={rule.id} className="mt-3">
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
                    <Button color="secondary" onClick={toggleModal}>Close</Button>
                </ModalFooter>
            </Modal>
            <span>
                <FontAwesomeIcon
                    style={{ fontSize: "2rem", color: "#441B06", cursor: "pointer", float: "right" }}
                    icon={faBook}
                    onClick={toggleModal}
                />
            </span>
        </div>
    )
}