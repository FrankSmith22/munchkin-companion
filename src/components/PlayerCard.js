import { Button, Row, Col } from 'reactstrap';
import { EVENTS as E } from '../app/events.mjs';
import BackButton from './BackButton';
import RulesButton from './RulesButton';
import '../sidebar.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBook } from '@fortawesome/free-solid-svg-icons';
import CombatButton from './CombatButton';

export default function PlayerCard({socket, playerObj, allPlayers, allRules, rulesErrorMsg}){

    const [sidebarToggle, setSidebarToggle] = useState(true)
    const [sidebarPosition, setSidebarPosition] = useState("0px")
    const [sidebarCloseBtnPosition, setSidebarCloseBtnPosition] = useState("40px")

    const toggleSidebar = () => {
        if (sidebarToggle){
            setSidebarPosition("-120px")
            setSidebarCloseBtnPosition("-80px")
        }
        else{
            setSidebarPosition("0px")
            setSidebarCloseBtnPosition("40px")
        }
        setSidebarToggle(!sidebarToggle)
    }

    let allPlayersList = []
    if (allPlayers){
        allPlayersList = Object.entries(allPlayers).map(element => element[1]).filter(player => player.connId != playerObj.connId)
    }

    return (
        <>
        <button className='sidebarCloseBtn' style={{ left: sidebarCloseBtnPosition }} onClick={e => toggleSidebar()}>{"X"}</button>
        <div id="mySidebar" className="sidebar" style={{ left: sidebarPosition }}>
            <ul>
                {allPlayersList ? allPlayersList.map((player) => {
                    return <li key={player.connId}>
                        {player.name}<br/>
                        Level: {player.level}<br/>
                        Total: {player.level + player.gearBonus}<br/><br/>
                        </li>
                }) : <></>}
            </ul>
        </div>
        <div>
            <FontAwesomeIcon
                icon={faBars}
                style={{ fontSize: "30px", cursor: "pointer", color: "#441B06" }}
                onClick={e => toggleSidebar()}
            />
        </div>
        <div className="container-fluid mt-5" style={{ height: "100%" }}>
            <Row>
                <Col className="offset-3" style={{ wordWrap: "break-word" }}>
                    <span><BackButton socket={socket} confirm={true}/><RulesButton socket={socket} allRules={allRules} rulesErrorMsg={rulesErrorMsg}/></span>
                    <span style={{ fontSize: "36px" }}>{playerObj.name}</span>
                    <br></br><br></br>
                    Level: {playerObj.level} <Button className="munchkinButton" onClick={e => socket.emit(E.PLAYER_LEVEL_INC)}>+</Button> <Button className="munchkinButton" onClick={e => socket.emit(E.PLAYER_LEVEL_DEC)}>-</Button>
                    <br></br><br></br>
                    Gear: {playerObj.gearBonus} <Button className="munchkinButton" onClick={e => socket.emit(E.PLAYER_GEAR_INC)}>+</Button> <Button className="munchkinButton" onClick={e => socket.emit(E.PLAYER_GEAR_DEC)}>-</Button>
                    <br></br><br></br>
                    <b>total: {playerObj.level + playerObj.gearBonus}</b>
                </Col>
            </Row>
            <Row className="mt-5">
                <Col className="offset-3 p-0">
                    <CombatButton socket={socket} allPlayersList={allPlayersList} playerObj={playerObj}/>
                </Col>
            </Row>
        </div>
        </>
    )
}