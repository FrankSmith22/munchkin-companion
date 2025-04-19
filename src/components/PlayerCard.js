import React, { useState, useEffect } from 'react';
import { EVENTS as E } from '../app/events.mjs';

export default function PlayerCard({socket, playerObj}){

    return (
        <div>
            {JSON.stringify(playerObj)}
        </div>
    )
}