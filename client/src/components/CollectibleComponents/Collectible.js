import React, { useEffect, useState } from 'react'

const Collectible = ({ collectible }) => {


    return (
        <div style={{ display: "flex", justifyContent: "center", margin: "3%", backgroundColor: "#9BB7D4", width: "300px", borderRadius: "4%", float: "left" }}>
            <div style={{ margin: "5px" }}>
                <li key={collectible.tokenID}>
                    <img style={{ width: "250px", height: "250px", borderRadius: "10%" }} src={collectible.tokenURI} />
                    <p style={{ color: "blue", textAlign: "center" }}>{collectible.tokenDescription}</p>
                    <p style={{ color: "blue", textAlign: "center", fontWeight: "bold" }}>{collectible.priceOfCollectible} berkcoins</p>
                </li>
            </div>
        </div>
    )
}

export default Collectible