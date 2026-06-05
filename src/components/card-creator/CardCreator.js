import BackButton from "../BackButton";
import { Row, Col } from "reactstrap";
import { useState } from "react";
import { EVENTS as E } from '../../app/events.mjs';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardCreatorListItem from "./CardCreatorListItem";
import CardCreatorEditor from "./CardCreatorEditor";

export default function CardCreator({socket, setDisplayMode, isConnected, setShowDisconnectedToast, allCards}){

    const CARD_TYPES = {
        DOOR: "door",
        TREASURE: "treasure"
    }
    
    const [defaultCardContent, setDefaultCardContent] = useState({
        cardType: CARD_TYPES.DOOR,
        supertitle: ">level/bonus<",
        title: ">Title<",
        subtitle: ">Subtitle<",
        description: ">Card description<",
        footerLeft: ">footer left<",
        footerRight: ">footer right<",
        image: "",
        imageObj: null
    })

    const [newCardModalIsOpen, setNewCardModalIsOpen] = useState(false)

    const [editingCardContent, setEditingCardContent] = useState(defaultCardContent)

    const toggleNewCardModalIsOpen = () => setNewCardModalIsOpen(!newCardModalIsOpen)
    
    const [selectedCard, setSelectedCard] = useState("")

    function startEditingNewCard () {
        setEditingCardContent(defaultCardContent)
        toggleNewCardModalIsOpen()
    }


    return (
        <>
        <BackButton socket={socket} confirm={false} setDisplayMode={setDisplayMode} isConnected={isConnected} setShowDisconnectedToast={setShowDisconnectedToast}/>
        <CardCreatorEditor socket={socket} newCardModalIsOpen={newCardModalIsOpen} setNewCardModalIsOpen={setNewCardModalIsOpen} toggleNewCardModalIsOpen={toggleNewCardModalIsOpen} defaultCardContent={defaultCardContent} editingCardContent={editingCardContent} CARD_TYPES={CARD_TYPES}/>
        <div className="container-fluid">
            <Row className="justify-content-evenly">
                <Col xs="3" md="2" className="mx-1 my-1 p-0">
                    <div onClick={startEditingNewCard} className="customCardThumbnailAdd d-flex justify-content-center">
                        <div className="align-self-center">
                            <span className="mHeaderFont">Create +</span>
                        </div>
                    </div>
                </Col>
                {allCards.map(card => {
                    return (
                        <Col key={card.id} xs="3" md="2" className="mx-1 my-1 p-0">
                            <CardCreatorListItem socket={socket} card={card} selectedCard={selectedCard} setSelectedCard={setSelectedCard} isConnected={isConnected} setShowDisconnectedToast={setShowDisconnectedToast} toggleNewCardModalIsOpen={toggleNewCardModalIsOpen} setEditingCardContent={setEditingCardContent} setDefaultCardContent={setDefaultCardContent}/>
                        </Col>
                    )
                })}
            </Row>
        </div>
        </>
    )
}