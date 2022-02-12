import { useState, useEffect } from "react";
import React from 'react';

const Staking = ({ account, contract, balance }) => {
    // inputs
    const [depositAmount, setDepositAmount] = useState(0);
    const [stakeDuration, setStakeDuration] = useState(0);
    const [refresh, setRefresh] = useState(false);

    // views
    const [stakedDuration, setStakedDuration] = useState("");
    const [stakedBalance, setStakedBalance] = useState(0);
    const [stakeReward, setStakeReward] = useState(0);
    const [calculatedStakeReward, setCalculatedStakeReward] = useState(0);
    const [interestRate, setInterestRate] = useState(0);
    const [availableStake, setAvailableStake] = useState(0);


    useEffect(() => {
        if (contract !== undefined) {
            getStakedAmount();
            getCurrentStakeReward();
            getStakeCompletionDate();
            getInterest();
            getContractBalance();
        }
    }, [refresh])

    useEffect(() => {
        calculateStakeReward();
    }, [depositAmount, stakeDuration])

    const onStake = async (e) => {
        e.preventDefault();
        await contract.methods.stake(stakeDuration * 60 * 60, (depositAmount * 10 ** 18).toString())
            .send({ from: account });

        setRefresh(!refresh);
    }

    const getStakedAmount = async () => {
        const response = await contract.methods.getStakeAmount(account)
            .call({ from: account });
        setStakedBalance(response / 10 ** 18);
    };

    const getCurrentStakeReward = async () => {
        const response = await contract.methods.getCurrentStakeReward(account)
            .call({ from: account });
        setStakeReward(response / 10 ** 18);
    };

    const getStakeCompletionDate = async () => {
        const response = await contract.methods.getStakeCompletionDate(account)
            .call({ from: account });

        if (response == 0) {
            setStakedDuration("NaN");
            return;
        }

        const date = new Date(response * 1000).toLocaleDateString("en-US");
        const time = new Date(response * 1000).toLocaleTimeString("en-US")
        setStakedDuration(date + " " + time);
    };

    const getInterest = async () => {
        const response = await contract.methods.getInterest()
            .call({ from: account });
        setInterestRate(response);
    }

    const getContractBalance = async () => {
        const response = await contract.methods.getContractBalance()
            .call({ from: account });
        setAvailableStake(response / 10 ** 18);
    }

    const calculateStakeReward = () => {
        let stakeRate = interestRate;
        // More than one day:
        if (stakeDuration > 24 * 60 * 60) {
            stakeRate = stakeRate * 2;
        }
        // More than 100 ETH:
        if (depositAmount > 100) {
            stakeRate = stakeRate * 2;
        }

        const response = stakeRate * availableStake / 10000;
        setCalculatedStakeReward(response / 10 ** 18);
    }

    const checkStakeStatus = async () => {
        const currentTimeStamp = Math.round((new Date()).getTime() / 1000);
        try {
            if (stakedBalance === 0) {
                throw "Stake balance is 0!";
            }
            await contract.methods.checkStakeStatus(account, currentTimeStamp)
                .send({ from: account });

            setRefresh(!refresh);
        }
        catch (error) {
            alert("Error on withdraw!");
            console.error(error);
        }
    }

    if (contract === undefined) {
        return (
            <div>Mounting the smart contract, please wait.</div>
        )
    }
    return (
        <div>
            <h3>Wallet Public Address: {account} <span style={{ float: "right" }}> Available Rewards: {availableStake} berkcoins</span></h3>
            <h3>Balance: {balance}</h3>
            <h3>Staked amount: {stakedBalance}</h3>
            <h3>Earnings from staking : {stakeReward}</h3>
            <h3>Staking will end : {stakedDuration}</h3>
            <button onClick={checkStakeStatus} style={{ display: "inline-block" }}>Withdraw stake</button>

            <div id="trade">
                <h2>Stake berkcoin</h2>
                <form id="newOrder" onSubmit={onStake}>
                    <label>Stake Amount: </label>
                    <input type="number" required
                        value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                    <label>Duration (hours): </label>
                    <input type="number" required
                        value={stakeDuration} onChange={(e) => setStakeDuration(e.target.value)} />
                    <h3 style={{ color: "green", textAlign: "center" }}>You will earn {calculatedStakeReward} berkcoins after stake completion.</h3>
                    <button style={{ display: "inline-block", marginLeft: "36%" }}>Stake berkcoin</button>

                </form>
            </div>
        </div>
    )
}

export default Staking