import { useState, useEffect } from "react"

export default function CardCreatorListItem({card}) {

    const [selectedCard, setSelectedCard] = useState(null)

    // TODO handle deselecting other cards

    useEffect(()=> {
        if (!selectedCard) return
        
        selectedCard.style.filter = "blur(5px)"
        selectedCard.style.opacity = "0.8"
    }, [selectedCard])

    return (
        <div className="newCardCreatorCard d-flex" onClick={(e) => setSelectedCard(e.currentTarget)} style={{flexFlow: "column", overflow: "hidden", filter: "unset", opacity: "1"}}>
            <div className="text-center mHeaderFont mx-auto" style={{fontSize: "0.33rem", width: "90%", overflowY: "auto", minHeight: ".45rem"}}>
                {card.supertitle}
            </div>
            <div className="text-center mHeaderFont" style={{fontSize: "0.6rem", overflowY: "auto", minHeight: "1rem", maxHeight: "2rem"}}>
                {card.title}
            </div>
            <div className="text-center mHeaderFont" style={{fontSize: "0.3rem", overflowY: "auto", minHeight: ".45rem"}}>
                {card.subtitle}
            </div>
            <div>
                <label className="newCardCreatorUploadImage mx-auto d-flex" style={{backgroundImage: `url(${card.image})`}} />
            </div>
            <div className="newCardCreatorDescription">
                {card.description}
            </div>
            <div className="d-flex justify-content-between" style={{overflowY: "hidden"}}>
                <div style={{width: "45%", display: "inline-block", overflowY: "auto", fontSize: ".4rem"}}>
                    {card.footerLeft}
                </div>
                <div style={{width: "45%", display: "inline-block", textAlign: "end", overflowY: "auto", fontSize: ".4rem"}}>
                    {card.footerRight}
                </div>
            </div>
        </div>
    )
}