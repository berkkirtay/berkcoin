import { useState, useEffect } from "react";
import React from 'react';
import { BallTriangle } from 'react-loader-spinner'
import { useNavigate } from "react-router-dom";

import Collectible from "./Collectible";
import RegisterModal from "./RegisterModal";


const Market = ({ account, contract }) => {
    const [modalState, setModalState] = useState(false);
    const [collectibles, setCollectibles] = useState(undefined);
    const [refresh, setRefresh] = useState(false);
    const [sort, setSort] = useState("Sort By Price")

    const navigate = useNavigate();
    useEffect(() => {
        getAllNFTs();
    }, [refresh])

    useEffect(() => {
        navigate("/market");
    }, [sort]);


    const getAllNFTs = async () => {
        const collectibles = [];
        const tokenCount = await contract.methods.getTokenCount()
            .call({ from: account });
        for (var i = 1; i <= tokenCount; i++) {
            const tokenURI = await contract.methods.getTokenURI(i)
                .call({ from: account });
            const tokenOwner = await contract.methods.getTokenOwner(i)
                .call({ from: account });
            const tokenDescription = await contract.methods.getTokenDescription(i)
                .call({ from: account });
            const priceOfCollectible = await contract.methods.getPriceOfCollectible(i)
                .call({ from: account });
            const collectibleHash = await await contract.methods.getTokenHash(i)
                .call({ from: account });

            // Price level:
            var priceLevel = "green";
            if (priceOfCollectible >= 200000) {
                priceLevel = "darkviolet";
            }
            else if (priceOfCollectible >= 100000) {
                priceLevel = "#FF7102";
            }
            else if (priceOfCollectible >= 50000) {
                priceLevel = "red";
            }
            else if (priceOfCollectible >= 10000) {
                priceLevel = "blue";
            }

            const Collectible = {
                "tokenID": i,
                "tokenURI": tokenURI,
                "tokenOwner": tokenOwner,
                "tokenDescription": tokenDescription,
                "priceOfCollectible": priceOfCollectible,
                "collectibleHash": collectibleHash,
                "priceLevel": priceLevel
            }
            collectibles.push(Collectible);
        }
        setCollectibles(collectibles);
    }

    const registerNFT = () => {
        setModalState(true);
    }

    const onRegister = async (tokenURI, description, price) => {
        await contract.methods.registerNewCollectible(tokenURI, description, price)
            .send({ from: account });
        setRefresh(!refresh);
    }

    const onBuy = async () => {

    }

    const onSell = async () => {

    }

    const onSetPrice = async () => {

    }

    const onSort = () => {
        if (sort === "Sort By Price") {
            const sortedArr = collectibles.sort(function (a, b) {
                return b.priceOfCollectible - a.priceOfCollectible;
            });
            setCollectibles(sortedArr);
            setSort("Sort By Default");
        }
        else {
            setSort("Sort By Price");
            getAllNFTs();
        }
    }

    return (
        <div>
            <h1>Berkcoin NFT Marketplace</h1>
            <button onClick={registerNFT}>Register a NFT</button>
            <button style={{ float: "right" }} onClick={onSort}>{sort}</button>
            {modalState === true && <RegisterModal
                modalState={modalState}
                setModalState={() => setModalState(!modalState)}
                onRegister={onRegister} />}
            <ul style={{ listStyleType: "none" }}>
                {collectibles !== undefined && collectibles.slice(0).map((collectible) => (
                    <Collectible
                        account={account}
                        collectible={collectible}
                    />
                ))}
                {collectibles === undefined &&
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <BallTriangle color="#00BFFF" height={200} width={200} />
                    </div>
                }
            </ul>
        </div>
    )
}

export default Market