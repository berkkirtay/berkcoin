import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useState } from "react"
const Trade = ({ account, contract, balance, ethBalance, getBalance }) => {
    const [depositAmount, setDepositAmount] = useState(0);
    const [depositPrice, setDepositPrice] = useState(0);

    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [withdrawPrice, setWithdrawPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentTokenPrice = async () => {
            const response = await contract.methods.getTokenPrice()
                .call({ from: account });
            setDepositPrice(response);
            setWithdrawPrice(response / 10 ** 18);
        }

        fetchCurrentTokenPrice();
    }, []);

    const deposit = async () => {
        await contract.methods.deposit(depositAmount)
            .send({ from: account, value: (depositAmount * depositPrice) });
        getBalance();
    };

    const withdraw = async () => {
        await contract.methods.withdraw(withdrawAmount)
            .send({ from: account });
        getBalance();
    };

    const onBuy = (e) => {
        e.preventDefault();
        deposit();
        navigate('/wallet');
    }

    const onSell = (e) => {
        e.preventDefault();
        withdraw();
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
                    <label>Current Price: </label>
                    <input type="number" required
                        value={depositPrice / 10 ** 18} onChange={(e) => setDepositPrice(e.target.value * 10 ** 18)} />
                    {depositAmount !== 0 && <h3 style={{ color: "green", textAlign: "center" }}>You will pay {depositAmount * depositPrice / 10 ** 18} ETH</h3>}
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
                    <label>Current Price: </label>
                    <input type="number" required
                        value={withdrawPrice} onChange={(e) => setWithdrawPrice(e.target.value)} />
                    {withdrawAmount !== 0 && <h3 style={{ color: "green", textAlign: "center" }}>You will get {withdrawAmount * withdrawPrice} ETH</h3>}
                    <button style={{ display: "inline-block", marginLeft: "39%" }}>Sell berkcoin</button>
                </form>
            </div>
        </div>
    )
}

export default Trade