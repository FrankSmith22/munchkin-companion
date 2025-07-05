import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { EVENTS as E } from '../app/events.mjs';

export default function BackButton({socket}){

    return (
        <span>
            <FontAwesomeIcon
            style={{ fontSize: "2rem", color: "#441B06", cursor: "pointer" }}
            icon={faArrowLeft}
            onClick={e => socket.emit(E.DISCONNECT_ROOM)}
            />
        </span>
    )
}