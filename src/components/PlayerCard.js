import { Button, Row, Col } from 'reactstrap';
import { EVENTS as E } from '../app/events.mjs';
import BackButton from './BackButton';
import RulesButton from './RulesButton';
import '../sidebar.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBook } from '@fortawesome/free-solid-svg-icons';
import CombatButton from './CombatButton';
import { PICTURES as P } from '../app/pictureMapping';
import bellLow from "../res/Synth_Bell_A_lo.wav";
import bellHigh from "../res/Synth_Bell_A_hi.wav";

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

    
    const playChimeLow = () => {
        let audioLow = new Audio(bellLow)
        audioLow.play()
    }
    const playChimeHigh = () => {
        let audioHigh = new Audio(bellHigh)
        audioHigh.play()
    }

    let allPlayersList = []
    if (allPlayers){
        allPlayersList = Object.entries(allPlayers).map(element => element[1]).filter(player => player.connId != playerObj.connId)
    }
    // allPlayersList.push(allPlayersList[0])
    // allPlayersList.push(allPlayersList[0])
    // allPlayersList.push(allPlayersList[0])
    // allPlayersList.push(allPlayersList[0])
    // allPlayersList.push(allPlayersList[0])
    // allPlayersList.push(allPlayersList[0])

    return (
        <>
        <button className='sidebarCloseBtn' style={{ left: sidebarCloseBtnPosition }} onClick={() => toggleSidebar()}>{"X"}</button>
        <div id="mySidebar" className="sidebar overflow-auto" style={{ left: sidebarPosition }}>
            <ul>
                {allPlayersList ? allPlayersList.map((player, i, a) => {
                    return (<li key={player.connId}>
                                {i == 0 ? "" : <hr/>}
                                {player.name}<br/>
                                <img src={P[player.picture]} onClick={playChimeHigh} className="img-thumbnail w-75 playerPictureThumbnail mb-1"></img>
                                Level: {player.level}<br/>
                                Total: {player.level + player.gearBonus}
                            </li>)
                }) : <></>}
            </ul>
        </div>
        <div>
            <FontAwesomeIcon
                icon={faBars}
                style={{ fontSize: "30px", cursor: "pointer", color: "#441B06" }}
                onClick={() => toggleSidebar()}
            />
        </div>
        <div className="container-fluid mt-3" style={{ height: "80%" }}>
            <Row>
                <Col className="offset-3" style={{ wordWrap: "break-word" }}>
                    <span><BackButton socket={socket} confirm={true}/><RulesButton socket={socket} allRules={allRules} rulesErrorMsg={rulesErrorMsg}/></span>
                    <br/>
                    <span style={{ fontSize: "36px" }}>{playerObj.name}</span>
                    <br/>
                    <img src={P[playerObj.picture]} onClick={playChimeLow} className="img-thumbnail w-75 playerPictureThumbnail" style={{ maxWidth: "170px" }}></img>
                    <br></br><br></br>
                    Level: {playerObj.level} <Button className="munchkinButton plusMinusButton" onClick={() => socket.emit(E.PLAYER_LEVEL_INC)}>+</Button> <Button className="munchkinButton plusMinusButton" onClick={() => socket.emit(E.PLAYER_LEVEL_DEC)}>-</Button>
                    <br></br><br></br>
                    Gear: {playerObj.gearBonus} <Button className="munchkinButton plusMinusButton" onClick={() => socket.emit(E.PLAYER_GEAR_INC)}>+</Button> <Button className="munchkinButton plusMinusButton" onClick={() => socket.emit(E.PLAYER_GEAR_DEC)}>-</Button>
                    <br></br><br></br>
                    <b>total: {playerObj.level + playerObj.gearBonus}</b>
                    <br></br><br></br>
                    <CombatButton socket={socket} allPlayersList={allPlayersList} playerObj={playerObj}/>
                </Col>
            </Row>
        </div>
        </>
    )
}