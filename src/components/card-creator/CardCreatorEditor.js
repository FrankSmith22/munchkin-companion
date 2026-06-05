import { Row, Col, Button } from "reactstrap";
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState, useRef } from "react";
import { EVENTS as E } from '../../app/events.mjs';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCoins, faDoorClosed, faRotateRight } from "@fortawesome/free-solid-svg-icons";

export default function CardEditor({socket, newCardModalIsOpen, setNewCardModalIsOpen, toggleNewCardModalIsOpen, defaultCardContent, editingCardContent, CARD_TYPES}){

    const setCustomCardFields = (newContent) => {
        try {
            localStorage.setItem("newCardContent", JSON.stringify(newContent))
            if (supertitleRef.current &&
                titleRef.current &&
                subtitleRef.current &&
                descriptionRef.current &&
                footerLeftRef.current &&
                footerRightRef.current
            ){
                supertitleRef.current.innerText = newContent.supertitle
                titleRef.current.innerText = newContent.title
                subtitleRef.current.innerText = newContent.subtitle
                descriptionRef.current.innerText = newContent.description
                footerLeftRef.current.innerText = newContent.footerLeft
                footerRightRef.current.innerText = newContent.footerRight
            }
        } catch(err) {
            // Dont actually do anything, we hit this on page load, I suspect because of rendering race conditions
        }
    }
    useEffect(() => {

        const handleCardCreated = () => {
            setNewCardModalIsOpen(false)
            // setNewCardContent(defaultCardContent)
            // setCustomCardFields(defaultCardContent)
        }

        socket.on(E.CREATE_CARD_SUCCESS, handleCardCreated)

        return () => {
            socket.off(E.CREATE_CARD_SUCCESS, handleCardCreated)
        }
    }, [])

    const [newCardContent, setNewCardContent] = useState({})
    const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(false)

    const supertitleRef = useRef(null)
    const titleRef = useRef(null)
    const subtitleRef = useRef(null)
    const descriptionRef = useRef(null)
    const footerLeftRef = useRef(null)
    const footerRightRef = useRef(null)

    useEffect(() => {
        if(newCardModalIsOpen) {
            // TODO move localstorage logic to CardCreator, because what was currently being edited when the page refreshed is dependent on how we got here
            // const savedNewCardContent = localStorage.getItem("newCardContent")
            // let savedNewCardContentObj = {}
            // if (savedNewCardContent){
            //     try {
            //         savedNewCardContentObj = JSON.parse(savedNewCardContent)
            //         console.log(`Loading from localstorage: ${savedNewCardContent}`)
            //     } catch (error) {
            //         console.error(`Something went wrong parsing newCardContent from local storage: ${error}. Loading in default values.`)
            //         savedNewCardContentObj = defaultCardContent

            //     } finally {
            //         setNewCardContent(savedNewCardContentObj)
            //         setCustomCardFields(savedNewCardContentObj)
            //     }
            // }
            setNewCardContent(editingCardContent)
            setCustomCardFields(editingCardContent)
        }
    }, [newCardModalIsOpen])
    

    const toggleCardType = () => {
        let newCardContentCopy = {...newCardContent}
        if (newCardContent.cardType === CARD_TYPES.DOOR){
            newCardContentCopy.cardType = CARD_TYPES.TREASURE
        } else {
            newCardContentCopy.cardType = CARD_TYPES.DOOR
        }
        setNewCardContent(newCardContentCopy)
        // localStorage.setItem("newCardContent", JSON.stringify(newCardContentCopy))
    }

    const updateNewCardContent = (section, content) => {
        let newCardContentCopy = {...newCardContent}
        if (section === "image") {
            newCardContentCopy.imageObj = content
            newCardContentCopy.image = URL.createObjectURL(content)
        } else {
            // else must be a ref object
            let ref = null
            switch(section) {
                case "supertitle": ref = supertitleRef; break;
                case "title": ref = titleRef; break;
                case "subtitle": ref = subtitleRef; break;
                case "description": ref = descriptionRef; break;
                case "footerLeft": ref = footerLeftRef; break;
                case "footerRight": ref = footerRightRef; break;
                default: console.error("Unknown section"); return;
            }
            newCardContentCopy[section] = ref.current.innerText
        }
        setNewCardContent(newCardContentCopy)
        console.log(newCardContentCopy)
        // localStorage.setItem("newCardContent", JSON.stringify(newCardContentCopy))
    }

    const handleSubmit = () => {
        setIsSubmitBtnDisabled(true)
        const file = newCardContent.imageObj
        delete newCardContent.imageObj
        socket.emit(E.CREATE_CARD, newCardContent, file, file.name)
    }

    const modalBodyClasses = "mx-auto mt-4 mt-md-0 d-flex"

    return (
        <Modal show={newCardModalIsOpen} onHide={toggleNewCardModalIsOpen} className="munchkinModal newCardCreatorModal">
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
                <div id="supertitle" ref={supertitleRef} contentEditable={true} suppressContentEditableWarning={true} onInput={e => updateNewCardContent("supertitle")} className="text-center mHeaderFont mx-auto" style={{fontSize: "1rem", width: "90%", overflowY: "auto", minHeight: "1.5rem"}}></div>
                <div id="title" ref={titleRef} contentEditable={true} suppressContentEditableWarning={true} onInput={e => updateNewCardContent("title")} className="text-center mHeaderFont" style={{fontSize: "2rem", overflowY: "auto", minHeight: "3rem", maxHeight: "6rem"}}></div>
                <div id="subtitle" ref={subtitleRef} contentEditable={true} suppressContentEditableWarning={true} onInput={e => updateNewCardContent("subtitle")} className="text-center mHeaderFont" style={{fontSize: "1rem", overflowY: "auto", minHeight: "1.5rem"}}></div>
                <br/>
                <div>
                    <label id="newCardCreatorUploadImageEditing" className="newCardCreatorUploadImage mx-auto d-flex" htmlFor="pictureUpload" style={{backgroundImage: `url(${newCardContent.image})`}}>
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
                <div id="description" ref={descriptionRef} contentEditable={true} suppressContentEditableWarning={true} onInput={e => updateNewCardContent("description")} className="newCardCreatorDescription editing"></div>
                <div className="d-flex justify-content-between" style={{overflowY: "hidden"}}>
                    <div id="footerLeft" ref={footerLeftRef} contentEditable={true} suppressContentEditableWarning={true} onInput={e => updateNewCardContent("footerLeft")} style={{width: "45%", display: "inline-block", overflowY: "auto", minHeight: "1.7rem"}}></div>
                    <div id="footerRight" ref={footerRightRef} contentEditable={true} suppressContentEditableWarning={true} onInput={e => updateNewCardContent("footerRight")} style={{width: "45%", display: "inline-block", textAlign: "end", overflowY: "auto", minHeight: "1.5rem"}}></div>
                </div>
            </Modal.Body>
            <div className="d-flex justify-content-evenly mt-5">
                <Button className="munchkinButton w-25" onClick={toggleNewCardModalIsOpen} style={{ backgroundColor: "#f48d5aff" }}>Cancel</Button>
                <Button className="munchkinButton w-25" disabled={isSubmitBtnDisabled} onClick={handleSubmit}>Create</Button>
            </div>
        </Modal>
    )
}