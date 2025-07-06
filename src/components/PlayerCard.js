import { Button, Container, Row, Col } from 'reactstrap';
import { EVENTS as E } from '../app/events.mjs';
import BackButton from './BackButton';
import '../sidebar.css';
import { useState } from 'react';

export default function PlayerCard({socket, playerObj}){

    const [sidebarToggle, setSidebarToggle] = useState(true)
    const [sidebarWidth, setSidebarWidth] = useState("100px")
    const [sidebarBtnPosition, setSidebarBtnPosition] = useState("75px")
    const [sidebarBtnRotate, setSidebarBtnRotate] = useState("0deg")

    const toggleSidebar = () => {
        setSidebarToggle(!sidebarToggle)
        if (sidebarToggle){
            setSidebarWidth("100px")
            setSidebarBtnPosition("75px")
            setSidebarBtnRotate("0deg")
        }
        else{
            setSidebarWidth("0px")
            setSidebarBtnPosition("20px")
            setSidebarBtnRotate("180deg")
        }
    }

    return (
        <>
        <button className='sidebarToggleBtn' style={{ left: sidebarBtnPosition, rotate: sidebarBtnRotate }} onClick={e => toggleSidebar()}>{"<"}</button>
        <div id="mySidebar" class="sidebar" style={{ width: sidebarWidth }}>
            <ul>
                <li>
                Name:  Elegos<br/>
                Level: 5<br/>
                Total: 16<br/><br/>
                </li>
                <li>
                Name:  Mononoke<br/>
                Level: 3<br/>
                Total: 20<br/>
                </li>
            </ul>
        </div>
        {/* Main contents */}
        <Container style={{ height: "100%" }}>
            <Row style={{ height: "100%" }}>
                <Col className="offset-2">
                    <BackButton socket={socket} confirm={true}/>
                    <span style={{ fontSize: "36px" }}>{playerObj.name}</span>
                    <br></br><br></br>
                    level: {playerObj.level} <Button className="playerButton" onClick={e => socket.emit(E.PLAYER_LEVEL_INC)}>+</Button> <Button className="playerButton" onClick={e => socket.emit(E.PLAYER_LEVEL_DEC)}>-</Button>
                    <br></br><br></br>
                    gear bonus: {playerObj.gearBonus} <Button className="playerButton" onClick={e => socket.emit(E.PLAYER_GEAR_INC)}>+</Button> <Button className="playerButton" onClick={e => socket.emit(E.PLAYER_GEAR_DEC)}>-</Button>
                    <br></br><br></br>
                    <b>total: {playerObj.level + playerObj.gearBonus}</b>
                </Col>
            </Row>
        </Container>
        </>
    )
}