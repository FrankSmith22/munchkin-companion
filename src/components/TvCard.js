import React, { useState, useEffect } from 'react';
import { EVENTS as E } from '../app/events.mjs';

export default function TvCard({socket, allPlayers}){

    function playerSlot(socketId, playerObj) {
        return (
            <div key={socketId}>
                <span>Name: {playerObj.name}</span>
                <span>Level: {playerObj.level}</span>
                <span>Total bonus: {playerObj.level + playerObj.gearBonus}</span>
            </div>
        )
    }

    let playerSlots = []
    for (const [socketId, playerObj] of Object.entries(allPlayers)){
        playerSlots.push(playerSlot(socketId, playerObj))
    }

    return (
        <div>
            {playerSlots}
        </div>
    )
}