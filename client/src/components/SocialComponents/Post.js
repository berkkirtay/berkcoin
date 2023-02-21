import React, { useEffect, useState } from 'react'
import Markdown from "markdown-to-jsx"

const Post = ({ post, onVote, onBurn }) => {
    const [date, setDate] = useState("");
    useEffect(() => {
        const date = new Date(post.date * 1000).toLocaleDateString("en-US");
        const time = new Date(post.date * 1000).toLocaleTimeString("en-US");
        setDate(date + " " + time);
    });

    const onUpvote = async () => {
        await onVote(post.id, 1);
    };

    const onDownvote = async () => {
        await onVote(post.id, -1);
    };

    const onDelete = async () => {
        await onBurn(post.id);
    }

    const RenderedImage = ({ alt, src }) => (
        <img
            alt={alt}
            src={src}
            style={{ maxWidth: "700px" }}
        />
    );


    return (
        <li key={post.id} style={{ width: "80%", margin: "0 auto", display: "block" }}>
            <h4>{post.author} <span style={{ float: "right" }}>{date}</span></h4>
            <div style={{ padding: "1%", width: "80%", margin: "0 auto", backgroundColor: "#caebf7", borderRadius: "2%" }} >
                <Markdown
                    children={post.text}
                    options={{
                        forceInlineBlock: true,
                        overrides: {
                            img: RenderedImage
                        }

                    }} />

            </div>
            <span title="Upvote" onClick={onUpvote} style={{ cursor: "pointer", margin: "1%" }}><i className="fa fa-thumbs-up"></i></span>
            <span title="Downvote" onClick={onDownvote} style={{ cursor: "pointer", margin: "1%" }}><i className="fa fa-thumbs-down"></i></span>
            <span style={{ float: "right" }}>Points: {post.upvotes}</span>
            <hr />
        </li>
    )
}

export default Post