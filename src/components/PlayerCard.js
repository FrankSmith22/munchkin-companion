import { Button, Container, Row, Col } from 'reactstrap';
import { EVENTS as E } from '../app/events.mjs';
import BackButton from './BackButton';
import '../sidebar.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function PlayerCard({socket, playerObj, allPlayers}){

    const [sidebarToggle, setSidebarToggle] = useState(true)
    const [sidebarWidth, setSidebarWidth] = useState("100px")
    const [sidebarCloseBtnPosition, setSidebarCloseBtnPosition] = useState("60px")

    const toggleSidebar = () => {
        setSidebarToggle(!sidebarToggle)
        if (sidebarToggle){
            setSidebarWidth("100px")
            setSidebarCloseBtnPosition("60px")
        }
        else{
            setSidebarWidth("0px")
            setSidebarCloseBtnPosition("-30px")
        }
    }

    let allPlayersList = []
    if (allPlayers){
        allPlayersList = Object.entries(allPlayers).filter(element => element[0] != playerObj.connId)
    }

    return (
        <>
        <button className='sidebarCloseBtn' style={{ left: sidebarCloseBtnPosition }} onClick={e => toggleSidebar()}>{"X"}</button>
        <div id="mySidebar" className="sidebar" style={{ width: sidebarWidth }}>
            <ul>
                {allPlayersList ? allPlayersList.map((item) => {
                    return <li key={item[1].connId}>
                        {item[1].name}<br/>
                        Level: {item[1].level}<br/>
                        Total: {item[1].level + item[1].gearBonus}<br/><br/>
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
        <div className="container-fluid" style={{ height: "100%" }}>
            <Row style={{ height: "100%" }}>
                <Col className="offset-3">
                    <BackButton socket={socket} confirm={true}/>
                    <span style={{ fontSize: "36px" }}>{playerObj.name}</span>
                    <br></br><br></br>
                    Level: {playerObj.level} <Button className="playerButton" onClick={e => socket.emit(E.PLAYER_LEVEL_INC)}>+</Button> <Button className="playerButton" onClick={e => socket.emit(E.PLAYER_LEVEL_DEC)}>-</Button>
                    <br></br><br></br>
                    Gear: {playerObj.gearBonus} <Button className="playerButton" onClick={e => socket.emit(E.PLAYER_GEAR_INC)}>+</Button> <Button className="playerButton" onClick={e => socket.emit(E.PLAYER_GEAR_DEC)}>-</Button>
                    <br></br><br></br>
                    <b>total: {playerObj.level + playerObj.gearBonus}</b>
                </Col>
            </Row>
        </div>
        </>
    )
}