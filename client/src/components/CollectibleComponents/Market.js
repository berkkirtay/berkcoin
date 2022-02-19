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
    const [sort, setSort] = useState("Sort By Price");
    const [fee, setFee] = useState(0);

    const navigate = useNavigate();
    useEffect(() => {
        getAllNFTs();
        navigate("/berkcoin/market");
    }, [refresh])

    useEffect(() => {
        navigate("/berkcoin/market");
    }, [sort]);


    const getAllNFTs = async () => {
        const fee = await contract.methods.getCollectibleFee()
            .call({ from: account });
        setFee(fee);
        const collectibles = [];
        const tokenCount = await contract.methods.getTokenCount()
            .call({ from: account });
        for (var i = 1; i <= tokenCount; i++) {
            const accessibility = await contract.methods.getAccessibility(i)
                .call({ from: account });
            if (accessibility === false) {
                continue;
            }
            console.log(accessibility)
            const tokenURI = await contract.methods.getTokenURI(i)
                .call({ from: account });
            const tokenOwner = await contract.methods.getTokenOwner(i)
                .call({ from: account });
            const tokenCreator = await contract.methods.getTokenCreator(i)
                .call({ from: account });
            const tokenDescription = await contract.methods.getTokenDescription(i)
                .call({ from: account });
            const priceOfCollectible = await contract.methods.getPriceOfCollectible(i)
                .call({ from: account });
            const collectibleHash = await contract.methods.getTokenHash(i)
                .call({ from: account });
            const availability = await contract.methods.getAvailabilityOfToken(i)
                .call({ from: account });

            // Price level:
            var priceLevel = "green";
            if (priceOfCollectible >= 200000) {
                priceLevel = "darkviolet";
            }
            else if (priceOfCollectible >= 100000) {
                priceLevel = "#ff5202";
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
                "tokenCreator": tokenCreator,
                "tokenOwner": tokenOwner,
                "tokenDescription": tokenDescription,
                "priceOfCollectible": priceOfCollectible,
                "collectibleHash": collectibleHash,
                "priceLevel": priceLevel,
                "availability": availability
            }
            collectibles.push(Collectible);
        }
        setCollectibles(collectibles);
    }

    const registerNFT = () => {
        setModalState(true);
    }

    const onRegister = async (tokenURI, description, price, availability) => {
        console.log(availability)
        await contract.methods.registerNewCollectible(tokenURI, description, price, availability)
            .send({ from: account });
        setRefresh(!refresh);
    }

    const onBuy = async (tokenID) => {
        await contract.methods.buyCollectible(tokenID)
            .send({ from: account });
        setRefresh(!refresh);
    }

    const onSetPrice = async (tokenID, newPrice, availability) => {
        const oldPrice = collectibles.find(({ tokenID }) => tokenID === tokenID).priceOfCollectible;
        if (oldPrice !== newPrice) {
            await contract.methods.setPriceOfCollectible(tokenID, newPrice)
                .send({ from: account });
        }

        const currentAvailabilityStatus = await contract.methods.getAvailabilityOfToken(tokenID)
            .call({ from: account });
        if (availability !== currentAvailabilityStatus) {
            await contract.methods.setAvailabilityOfCollectible(tokenID, availability)
                .send({ from: account });
        }
        setRefresh(!refresh);
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

    const onBurn = async (tokenID) => {
        await contract.methods.burnCollectible(tokenID)
            .send({ from: account });
        setRefresh(!refresh);
    }


    return (
        <div>
            <h1>Berkcoin NFT Marketplace</h1>
            <button onClick={registerNFT}>Register a NFT</button>
            <button style={{ float: "right" }} onClick={onSort}>{sort}</button>
            {modalState === true && <RegisterModal
                modalState={modalState}
                setModalState={() => setModalState(!modalState)}
                onRegister={onRegister}
                fee={fee} />
            }
            <ul style={{ listStyleType: "none" }}>
                {collectibles !== undefined && collectibles.slice(0).map((collectible) => (
                    <Collectible
                        account={account}
                        collectible={collectible}
                        onBuy={onBuy}
                        onSetPrice={onSetPrice}
                        onBurn={onBurn}
                        fee={fee}
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