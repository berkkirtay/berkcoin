import React, { useState } from 'react'
import Modal from "react-modal";
Modal.setAppElement('#root');

const RegisterModal = ({ modalState, setModalState, onRegister, fee }) => {
    const [tokenURI, setTokenURI] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [availability, setAvailability] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        onRegister(tokenURI, description, price, availability);
        setTokenURI("");
        setDescription("");
        setPrice(0);
        setModalState();
    }

    return (
        <div >
            <Modal isOpen={modalState}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                onRequestClose={setModalState}
                centered
                style={
                    {
                        overlay: {
                            opacity: "1"
                        },
                        content: {
                            borderRadius: "4%",
                            backgroundColor: "#92A8D1",
                            width: "35%",
                            height: "60%",
                            margin: "auto"
                        },
                    }
                }>

                <button style={{ float: "right", marginTop: "1%" }} onClick={setModalState}>Close</button>
                <h1 >Register a NFT:</h1>
                {tokenURI !== "" &&
                    <div style={{ display: "inline", float: "right", margin: "5%", textAlign: "center" }} >
                        <p>NFT Appearance</p>
                        <img style={{ width: "100px", height: "100px", borderRadius: "10%", margin: "0 auto" }} alt="collectible" src={tokenURI} />
                    </div>
                }
                <form id="newOrder" onSubmit={onSubmit}>
                    <label>Collectible Token URI: </label>
                    <input type="string" required
                        value={tokenURI} onChange={(e) => setTokenURI(e.target.value)} />
                    <label>Collectible Description: </label>
                    <input type="string" required
                        value={description} onChange={(e) => setDescription(e.target.value)} />
                    <label>Collectible Price (berkcoins): </label>
                    <input type="number" required
                        value={price} onChange={(e) => setPrice(e.target.value)} />
                    <input style={{ float: "right", margin: "0", padding: "0", marginTop: "2%" }} type="checkbox"
                        value={availability} onChange={(e) => setAvailability(!availability)} />
                    <label style={{ display: "inline" }}>Set available: </label>
                    <h3 style={{ marginLeft: "10%" }}>Collectible will {!availability && "not"} be listed as available for trade.</h3>
                    {price !== 0 && <h3 style={{ color: "red", marginLeft: "10%" }}>You will pay {fee} berkcoins registration fee.</h3>}
                    <button style={{ display: "flex", margin: "auto", marginTop: "5%" }}>Register</button>
                </form>
            </Modal >
        </div >
    )
}

export default RegisterModal