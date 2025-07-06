import { EVENTS as E } from '../app/events.mjs';
import BackButton from './BackButton';

export default function PlayerCard({socket, playerObj}){

    return (
        <div>
            <BackButton socket={socket} confirm={true}/>
            Name: {playerObj.name}
            <br></br><br></br>
            level: {playerObj.level} <button onClick={e => socket.emit(E.PLAYER_LEVEL_INC)}>+</button> <button onClick={e => socket.emit(E.PLAYER_LEVEL_DEC)}>-</button>
            <br></br><br></br>
            gear bonus: {playerObj.gearBonus} <button onClick={e => socket.emit(E.PLAYER_GEAR_INC)}>+</button> <button onClick={e => socket.emit(E.PLAYER_GEAR_DEC)}>-</button>
            <br></br><br></br>
            <b>total: {playerObj.level + playerObj.gearBonus}</b>
        </div>
    )
}