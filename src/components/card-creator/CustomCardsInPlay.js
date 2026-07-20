import React, { useRef, useState } from 'react';
import Deck from 'deck-of-cards';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import '../../customCardsInPlay.css';
import '../../deck-of-cards.css';

export default function CustomCardsInPlay() {
    const containerRef = useRef(null);
    const deckInstanceRef = useRef(null);

    const [isDrawCardModalOpen, setIsDrawCardModalOpen] = useState(false);

    const toggleDrawCardModal = () => setIsDrawCardModalOpen(!isDrawCardModalOpen);

    // 1. Initialize deck only when the modal is completely open and visible
    const handleModalOpened = () => {
        if (containerRef.current && !deckInstanceRef.current) {
            const deck = Deck(true);
            deckInstanceRef.current = deck;
            deck.mount(containerRef.current);
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
        if (deckInstanceRef.current) deckInstanceRef.current.flip();
    };

    const handleSort = () => {
        if (deckInstanceRef.current) deckInstanceRef.current.sort();
    };

    const drawCard = () => {
        console.log("hello world");
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
                <ModalBody>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        {/* Control Buttons */}
                        <div style={{ marginBottom: '30px' }}>
                            <button onClick={handleShuffle} style={buttonStyle}>Shuffle</button>
                            <button onClick={handleFan} style={buttonStyle}>Fan</button>
                            <button onClick={handleFlip} style={buttonStyle}>Flip All</button>
                            <button onClick={handleSort} style={buttonStyle}>Sort</button>
                        </div>

                        {/* The Vanilla DOM container */}
                        <div
                            ref={containerRef}
                            className="deck-container-wrapper mt-5"
                            style={{
                                position: 'relative',
                                height: '300px',
                                width: '100%',
                                margin: '0 auto',
                                left: "50%"
                            }}
                        />
                    </div>
                </ModalBody>
                <ModalFooter className="d-flex justify-content-center">
                    <Button className="munchkinButton" onClick={drawCard}>~ Draw ~</Button>
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