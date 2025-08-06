import { useEffect, useState } from 'react';
import { EVENTS as E } from '../app/events.mjs';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col, Card, CardHeader, CardTitle, CardBody } from 'reactstrap';

export default function RulesButton({socket, allRules, rulesErrorMsg}){

    const [isOpen, setIsOpen] = useState(false)
    const [searchField, setSearchField] = useState("")
    const [filteredRules, setFilteredRules] = useState(allRules)

    const toggle = () => setIsOpen(!isOpen)

    function searchRules(e){
        const searchStr = e.target.value
        setSearchField(searchStr)
        console.log(JSON.stringify(allRules.filter(rule => rule.data.title.includes(searchStr) || rule.data.description.includes(searchStr))))
        setFilteredRules(allRules.filter(rule => rule.data.title.includes(searchStr) || rule.data.description.includes(searchStr)))
    }

    useEffect(()=>{
        setFilteredRules(allRules.filter(rule => rule.data.title.includes(searchField) || rule.data.description.includes(searchField)))
    }, [allRules])

    return (
        <div style={{ display: "inline" }}>
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>Rules</ModalHeader>
                <ModalBody>
                    <Container>
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