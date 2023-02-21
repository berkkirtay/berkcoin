import { useState, useEffect } from "react";
import React from 'react';
import LoadingTriangle from "../PageComponents/LoadingTriangle";
import { useNavigate } from "react-router-dom";

import Collectible from "./Collectible";
import RegisterModal from "./RegisterModal";
import { getCollectibles } from "../../services/ContractHelper";


const Market = ({ account, contract, refresher }) => {
    const [modalState, setModalState] = useState(false);
    const [collectibles, setCollectibles] = useState(undefined);
    const [refresh, setRefresh] = useState(false);
    const [sort, setSort] = useState("Sort By Price");
    const [fee, setFee] = useState(0);

    const navigate = useNavigate();
    useEffect(() => {
        getAllNFTs();
        refresher();
    }, [refresh, refresher])

    useEffect(() => {
        navigate("/market");
    }, [navigate, sort]);


    const getAllNFTs = async () => {
        const fee = await contract.methods.getCollectibleFee()
            .call({ from: account });
        setFee(fee);

        const retrievedCollectibles = await getCollectibles(account, contract);
        setCollectibles(retrievedCollectibles);
    }

    const registerNFT = () => {
        setModalState(true);
    }

    const onRegister = async (tokenURI, description, price, availability) => {
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
        let oldPrice = 0;
        collectibles.find((collectible) => {
            if (collectible.tokenID === tokenID)
                oldPrice = collectible.priceOfCollectible;
        });
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
            setSort("Sort By Date");
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
            {modalState === true &&
                <RegisterModal
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
                    <LoadingTriangle />
                }
            </ul>
        </div>
    )
}

export default Market