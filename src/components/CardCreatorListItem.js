export default function CardCreatorListItem({card, setSelectedCard, selectedCard}) {

    return (
        <div>
            <div className="newCardCreatorCard d-flex" onClick={() => setSelectedCard(card)} style={{
                flexFlow: "column", 
                overflow: "hidden", 
                filter: selectedCard.id === card.id ? "blur(5px)" : "unset",
                opacity: selectedCard.id === card.id ? "0.8" : "1"
            }}>
                <div className="text-center mHeaderFont mx-auto" style={{fontSize: "0.33rem", width: "90%", overflowY: "auto", minHeight: ".45rem"}}>
                    {card.data.supertitle}
                </div>
                <div className="text-center mHeaderFont" style={{fontSize: "0.6rem", overflowY: "auto", minHeight: "1rem", maxHeight: "2rem"}}>
                    {card.data.title}
                </div>
                <div className="text-center mHeaderFont" style={{fontSize: "0.3rem", overflowY: "auto", minHeight: ".45rem"}}>
                    {card.data.subtitle}
                </div>
                <div>
                    <label className="newCardCreatorUploadImage mx-auto d-flex" style={{backgroundImage: `url(${card.data.image})`}} />
                </div>
                <div className="newCardCreatorDescription">
                    {card.data.description}
                </div>
                <div className="d-flex justify-content-between" style={{overflowY: "hidden"}}>
                    <div style={{width: "45%", display: "inline-block", overflowY: "auto", fontSize: ".4rem"}}>
                        {card.data.footerLeft}
                    </div>
                    <div style={{width: "45%", display: "inline-block", textAlign: "end", overflowY: "auto", fontSize: ".4rem"}}>
                        {card.data.footerRight}
                    </div>
                </div>
            </div>
            <div style={{display: selectedCard.id === card.id ? "block" : "none", position: "relative"}}>hello world</div>
        </div>
    )
}