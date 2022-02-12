import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useState } from "react"
const Trade = ({ account, contract, balance, ethBalance, getBalance }) => {
    const [depositAmount, setDepositAmount] = useState(0);
    const [depositPrice, setDepositPrice] = useState(0);

    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [withdrawPrice, setWithdrawPrice] = useState(0);
    const navigate = useNavigate();

    const deposit = async (amount) => {
        await contract.methods.deposit()
            .send({ from: account, value: amount * 10 ** 18 });
        getBalance();
    };

    const withdraw = async (amount) => {
        const amountStr = (amount * 10 ** 18).toString();
        await contract.methods.withdraw(amountStr)
            .send({ from: account });
        getBalance();
    };

    const onBuy = (e) => {
        e.preventDefault();
        deposit(depositAmount * depositPrice);
        navigate('/wallet');
    }

    const onSell = (e) => {
        e.preventDefault();
        withdraw(withdrawAmount * withdrawPrice);
        navigate('/wallet');
    }

    return (
        <div id="trade">
            <div id="trade-child">
                <h2>Buy berkcoin</h2>
                <p style={{ marginLeft: "25%" }}>ETH Balance: {ethBalance}</p>
                <form id="newOrder" onSubmit={onBuy}>
                    <label>Amount: </label>
                    <input type="number" required
                        value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                    <label>Price: </label>
                    <input type="number" required
                        value={depositPrice} onChange={(e) => setDepositPrice(e.target.value)} />
                    <button style={{ display: "inline-block", marginLeft: "39%" }}>Buy berkcoin</button>
                </form>
            </div>
            <div id="trade-child">
                <h2>Sell berkcoin</h2>
                <p style={{ marginLeft: "25%" }}>Berkcoin balance: {balance}</p>
                <form id="newOrder" onSubmit={onSell}>
                    <label>Amount: </label>
                    <input type="number" required
                        value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
                    <label>Price: </label>
                    <input type="number" required
                        value={withdrawPrice} onChange={(e) => setWithdrawPrice(e.target.value)} />
                    <button style={{ display: "inline-block", marginLeft: "39%" }}>Sell berkcoin</button>
                </form>
            </div>
        </div>
    )
}

export default Trade