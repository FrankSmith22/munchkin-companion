import BackButton from './BackButton';
import { Row, Col } from 'reactstrap';
import munchkinGuy from '../res/munchkin-guy.png'

export default function TvCard({socket, allPlayers}){

    function playerSlot(connId, playerObj) {
        return (
            <Col xs="6" md="3" key={connId} style={{ border: "1px dashed #441B06", height: "40vh" }}>
                <div className="d-flex align-items-center flex-column h-100">
                    <div className="tvCardText">{playerObj.name}</div>
                    <img src={munchkinGuy} className="profilePicture"></img>
                    <div className='mt-auto d-flex flex-row justify-content-between w-100'>
                        <div className="tvCardText" style={{ color: playerObj.level >= 9 ? "red": "inherit" }}>L{playerObj.level}</div>
                        <div className="tvCardText">{playerObj.level + playerObj.gearBonus}</div>
                    </div>
                </div>
            </Col>
        )
    }

    let playerSlots = []
    // Uncomment for test data
    // allPlayers = {
    //     "blah1": {
    //         name: "test1",
    //         profilePicture: "munchkin-guy.png",
    //         level: 9,
    //         gearBonus: 4
    //     },
    //     "blah2": {
    //         name: "test2",
    //         profilePicture: "munchkin-guy.png",
    //         level: 9,
    //         gearBonus: 4
    //     },
    //     "blah3": {
    //         name: "test3",
    //         profilePicture: "munchkin-guy.png",
    //         level: 9,
    //         gearBonus: 4
    //     },
    //     "blah4": {
    //         name: "test4",
    //         profilePicture: "munchkin-guy.png",
    //         level: 9,
    //         gearBonus: 4
    //     },
    //     "blah5": {
    //         name: "test5",
    //         profilePicture: "munchkin-guy.png",
    //         level: 9,
    //         gearBonus: 4
    //     },
    //     "blah6": {
    //         name: "test6",
    //         profilePicture: "munchkin-guy.png",
    //         level: 9,
    //         gearBonus: 4
    //     },
    //     "blah7": {
    //         name: "test7",
    //         profilePicture: "munchkin-guy.png",
    //         level: 9,
    //         gearBonus: 4
    //     },
    //     "blah8": {
    //         name: "test8",
    //         profilePicture: "munchkin-guy.png",
    //         level: 9,
    //         gearBonus: 4
    //     },
    // }
    console.log(JSON.stringify(allPlayers))
    for (const [connId, playerObj] of Object.entries(allPlayers)){
        playerSlots.push(playerSlot(connId, playerObj))
    }


    return (
        <div>
            <BackButton socket={socket} confirm={false}/>
            <div className="container-fluid">
                <Row>
                    {playerSlots}
                </Row>
            </div>
        </div>
    )
}