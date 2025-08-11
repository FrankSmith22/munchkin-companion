import { useEffect, useState } from 'react';
import { EVENTS as E } from '../app/events.mjs';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook, faTrashCan, faPencil } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col, Card, CardHeader, CardTitle, CardBody, Collapse, CardFooter } from 'reactstrap';

export default function RulesButton({socket, allRules, rulesErrorMsg}){

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [deletingRule, setDeletingRule] = useState("")
    const [searchField, setSearchField] = useState("")
    const [filteredRules, setFilteredRules] = useState(allRules)
    const [isNewRuleBoxOpen, setIsNewRuleBoxOpen] = useState(false)
    const [isNewRuleButtonDisabled, setIsNewRuleButtonDisabled] = useState(false)
    const [newRuleTitle, setNewRuleTitle] = useState("")
    const [newRuleDesc, setNewRuleDesc] = useState("")
    const [ruleEditing, setRuleEditing] = useState(null)
    const [editingRuleTitle, setEditingRuleTitle] = useState("")
    const [editingRuleDesc, setEditingRuleDesc] = useState("")

    const toggleModal = () => setIsModalOpen(!isModalOpen)
    
    const toggleConfirmModal = (ruleId = null) => {
        setIsConfirmModalOpen(!isConfirmModalOpen)
        if (ruleId) {
            setDeletingRule(ruleId)
        }
    }

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
        setNewRuleTitle("")
        setNewRuleDesc("")
    }

    function sendDeleteRule() {
        toggleConfirmModal()
        socket.emit(E.DELETE_RULE, {ruleId: deletingRule})
    }

    function beginEditing(ruleId) {
        let editingRule = filteredRules.filter(rule => rule.id === ruleId)
        if (editingRule.length === 0) return
        setRuleEditing(ruleId)
        console.log(editingRule[0])
        setEditingRuleTitle(editingRule[0].data.title)
        setEditingRuleDesc(editingRule[0].data.description)
    }

    function endEditing() {
        setRuleEditing(null)
        setEditingRuleTitle("")
        setEditingRuleDesc("")
    }

    function submitEdit() {
        socket.emit(E.UPDATE_RULE, {ruleId: ruleEditing, title: editingRuleTitle, desc: editingRuleDesc})
    }


    useEffect(() => {
        socket.on(E.NEW_RULE_SUCCESS, onNewRuleSuccess)
        socket.on(E.UPDATE_RULE_SUCCESS, endEditing)

        return () => {
            socket.off(E.NEW_RULE_SUCCESS, onNewRuleSuccess)
            socket.off(E.UPDATE_RULE_SUCCESS, endEditing)
        }
    }, [])


    return (
        <div style={{ display: "inline" }}>
            <Modal isOpen={isConfirmModalOpen} toggle={toggleConfirmModal} size="sm">
                <ModalHeader toggle={toggleConfirmModal}>Are you sure?</ModalHeader>
                <ModalBody>
                    Are you sure you want to permanently delete this rule?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={sendDeleteRule}>Yes</Button>
                    <Button color="secondary" onClick={toggleConfirmModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
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
                                            <CardTitle style={{ display: "inline" }}>
                                                {
                                                    ruleEditing === rule.id
                                                    ? <input type="text" className="form-control" value={editingRuleTitle} onChange={e => setEditingRuleTitle(e.target.value)}/>
                                                    : rule.data.title
                                                }
                                            </CardTitle>
                                            <div style={{ display: "inline", float: "right" }}>
                                                <FontAwesomeIcon
                                                    style={{ color: "#441B06", cursor: "pointer", marginRight: "25px" }}
                                                    icon={faPencil}
                                                    onClick={() => ruleEditing === rule.id ? endEditing() : beginEditing(rule.id)}
                                                />
                                                <FontAwesomeIcon
                                                    style={{ color: "#441B06", cursor: "pointer" }}
                                                    icon={faTrashCan}
                                                    onClick={() => toggleConfirmModal(rule.id)}
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardBody>
                                            {
                                                ruleEditing === rule.id
                                                ? <textarea value={editingRuleDesc} onChange={e => setEditingRuleDesc(e.target.value)} rows="3" className="form-control"></textarea>
                                                : rule.data.description
                                            }
                                        </CardBody>
                                        {
                                            ruleEditing === rule.id
                                            ? <CardFooter><Button onClick={submitEdit} size="sm" color="primary" style={{ float: "right" }}>Update</Button><Button onClick={endEditing}size="sm" color="secondary" className="me-3" style={{ float: "right" }}>Cancel</Button></CardFooter>
                                            : <></>
                                        }
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