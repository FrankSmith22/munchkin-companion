import BackButton from "./BackButton";
import { Row, Col, Button } from "reactstrap";
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from "react";
import { EVENTS as E } from '../app/events.mjs';
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
        image: ""
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

        const handleCardCreated = () => {
            setNewCardModalIsOpen(false)
            setNewCardContent(defaultCardContent)
            setCustomCardFields(defaultCardContent)
        }

        socket.on(E.CREATE_CARD_SUCCESS, handleCardCreated)

        return () => {
            socket.off(E.CREATE_CARD_SUCCESS, handleCardCreated)
        }
    }, [])


    const [newCardModalIsOpen, setNewCardModalIsOpen] = useState(false)
    const [newCardContent, setNewCardContent] = useState({})
    const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(false)

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
            if (content === undefined) return
            let newCardContentCopy = {...newCardContent}
            console.log(content)
            if (section === "image") {
                content = URL.createObjectURL(content)
            }
            newCardContentCopy[section] = content
            setNewCardContent(newCardContentCopy)
            localStorage.setItem("newCardContent", JSON.stringify(newCardContentCopy))
        }

        const handleSubmit = () => {
            setIsSubmitBtnDisabled(true)
            socket.emit(E.CREATE_CARD, newCardContent)
        }

        const modalBodyClasses = "mx-auto mt-4 mt-md-0 d-flex"
        return (
            <Modal show={newCardModalIsOpen} onHide={toggleNewCardModalIsOpen} onShow={() => setCustomCardFields(newCardContent)} className="munchkinModal newCardCreatorModal">
                <Modal.Body className={modalBodyClasses + " " + (newCardContent.cardType === CARD_TYPES.DOOR ? "doorCardColor" : "treasureCardColor")} style={{flexFlow: "column", overflow: "hidden"}}>
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
                    <div id="supertitle" contentEditable="plaintext-only" suppressContentEditableWarning={true} onInput={e => updateNewCardContent("supertitle", e.target.textContent)} className="text-center mHeaderFont mx-auto" style={{fontSize: "1rem", width: "90%", overflowY: "auto", minHeight: "1.5rem"}} dangerouslySetInnerHTML={{ __html: defaultCardContent.supertitle }}></div>
                    <div id="title" contentEditable="plaintext-only" suppressContentEditableWarning={true} onInput={e => updateNewCardContent("title", e.target.textContent)} className="text-center mHeaderFont" style={{fontSize: "2rem", overflowY: "auto", minHeight: "3rem", maxHeight: "6rem"}} dangerouslySetInnerHTML={{ __html: defaultCardContent.title }}></div>
                    <div id="subtitle" contentEditable="plaintext-only" suppressContentEditableWarning={true} onInput={e => updateNewCardContent("subtitle", e.target.textContent)} className="text-center mHeaderFont" style={{fontSize: "1rem", overflowY: "auto", minHeight: "1.5rem"}} dangerouslySetInnerHTML={{ __html: defaultCardContent.supertitle }}></div>
                    <br/>
                    <div>
                        <label className="newCardCreatorUploadImage mx-auto d-flex" htmlFor="pictureUpload" style={{backgroundImage: `url(${newCardContent.image})`}}>
                            {
                                !newCardContent.image ? 
                                    <FontAwesomeIcon
                                        icon={faCamera}
                                        className="mx-auto align-self-center"
                                        style={{height: "2rem", color: "#441B06"}}
                                    />
                                    :
                                    ""
                            }
                        </label>
                        <input type="file" id="pictureUpload" accept="image/*" onChange={event => updateNewCardContent("image", event.target.files[0])} style={{display: "none"}}/>
                    </div>
                    <br/>
                    <div id="description" contentEditable="plaintext-only" suppressContentEditableWarning={true} onInput={e => updateNewCardContent("description", e.target.textContent)} className="newCardCreatorDescription" dangerouslySetInnerHTML={{ __html: defaultCardContent.description }}></div>
                    <div className="d-flex justify-content-between" style={{overflowY: "hidden"}}>
                        <div id="footerLeft" contentEditable="plaintext-only" suppressContentEditableWarning={true} onInput={e => updateNewCardContent("footerLeft", e.target.textContent)} style={{width: "45%", display: "inline-block", overflowY: "auto", minHeight: "1.7rem"}} dangerouslySetInnerHTML={{ __html: defaultCardContent.footerLeft }}></div><div id="footerRight" contentEditable="plaintext-only" onInput={e => updateNewCardContent("footerRight", e.target.textContent)} style={{width: "45%", display: "inline-block", textAlign: "end", overflowY: "auto", minHeight: "1.5rem"}} dangerouslySetInnerHTML={{ __html: defaultCardContent.footerRight }}></div>
                    </div>
                </Modal.Body>
                <div className="d-flex justify-content-evenly mt-5">
                    <Button className="munchkinButton w-25" onClick={toggleNewCardModalIsOpen} style={{ backgroundColor: "#f48d5aff" }}>Cancel</Button>
                    <Button className="munchkinButton w-25" disabled={isSubmitBtnDisabled} onClick={handleSubmit}>Create</Button>
                </div>
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