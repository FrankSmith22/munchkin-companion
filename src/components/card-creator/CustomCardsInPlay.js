import React, { useRef, useState, useEffect } from 'react';
import Deck from 'deck-of-cards';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import '../../customCardsInPlay.css';
import '../../deck-of-cards.css';
import { EVENTS as E } from '../../app/events.mjs';
import munchkinGuy from "../../res/munchkin-guy.png"

export default function CustomCardsInPlay({socket, allCards}) {
    const containerRef = useRef(null);
    const deckInstanceRef = useRef(null);

    const [isDrawCardModalOpen, setIsDrawCardModalOpen] = useState(false);

    const toggleDrawCardModal = () => setIsDrawCardModalOpen(!isDrawCardModalOpen);

    const [isDrawButtonDisabled, setIsDrawButtonDisabled] = useState(false)

    useEffect(() => {
        for (const card of allCards) {
            new Image().src = card.data.image
        }
    }, [allCards])

    const loadFaces = (front = true) => {
        const deck = deckInstanceRef.current;

        const myCustomText = [
            "Fight a Level 1 Potted Plant",
            "Go up a Level!",
            "Curse! Lose your Headgear",
        ];

        deck.cards.forEach((card, index) => {
            const cardText = myCustomText[index % myCustomText.length];
            if (front) {
                const faceDiv = card.$el.querySelector('.face');
                if (faceDiv) {
                    // 1. Forcefully remove the library's playing card sprite sheet
                    faceDiv.style.backgroundImage = 'none';
                    faceDiv.style.backgroundColor = '#f4e9d8'; // Parchment background
    
                    // 2. Inject your custom content directly into the native face
                    faceDiv.innerHTML = `
                        <div class="custom-card-content">
                            <div class="card-header">Munchkin Action</div>
                            <div class="card-body-text">${cardText}</div>
                        </div>
                    `;
                }
            }
            else {
                const faceDiv = card.$el.querySelector('.back');
                if (faceDiv) {
                    // 1. Forcefully remove the library's playing card sprite sheet
                    faceDiv.style.backgroundImage = 'none';
                    faceDiv.style.backgroundColor = '#f4e9d8'; // Parchment background
    
                    // 2. Inject your custom content directly into the native face
                    faceDiv.innerHTML = `
                        <div class="custom-card-content back">
                            <div class="card-body-text">custom card</div>
                            <img src="${munchkinGuy}" class="custom-card-content-image"/>
                        </div>
                    `;
                }

            }
        });
    };

    // 1. Initialize deck only when the modal is completely open and visible
    const handleModalOpened = () => {
        if (containerRef.current && !deckInstanceRef.current) {
            const deck = Deck();
            deckInstanceRef.current = deck;
            deck.mount(containerRef.current);

            // load custom faces
            loadFaces(false);
        }
    };

    // 2. Clean up the deck when the modal finishes closing
    const handleModalClosed = () => {
        if (deckInstanceRef.current) {
            deckInstanceRef.current.unmount();
            deckInstanceRef.current = null;
        }
    };

    // Action Triggers
    const handleShuffle = () => {
        if (deckInstanceRef.current) deckInstanceRef.current.shuffle();
    };

    const handleFan = () => {
        if (deckInstanceRef.current) deckInstanceRef.current.fan();
    };

    const handleFlip = () => {
        const deck = deckInstanceRef.current
        if (deck) {
            loadFaces();
            deck.flip();
            loadFaces();
        }
    };

    const handleSort = () => {
        if (deckInstanceRef.current) deckInstanceRef.current.sort();
    };

    const drawCard = () => {
        if (deckInstanceRef.current.cards[0].side === 'back') {
            handleFlip()
        }
        setIsDrawButtonDisabled(true)
        handleFan()
        setTimeout(() => {
            // handleFlip()
            setTimeout(() => {
                // handleFlip()
                handleShuffle()
                handleShuffle()
                handleShuffle()
                handleShuffle()
                handleShuffle()
                setTimeout(() => {
                    // handleFlip()
                    setIsDrawButtonDisabled(false)
                }, 2500)
            }, 1500)
        }, 1000)
    };

    return (
        <>
            <Modal 
                isOpen={isDrawCardModalOpen} 
                toggle={toggleDrawCardModal} 
                className="munchkinModal"
                onOpened={handleModalOpened}
                onClosed={handleModalClosed}
            >
                <ModalHeader toggle={toggleDrawCardModal}>Draw custom card</ModalHeader>
                <ModalBody style={{ height: "50vh" }}>
                    <div style={{  marginTop: "50%" }}>
                        {/* Control Buttons */}
                        <div style={{ marginBottom: '30px' }}>
                            {/* <button onClick={handleShuffle} style={buttonStyle}>Shuffle</button>
                            <button onClick={handleFan} style={buttonStyle}>Fan</button>
                            <button onClick={handleFlip} style={buttonStyle}>Flip All</button>
                            <button onClick={handleSort} style={buttonStyle}>Sort</button> */}
                        </div>

                        {/* The Vanilla DOM container */}
                        <div
                            ref={containerRef}
                            className="deck-container-wrapper mt-5"
                            style={{
                                position: 'relative',
                                width: '100%',
                                margin: '0 auto',
                                left: "45%"
                            }}
                        />
                    </div>
                </ModalBody>
                <ModalFooter className="d-flex justify-content-center">
                    <Button className="munchkinButton" onClick={drawCard} disabled={isDrawButtonDisabled}>~ Draw ~</Button>
                </ModalFooter>
            </Modal>
            <div className="sticky-bottom-right">
                <Button className="munchkinButton" onClick={toggleDrawCardModal}>Draw Custom Card</Button>
            </div>
        </>
    );
};

// Quick inline styling for the buttons
const buttonStyle = {
    margin: '0 8px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#fff'
};