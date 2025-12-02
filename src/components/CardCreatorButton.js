import { Button } from "reactstrap";
import { DISPLAY_MODES } from "../App"

export default function CardCreatorButton({setDisplayMode}) {
    return (
        <Button className='floating-button munchkinButton' onClick={() => setDisplayMode(DISPLAY_MODES.CARD_CREATOR_MODE)}>
            card creator
        </Button>
    )
}