import BackButton from './BackButton';

export default function TvCard({socket, allPlayers}){

    function playerSlot(connId, playerObj) {
        return (
            <div key={connId}>
                <span>Name: {playerObj.name}</span><br/>
                <span>Level: {playerObj.level}</span><br/>
                <span>Total bonus: {playerObj.level + playerObj.gearBonus}</span><br/><br/>
            </div>
        )
    }

    let playerSlots = []
    console.log(JSON.stringify(allPlayers))
    for (const [connId, playerObj] of Object.entries(allPlayers)){
        playerSlots.push(playerSlot(connId, playerObj))
    }


    return (
        <div>
            <BackButton socket={socket} confirm={false}/>
            {playerSlots}
        </div>
    )
}