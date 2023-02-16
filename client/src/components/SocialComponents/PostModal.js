import React, { useState } from 'react'
import Modal from "react-modal";
Modal.setAppElement('#root');

const PostModal = ({ modalState, setModalState, onSend }) => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        onSend(title, text);
        setTitle("");
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
                            height: "50%",
                            margin: "auto"
                        },
                    }
                }>

                <button style={{ float: "right", marginTop: "1%" }} onClick={setModalState}>Close</button>
                <h1>Send a new post:</h1>
                <form onSubmit={onSubmit}>
                    <label>Title: </label>
                    <input type="string" required
                        value={title} onChange={(e) => setTitle(e.target.value)} />
                    <label>Text: </label>
                    <textarea type="string" required
                        value={text} onChange={(e) => setText(e.target.value)}
                        style={{ height: "200px" }} />
                    <button style={{ display: "flex", margin: "auto", marginTop: "5%" }}>Send</button>
                </form>
            </Modal >
        </div >
    )
}

export default PostModal;