import React, { useState, useEffect } from 'react'
import Modal from "react-modal";
Modal.setAppElement('#root');

export const CollectibleModal = ({ account, collectible, collectibleModalState, setCollectibleModalState }) => {
    const [isOwner, setOwner] = useState(false);

    useEffect(() => {
        if (collectible.tokenOwner === account) {
            setOwner(true);
        }
    }, []);

    return (
        <div>
            <Modal isOpen={collectibleModalState}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                onRequestClose={setCollectibleModalState}
                centered
                style={
                    {
                        overlay: {
                            opacity: "1"
                        },
                        content: {
                            borderRadius: "4%",
                            backgroundColor: "#9BB7D4",
                            width: "35%",
                            height: "60%",
                            margin: "auto"
                        },
                    }
                }>
                <img style={{ width: "250px", height: "250px", borderRadius: "10%", display: "flex", margin: "0 auto" }} src={collectible.tokenURI} />
                <p style={{ color: collectible.priceLevel, textAlign: "center", fontWeight: "bold" }}>{collectible.tokenDescription}</p>
                <p style={{ color: collectible.priceLevel, textAlign: "center", fontWeight: "bold" }}>{collectible.priceOfCollectible} berkcoins</p>
                <p style={{ color: "blue", textAlign: "center", fontWeight: "bold" }}>Owner: {collectible.tokenOwner} {isOwner && <span>(you)</span>}</p>
                <p style={{ color: "blue", textAlign: "center", fontWeight: "bold" }}>Collectible Hash: {collectible.collectibleHash}</p>
                {isOwner && <button style={{ float: "left", marginTop: "10%" }} onClick={setCollectibleModalState}>Update Price</button>}
                <button style={{ float: "right", marginTop: "10%" }} onClick={setCollectibleModalState}>Close</button>

            </Modal>
        </div>
    )
}
