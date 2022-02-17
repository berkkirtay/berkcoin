import React, { useEffect, useState } from 'react';
import { CollectibleModal } from './CollectibleModal';

const Collectible = ({ account, collectible }) => {
    const [collectibleModalState, setCollectibleModalState] = useState(false);

    const changeModalState = () => {
        setCollectibleModalState(!collectibleModalState);
    }

    return (
        <div onClick={changeModalState} style={{ display: "flex", justifyContent: "center", margin: "3%", backgroundColor: "#9BB7D4", width: "300px", borderRadius: "4%", float: "left", cursor: "pointer" }}>
            {collectibleModalState === true &&
                <CollectibleModal
                    account={account}
                    collectible={collectible}
                    collectibleModalState={collectibleModalState}
                    setCollectibleModalState={changeModalState}
                />
            }
            <div style={{ margin: "5px" }}>
                <li key={collectible.tokenID}>
                    <img style={{ width: "250px", height: "250px", borderRadius: "10%" }} src={collectible.tokenURI} />
                    <p style={{ color: collectible.priceLevel, textAlign: "center", fontWeight: "bold" }}>{collectible.tokenDescription}</p>
                    <p style={{ color: collectible.priceLevel, textAlign: "center", fontWeight: "bold" }}>{collectible.priceOfCollectible} berkcoins</p>
                </li>
            </div>
        </div>
    )
}

export default Collectible