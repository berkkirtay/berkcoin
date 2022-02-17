import React, { useState } from 'react'
import Modal from "react-modal";
Modal.setAppElement('#root');

const RegisterModal = ({ modalState, setModalState, onRegister }) => {
    const [tokenURI, setTokenURI] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);

    const onSubmit = (e) => {
        e.preventDefault();
        onRegister(tokenURI, description, price);
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
                            backgroundColor: "snow",
                            width: "35%",
                            height: "60%",
                            margin: "auto"
                        },
                    }
                }>
                <button style={{ "float": "right", "marginTop": "1%" }} onClick={setModalState}>Close</button>
                <h1 >Register a NFT:</h1>
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
                    {price !== 0 && <h3 style={{ color: "red", textAlign: "center" }}>You will pay {price / 1000} berkcoins registration fee.</h3>}
                    <button style={{ display: "flex", margin: "auto" }}>Register</button>
                </form>
            </Modal>
        </div>
    )
}

export default RegisterModal