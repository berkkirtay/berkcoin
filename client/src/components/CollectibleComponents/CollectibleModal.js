import React, { useState, useEffect } from 'react'
import Modal from "react-modal";
Modal.setAppElement('#root');

export const CollectibleModal = ({ account, collectible, collectibleModalState, setCollectibleModalState, onBuyRequest, onUpdatePrice, fee }) => {
    const [isOwner, setOwner] = useState(false);
    const [price, setPrice] = useState(collectible.priceOfCollectible);
    const [availability, setAvailability] = useState(false);
    const [modalState, setModalState] = useState(false);

    useEffect(() => {
        if (collectible.tokenOwner === account) {
            setOwner(true);
        }
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        onUpdatePrice(price, availability);
        setModalState(!modalState);
    }

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal isOpen={collectibleModalState}
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
                            width: "33%",
                            height: "60%",
                            margin: "auto"
                        },
                    }
                }>
                <div>
                    <img style={{ width: "250px", height: "250px", borderRadius: "10%", display: "flex", margin: "0 auto" }} src={collectible.tokenURI} />
                    <p style={{ color: collectible.priceLevel, textAlign: "center", fontWeight: "bold" }}>{collectible.tokenDescription}</p>
                    <p style={{ color: collectible.priceLevel, textAlign: "center", fontWeight: "bold" }}>{collectible.priceOfCollectible} berkcoins</p>
                    <p style={{ color: "blue", textAlign: "center", fontWeight: "bold" }}>Created By: {collectible.tokenCreator}</p>
                    <p style={{ color: "blue", textAlign: "center", fontWeight: "bold" }}>Owner: {collectible.tokenOwner} {isOwner && <span>(you)</span>}</p>
                    <p style={{ color: "blue", textAlign: "center", fontWeight: "bold" }}>Collectible Hash: {collectible.collectibleHash}</p>
                    {isOwner && <button style={{ float: "left", marginTop: "6%" }} onClick={() => setModalState(!modalState)}>Update Price</button>}
                    {!isOwner && collectible.availability === true && <button style={{ float: "left", marginTop: "6%" }} onClick={onBuyRequest}>Buy Collectible</button>}
                    <button style={{ float: "right", marginTop: "6%" }} onClick={setCollectibleModalState}>Close</button>
                </div>

                <Modal isOpen={modalState}
                    shouldCloseOnEsc={true}
                    onRequestClose={() => setModalState(!modalState)}
                    centered
                    style={
                        {
                            overlay: {
                                opacity: "1"
                            },
                            content: {
                                borderRadius: "4%",
                                backgroundColor: "#9BB7D4",
                                width: "28%",
                                height: "35%",
                                margin: "auto"
                            },
                        }
                    }>

                    <div >
                        <button style={{ "float": "right", "marginTop": "1%" }} onClick={() => setModalState(!modalState)}>Close</button>
                        <h2>Update Collectible Price:</h2>
                        <form id="newOrder" onSubmit={onSubmit}>
                            <label>Enter a new price (berkcoins): </label>
                            <input type="number" required
                                value={price} onChange={(e) => setPrice(e.target.value)} />
                            <input style={{ float: "right", margin: "0", padding: "0", marginTop: "2%" }} type="checkbox"
                                value={availability} onChange={(e) => setAvailability(!availability)} />
                            <label style={{ display: "inline" }}>Set available: </label>
                            <h3 style={{ marginLeft: "10%" }}>Collectible will {!availability && "not"} be listed as available for trade.</h3>
                            {price !== 0 && <h3 style={{ color: "red", textAlign: "center" }}>You will pay {fee} berkcoins price update fee.</h3>}
                            <button style={{ display: "flex", margin: "auto" }}>Update</button>
                        </form>
                    </div>
                </Modal>
            </Modal>
        </div>
    )
}
