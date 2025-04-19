import React, { useState, useEffect } from 'react';
import { EVENTS as E } from '../app/events.mjs';

export default function PlayerCard({socket, playerObj}){

    return (
        <div>
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