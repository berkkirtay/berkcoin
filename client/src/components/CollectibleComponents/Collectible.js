import React, { useState } from 'react';
import { CollectibleModal } from './CollectibleModal';

const Collectible = ({ account, collectible, onBuy, onSetPrice, onBurn, fee }) => {
    const [collectibleModalState, setCollectibleModalState] = useState(false);

    const changeModalState = () => {
        setCollectibleModalState(!collectibleModalState);
    }

    const onBuyRequest = () => {
        onBuy(collectible.tokenID);
    }

    const onUpdatePrice = (newPrice, availability) => {
        onSetPrice(collectible.tokenID, newPrice, availability);
    }

    const onBurnRequest = () => {
        onBurn(collectible.tokenID);
        changeModalState();
    }

    return (

        <div onClick={changeModalState} style={{ display: "flex", justifyContent: "center", margin: "3%", backgroundColor: "#9BB7D4", width: "300px", height: "390px", borderRadius: "4%", float: "left", cursor: "pointer" }}>

            {collectibleModalState === true &&
                <CollectibleModal
                    account={account}
                    collectible={collectible}
                    collectibleModalState={collectibleModalState}
                    setCollectibleModalState={changeModalState}
                    onBuyRequest={onBuyRequest}
                    onUpdatePrice={onUpdatePrice}
                    onBurnRequest={onBurnRequest}
                    fee={fee}
                />
            }
            <div style={{ margin: "10px" }}>
                <li key={collectible.tokenID}>
                    <div style={{ backgroundColor: collectible.priceLevel, borderRadius: "4%" }}>
                        <img style={{ width: "250px", height: "250px", borderRadius: "10%", padding: "5px" }} src={collectible.tokenURI} />
                    </div>
                    <p style={{ color: collectible.priceLevel, textAlign: "center", fontWeight: "bold" }}>{collectible.tokenDescription}</p>
                    <p style={{ color: collectible.priceLevel, textAlign: "center", fontWeight: "bold" }}>{collectible.priceOfCollectible} berkcoins</p>
                    {collectible.availability === true && <p style={{ color: "blue", textAlign: "center", fontWeight: "bold" }}>(On sale)</p>}
                </li>

            </div>
        </div>
    )
}

export default Collectible