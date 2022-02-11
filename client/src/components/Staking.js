import { useState, useEffect } from "react";
import React from 'react';
const Staking = ({ account }) => {
    const stakeAccount = {
        "balance": 0,
        "earnings": 0,
        "duration": 0,
    }

    return (
        <div>
            <h3>Wallet Public Address: {account}</h3>
            <h3>Staking amount: {stakeAccount.balance}</h3>
            <h3>Earnings from staking : +{stakeAccount.earnings}</h3>
            <h3>Staking duration : {stakeAccount.duration}</h3>
        </div>
    )
}

export default Staking