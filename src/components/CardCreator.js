import BackButton from "./BackButton";
import { Row, Col } from "reactstrap";
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from "react";
// import Draggable from "react-draggable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCoins, faDoorClosed, faRotateRight } from "@fortawesome/free-solid-svg-icons";

export default function CardCreator({socket, setDisplayMode, isConnected, setShowDisconnectedToast}){

    const CARD_TYPES = {
        DOOR: "door",
        TREASURE: "treasure"
    }

    const defaultCardContent = {
        supertitle: ">level/bonus<",
        title: ">Title<",
        subtitle: ">Subtitle<",
        description: ">Card description<",
        footerLeft: ">footer left<",
        footerRight: ">footer right<",
    }

    const [newCardModalIsOpen, setNewCardModalIsOpen] = useState(false)
    const [cardType, setCardType] = useState(CARD_TYPES.DOOR)
    const [newCardContent, setNewCardContent] = useState(defaultCardContent)
    const [defaultContentOnModalOpen, setDefaultContentOnModalOpen] = useState(defaultCardContent)

    const toggleNewCardModalIsOpen = () => setNewCardModalIsOpen(!newCardModalIsOpen)


    useEffect(() => {
        const savedNewCardContent = localStorage.getItem("newCardContent")
        if (savedNewCardContent){
            try {
                const savedNewCardContentObj = JSON.parse(savedNewCardContent)
                setNewCardContent(savedNewCardContentObj)
                setDefaultContentOnModalOpen(savedNewCardContentObj)
            } catch (error) {
                console.error(`Something went wrong parsing newCardContent from local storage: ${error}. Loading in default values.`)
            }
        }
    },[])

    
    const newCardModal = () => {

        const toggleCardType = () => {
            if (cardType === CARD_TYPES.DOOR){
                setCardType(CARD_TYPES.TREASURE)
            } else {
                setCardType(CARD_TYPES.DOOR)
            }
        }

        const updateNewCardContent = (section, content) => {
            let newCardContentCopy = {...newCardContent}
            newCardContentCopy[section] = content
            setNewCardContent(newCardContentCopy)
            localStorage.setItem("newCardContent", JSON.stringify(newCardContentCopy))
        }
        
        const resetNewCardContent = () => {
            setNewCardContent(defaultCardContent)
            setDefaultContentOnModalOpen(defaultCardContent)
            localStorage.setItem("newCardContent", JSON.stringify(defaultCardContent))
        }

        const modalBodyClasses = "mx-auto mt-4 mt-md-0 draggableParent d-flex "
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
            <Modal show={newCardModalIsOpen} onHide={toggleNewCardModalIsOpen} onShow={() => setDefaultContentOnModalOpen(newCardContent)} className="munchkinModal newCardCreatorModal">
                <Modal.Body className={modalBodyClasses + (cardType === CARD_TYPES.DOOR ? "doorCardColor" : "treasureCardColor")} style={{flexFlow: "column"}}>
                    <FontAwesomeIcon
                        icon={cardType === "door" ? faDoorClosed : faCoins}
                        onClick={toggleCardType}
                        style={{position: "absolute", height: "2rem", color: "#441B06"}}
                    />
                    <FontAwesomeIcon
                        icon={faRotateRight}
                        onClick={resetNewCardContent}
                        style={{position: "absolute", height: "2rem", color: "#441B06", right: "16px"}}
                    />
                    <div contentEditable="plaintext-only" onInput={e => updateNewCardContent("supertitle", e.target.textContent)} className="text-center mHeaderFont mx-auto" style={{fontSize: "1rem", width: "90%"}}>{defaultContentOnModalOpen.supertitle}</div>
                    <div contentEditable="plaintext-only" onInput={e => updateNewCardContent("title", e.target.textContent)} className="text-center mHeaderFont" style={{fontSize: "2rem"}}>{defaultContentOnModalOpen.title}</div>
                    <div contentEditable="plaintext-only" onInput={e => updateNewCardContent("subtitle", e.target.textContent)} className="text-center mHeaderFont" style={{fontSize: "1rem"}}>{defaultContentOnModalOpen.subtitle}</div>
                    <br/>
                    <div>
                        <label className="newCardCreatorUploadImage mx-auto d-flex" htmlFor="pictureUpload">
                            <FontAwesomeIcon
                                icon={faCamera}
                                className="mx-auto align-self-center"
                                style={{height: "2rem", color: "#441B06"}}
                            />
                        </label>
                        <input type="file" id="pictureUpload" style={{display: "none"}}/>
                    </div>
                    <br/>
                    <div contentEditable="plaintext-only" onInput={e => updateNewCardContent("description", e.target.textContent)} className="newCardCreatorDescription">{defaultContentOnModalOpen.description}</div>
                    <div className="d-flex justify-content-between">
                        <span contentEditable="plaintext-only" onInput={e => updateNewCardContent("footerLeft", e.target.textContent)} style={{width: "45%", display: "inline-block"}}>{defaultContentOnModalOpen.footerLeft}</span><span contentEditable="plaintext-only" onInput={e => updateNewCardContent("footerRight", e.target.textContent)} style={{width: "45%", display: "inline-block", textAlign: "end"}}>{defaultContentOnModalOpen.footerRight}</span>
                    </div>
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
        {newCardModal()}
        <div className="container-fluid">
            <Row className="justify-content-evenly">
                <Col xs="3" md="2" className="mx-1 my-1 p-0">
                    <div onClick={toggleNewCardModalIsOpen} className="customCardThumbnailAdd d-flex justify-content-center">
                        <div className="align-self-center">
                            <span className="mHeaderFont">Create +</span>
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