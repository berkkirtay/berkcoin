import React, { useState } from 'react'
import Modal from "react-modal";
Modal.setAppElement('#root');

const PostModal = ({ modalState, setModalState, onSend }) => {
    const [text, setText] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        onSend(text);
        setText("");
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
                            height: "55%",
                            margin: "auto"
                        },
                    }
                }>

                <button style={{ float: "right", marginTop: "1%" }} onClick={setModalState}>Close</button>
                <h1>Send a new post:</h1>
                <form onSubmit={onSubmit}>
                    <label>You can write your post in markdown format: </label>
                    <textarea type="string" required
                        value={text} onChange={(e) => setText(e.target.value)}
                        style={{ height: "260px" }} />
                    <h3 style={{ display: "flex", color: "red", margin: "auto 0" }}>You will pay 10000 berkcoins posting fee.</h3>
                    <button style={{ display: "flex", margin: "auto", marginTop: "5%" }}>Send</button>
                </form>
            </Modal >
        </div >
    )
}

export default PostModal;