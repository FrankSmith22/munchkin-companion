import BackButton from "./BackButton";
import { Row, Col, CardDeck } from "reactstrap";
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faDoorClosed, faGrip, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function CardCreator({socket, setDisplayMode, isConnected, setShowDisconnectedToast}){

    const CARD_TYPES = {
        DOOR: "door",
        TREASURE: "treasure"
    }

    const [newCardModalIsOpen, setNewCardModalIsOpen] = useState(false)
    const [cardType, setCardType] = useState(CARD_TYPES.DOOR)

    const toggleNewCardModalIsOpen = () => setNewCardModalIsOpen(!newCardModalIsOpen)

    
    const cardSetupModal = () => {
        const toggleCardType = () => {
            if (cardType === CARD_TYPES.DOOR){
                setCardType(CARD_TYPES.TREASURE)
            } else {
                setCardType(CARD_TYPES.DOOR)
            }
        }
        const modalBodyClasses = "mx-auto mt-4 mt-md-0 draggableParent "
        return (
            // TODO maybe implement this proper one day... Just overkill for now
            // <Modal show={newCardModalIsOpen} onHide={toggleNewCardModalIsOpen} className="munchkinModal newCardCreatorModal">
            //     <Modal.Body
            //         className={modalBodyClasses + (cardType === CARD_TYPES.DOOR ? "doorCardColor" : "treasureCardColor")}
            //     >
            //         <FontAwesomeIcon
            //             icon={cardType === "door" ? faDoorClosed : faCoins}
            //             onClick={toggleCardType}
            //         />
            //         <Draggable
            //             bounds=".draggableParent"
            //             handle=".handle"
            //         >
            //             <div style={{display: "inline-block"}} className="text-center">
            //                 <div className="d-flex justify-content-evenly">
            //                     <FontAwesomeIcon 
            //                         className="handle"
            //                         icon={faGrip}
            //                     />
            //                     <FontAwesomeIcon
            //                         icon={faTrashCan}
            //                     />
            //                 </div>
            //                 <span contentEditable>hello world</span>
            //             </div>
            //         </Draggable>
            //     </Modal.Body>
            // </Modal>
            <Modal show={newCardModalIsOpen} onHide={toggleNewCardModalIsOpen} className="munchkinModal newCardCreatorModal">
                <Modal.Body className={modalBodyClasses + (cardType === CARD_TYPES.DOOR ? "doorCardColor" : "treasureCardColor")}>
                    <FontAwesomeIcon
                        icon={cardType === "door" ? faDoorClosed : faCoins}
                        onClick={toggleCardType}
                        style={{position: "absolute", height: "2rem"}}
                    />
                    <div contentEditable className="text-center mx-auto" style={{fontSize: "1rem", width: "90%"}}>level/bonus</div>
                    <div contentEditable className="text-center" style={{fontSize: "2rem"}}>Title</div>
                    <div contentEditable className="text-center" style={{fontSize: "1rem"}}>Subtitle</div>
                    {/* Need:
                        1. level/bonus
                        2. title
                        3. subtitle
                        4. image
                        5. description
                        6. footer (armor | levels           gp value | treasure)
                    */}
                </Modal.Body>
            </Modal>
        )
    }
    

    return (
        <>
        <BackButton socket={socket} confirm={false} setDisplayMode={setDisplayMode} isConnected={isConnected} setShowDisconnectedToast={setShowDisconnectedToast}/>
        {cardSetupModal()}
        <div className="container-fluid">
            <Row className="justify-content-evenly">
                <Col xs="3" md="2" className="mx-1 my-1 p-0">
                    <div onClick={toggleNewCardModalIsOpen} className="customCardThumbnailAdd d-flex justify-content-center">
                        <div className="align-self-center">
                            <span>Create +</span>
                        </div>
                    </div>
                </Col>
                <Col xs="3" md="2" className="mx-1 my-1 p-0">
                    <div className="customCardThumbnail">
                        ===I am a placeholder card===
                    </div>
                </Col>
                <Col xs="3" md="2" className="mx-1 my-1 p-0">
                    <div className="customCardThumbnail">
                        ===I am a placeholder card===
                    </div>
                </Col>
                
            </Row>
        </div>
        </>
    )
}