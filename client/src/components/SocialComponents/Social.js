import React from 'react';
import { useState, useEffect } from "react";
import LoadingTriangle from "../PageComponents/LoadingTriangle";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/ContractHelper";
import PostModal from "./PostModal";
import Post from './Post';

const Social = ({ account, contract, refresher }) => {
    const [modalState, setModalState] = useState(false);
    const [posts, setPosts] = useState(undefined);
    const [refresh, setRefresh] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        getAllPosts();
        refresher();
    }, [refresh, refresher])

    useEffect(() => {
        navigate("/social");
    }, [navigate]);

    const getAllPosts = async () => {
        const posts = await getPosts(account, contract);
        setPosts(posts);
    }

    const sendPost = () => {
        setModalState(true);
    }

    const onSend = async (title, text) => {
        await contract.methods.sendPost(title, text)
            .send({ from: account });
        setRefresh(!refresh);
    };

    const onVote = async (postID, vote) => {
        await contract.methods.votePost(postID, vote)
            .send({ from: account });
        setRefresh(!refresh);
    };

    const onBurn = async (postID) => {
        await contract.methods.burnPost(postID)
            .send({ from: account });
        setRefresh(!refresh);
    };

    const onSort = () => {

    }
    return (
        <div>
            <h3>This page is under construction.</h3>
        </div>
    )
    return (
        <div>
            <link rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
            <button onClick={sendPost}>New Post</button>
            <button style={{ float: "right" }} onClick={onSort}>Sort by votes</button>
            <h3> Posts from users: </h3>
            {modalState === true &&
                <PostModal
                    modalState={modalState}
                    setModalState={() => setModalState(!modalState)}
                    onSend={onSend} />
            }

            <ul style={{ listStyleType: "none" }}>
                {posts !== undefined && posts.slice(0).map((post) => (
                    <Post post={post} onVote={onVote} />
                ))}

                {posts === undefined &&
                    <LoadingTriangle />
                }
            </ul>
        </div>
    )
}

export default Social;