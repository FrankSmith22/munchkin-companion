import { useState, useEffect } from 'react';
import { EVENTS as E } from '../app/events.mjs';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import combatIcon from "../res/sword_shield.png"

export default function CombatModal({ socket, allPlayersList, playerObj }) {

    const [isCombatOpen, setIsCombatOpen] = useState(false)
    const [isHelpSelectOpen, setIsHelpSelectOpen] = useState(false)
    const [playersHelping, setPlayersHelping] = useState(allPlayersList.filter(player => player.helping))
    const [combatPartyTotal, setCombatPartyTotal] = useState(playerObj.level + playerObj.gearBonus)
    const [monsterLevel, setMonsterLevel] = useState(0)
    const [combatMonsterTotal, setCombatMonsterTotal] = useState(monsterLevel + playerObj.combat.monsterModifier)

    const toggleCombat = () => setIsCombatOpen(!isCombatOpen)
    const toggleHelpSelect = () => setIsHelpSelectOpen(!isHelpSelectOpen)

    const sendHelp = () => {
        socket.emit(E.SEND_HELP, { helperConnIds: playersHelping.map(player => player.connId) })
        setIsHelpSelectOpen(false)
    }


    useEffect(() => {
        // Party
        let playerTotal = playerObj.level + playerObj.gearBonus + playerObj.combat.partyModifier
        allPlayersList.forEach(player => {
            if (player.helping) {
                playerTotal += player.gearBonus
                playerTotal += player.level
            }
        })
        setCombatPartyTotal(playerTotal)

        // Monster
        setCombatMonsterTotal(monsterLevel + playerObj.combat.monsterModifier)
    }, [allPlayersList, playerObj, monsterLevel])

    // TODO Need to use useEffect or something to update playersHelping with any allPlayersList[@].helping === true

    const toggleHelper = (selectedConnId) => {
        let selectedPlayer = allPlayersList.find(player => player.connId === selectedConnId)
        if (!playersHelping.some(helper => helper.connId === selectedPlayer.connId)) {
            let playersHelpingClone = [...playersHelping]
            playersHelpingClone.push(selectedPlayer)
            setPlayersHelping(playersHelpingClone)
        }
        else {
            setPlayersHelping(playersHelping.filter(helper => helper.connId !== selectedPlayer.connId))
        }

    }

    const resolveCombat = () => {
        setPlayersHelping([])
        setCombatPartyTotal(playerObj.level + playerObj.gearBonus)
        setMonsterLevel(0)
        setCombatMonsterTotal(0)
        setPlayersHelping([])
        socket.emit(E.RESOLVE_COMBAT)
        setTimeout(toggleCombat, 500)
    }

    return (
        <>
            <Button className="munchkinButton" style={{ width: "unset" }} onClick={toggleCombat}>Combat</Button>
            <Modal isOpen={isCombatOpen} toggle={toggleCombat}>
                <ModalHeader toggle={toggleCombat}>Combat</ModalHeader>
                <ModalBody>
                    <div className="container-fluid">
                        <Row className="text-center">
                            <Col className="text-start">
                                Party
                            </Col>
                            <Col className="text-start offset-2">
                                Monster
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            {/* Player column */}
                            <Col xs="5">
                                <Row>
                                    <Col>{playerObj.name}</Col><Col className="text-end">{playerObj.gearBonus + playerObj.level}</Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col>Modifier</Col><Col className="text-end">{playerObj.combat.partyModifier}</Col>
                                </Row>
                                <Row>
                                    <Col className="text-end"><Button className="munchkinButton" onClick={e => socket.emit(E.COMBAT_PARTY_MOD_INC)}>+</Button> <Button className="munchkinButton" onClick={e => socket.emit(E.COMBAT_PARTY_MOD_DEC)}>-</Button></Col>
                                </Row>
                                {allPlayersList.filter(player => player.helping).map(player => (
                                    <Row key={player.connId} className="mt-4">
                                        <Col>{player.name}</Col><Col className="text-end">{player.gearBonus + player.level}</Col>
                                    </Row>
                                ))}
                                <Row className="mt-4">
                                    <Col className="text-end">
                                        <Button className="munchkinButton" style={{ width: "unset", fontSize: "1rem" }} onClick={toggleHelpSelect}>Find help</Button>
                                    </Col>
                                </Row>
                            </Col>
                            {/* Combat icon */}
                            <Col xs="2" className="text-center"><img src={combatIcon} style={{ height: "auto", width: "40px" }} alt="" /></Col>
                            {/* Monster column */}
                            <Col xs="5">
                                <Row>
                                    <Col>Monster</Col><Col className="text-end"><input type="number" style={{ height: "24px" }} className="form-control" value={monsterLevel > 0 ? monsterLevel : ""} onChange={e => setMonsterLevel(Number(e.target.value))} /></Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col>Modifier</Col><Col className="text-end">{playerObj.combat.monsterModifier}</Col>
                                </Row>
                                <Row>
                                    <Col className="text-end"><Button className="munchkinButton" onClick={e => socket.emit(E.COMBAT_MONSTER_MOD_INC)}>+</Button> <Button className="munchkinButton" onClick={e => socket.emit(E.COMBAT_MONSTER_MOD_DEC)}>-</Button></Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="5">
                                <hr className="combatEquationLine" />
                            </Col>
                            <Col className="offset-2" xs="5">
                                <hr className="combatEquationLine" />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="5" className="text-end">
                                {combatPartyTotal}
                            </Col>
                            <Col xs="5" className="text-end offset-2">
                                {combatMonsterTotal}
                            </Col>
                        </Row>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className="munchkinButton" style={{ width: "unset", fontSize: "1.5rem" }} onClick={resolveCombat}>Resolve</Button>
                </ModalFooter>
            </Modal>


            <Modal size="sm" isOpen={isHelpSelectOpen} toggle={toggleHelpSelect}>
                <ModalHeader toggle={toggleHelpSelect}>Party Members</ModalHeader>
                <ModalBody>
                    {allPlayersList ? allPlayersList.map((player) => {
                        let isHelper = playersHelping.some(helper => helper.connId === player.connId)
                        let border = isHelper ? "5px solid #441B06" : "1px solid #441B06"
                        return <div
                            className="playerHelper p-3 mb-3"
                            key={player.connId}
                            onClick={() => toggleHelper(player.connId)}
                            style={{ border: border }}
                        >
                            <span>{player.name}</span><span style={{ float: "right" }}>{player.level + player.gearBonus}</span>
                        </div>
                    }) : <></>}
                </ModalBody>
                <ModalFooter>
                    <Button className="munchkinButton" style={{ width: "unset", fontSize: "1rem" }} onClick={sendHelp}>Done</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}