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
        cardType: CARD_TYPES.DOOR,
        supertitle: ">level/bonus<",
        title: ">Title<",
        subtitle: ">Subtitle<",
        description: ">Card description<",
        footerLeft: ">footer left<",
        footerRight: ">footer right<",
    }

    const setCustomCardFields = (newContent) => {
        // Hate doing this manual innerHTML setting, but is necessary for contentEditable items in React the way this is set up
        try {
            localStorage.setItem("newCardContent", JSON.stringify(newContent))
            document.querySelector("#supertitle").innerHTML = newContent.supertitle
            document.querySelector("#title").innerHTML = newContent.title
            document.querySelector("#subtitle").innerHTML = newContent.subtitle
            document.querySelector("#description").innerHTML = newContent.description
            document.querySelector("#footerLeft").innerHTML = newContent.footerLeft
            document.querySelector("#footerRight").innerHTML = newContent.footerRight
        } catch(err) {
            // Dont actually do anything, we hit this on page load, I suspect because of rendering race conditions
        }
    }
    useEffect(() => {
        const savedNewCardContent = localStorage.getItem("newCardContent")
        let savedNewCardContentObj = {}
        if (savedNewCardContent){
            try {
                savedNewCardContentObj = JSON.parse(savedNewCardContent)
                setNewCardContent(savedNewCardContentObj) // TODO might be able to move to finally block
                console.log(`Loading from localstorage: ${savedNewCardContent}`)
            } catch (error) {
                console.error(`Something went wrong parsing newCardContent from local storage: ${error}. Loading in default values.`)
                savedNewCardContentObj = defaultCardContent
            } finally {
                setCustomCardFields(savedNewCardContentObj)
            }
        }
    }, [])


    const [newCardModalIsOpen, setNewCardModalIsOpen] = useState(false)
    // const [cardType, setCardType] = useState(CARD_TYPES.DOOR)
    const [newCardContent, setNewCardContent] = useState({})

    const toggleNewCardModalIsOpen = () => setNewCardModalIsOpen(!newCardModalIsOpen)
    
    const newCardModal = () => {

        const toggleCardType = () => {
            let newCardContentCopy = {...newCardContent}
            if (newCardContent.cardType === CARD_TYPES.DOOR){
                newCardContentCopy.cardType = CARD_TYPES.TREASURE
            } else {
                newCardContentCopy.cardType = CARD_TYPES.DOOR
            }
            setNewCardContent(newCardContentCopy)
            localStorage.setItem("newCardContent", JSON.stringify(newCardContentCopy))
        }

        const updateNewCardContent = (section, content) => {
            let newCardContentCopy = {...newCardContent}
            newCardContentCopy[section] = content
            setNewCardContent(newCardContentCopy)
            localStorage.setItem("newCardContent", JSON.stringify(newCardContentCopy))
        }

        const modalBodyClasses = "mx-auto mt-4 mt-md-0 d-flex "
        return (
            <Modal show={newCardModalIsOpen} onHide={toggleNewCardModalIsOpen} onShow={() => setCustomCardFields(newCardContent)} className="munchkinModal newCardCreatorModal">
                <Modal.Body className={modalBodyClasses + (newCardContent.cardType === CARD_TYPES.DOOR ? "doorCardColor" : "treasureCardColor")} style={{flexFlow: "column"}}>
                    <FontAwesomeIcon
                        icon={newCardContent.cardType === CARD_TYPES.DOOR ? faDoorClosed : faCoins}
                        onClick={toggleCardType}
                        style={{position: "absolute", height: "2rem", color: "#441B06"}}
                    />
                    <FontAwesomeIcon
                        icon={faRotateRight}
                        onClick={() => {
                            setNewCardContent(defaultCardContent)
                            setCustomCardFields(defaultCardContent)
                        }}
                        style={{position: "absolute", height: "2rem", color: "#441B06", right: "16px"}}
                    />
                    <div id="supertitle" contentEditable="plaintext-only" suppressContentEditableWarning={true} onInput={e => updateNewCardContent("supertitle", e.target.textContent)} className="text-center mHeaderFont mx-auto" style={{fontSize: "1rem", width: "90%"}} dangerouslySetInnerHTML={{ __html: defaultCardContent.supertitle }}></div>
                    <div id="title" contentEditable="plaintext-only" suppressContentEditableWarning={true} onInput={e => updateNewCardContent("title", e.target.textContent)} className="text-center mHeaderFont" style={{fontSize: "2rem"}} dangerouslySetInnerHTML={{ __html: defaultCardContent.title }}></div>
                    <div id="subtitle" contentEditable="plaintext-only" suppressContentEditableWarning={true} onInput={e => updateNewCardContent("subtitle", e.target.textContent)} className="text-center mHeaderFont" style={{fontSize: "1rem"}} dangerouslySetInnerHTML={{ __html: defaultCardContent.supertitle }}></div>
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
                    <div id="description" contentEditable="plaintext-only" suppressContentEditableWarning={true} onInput={e => updateNewCardContent("description", e.target.textContent)} className="newCardCreatorDescription" dangerouslySetInnerHTML={{ __html: defaultCardContent.description }}></div>
                    <div className="d-flex justify-content-between">
                        <span id="footerLeft" contentEditable="plaintext-only" suppressContentEditableWarning={true} onInput={e => updateNewCardContent("footerLeft", e.target.textContent)} style={{width: "45%", display: "inline-block"}} dangerouslySetInnerHTML={{ __html: defaultCardContent.footerLeft }}></span><span id="footerRight" contentEditable="plaintext-only" onInput={e => updateNewCardContent("footerRight", e.target.textContent)} style={{width: "45%", display: "inline-block", textAlign: "end"}} dangerouslySetInnerHTML={{ __html: defaultCardContent.footerRight }}></span>
                    </div>
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