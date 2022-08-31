import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from "react"
import { BigNumber } from "bignumber.js"

const Trade = ({ account, contract, balance, ethBalance, getBalance }) => {
    const [depositAmount, setDepositAmount] = useState(0);
    const [depositPrice, setDepositPrice] = useState(0);
    const [userPrice, setUserPrice] = useState(0);

    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [withdrawPrice, setWithdrawPrice] = useState(0);

    const [transferAmount, setTransferAmount] = useState(0);
    const [transferAddress, setTransferAddress] = useState("0x..");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentTokenPrice = async () => {
            const response = await contract.methods.getTokenPrice()
                .call({ from: account });
            setDepositPrice(response);
            setUserPrice(response / 10 ** 18)
            setWithdrawPrice(response);
        }

        fetchCurrentTokenPrice();
    }, [account, contract.methods]);

    const deposit = async () => {
        let normalizedUserPrice = new BigNumber(userPrice).multipliedBy(10 ** 18).toFixed();
        let finalPrice = normalizedUserPrice > depositPrice ? normalizedUserPrice : depositPrice;
        await contract.methods.deposit(depositAmount)
            .send({ from: account, value: depositAmount * finalPrice });
        getBalance();
    };

    const withdraw = async () => {
        await contract.methods.withdraw(withdrawAmount)
            .send({ from: account });
        getBalance();
    };

    const transfer = async () => {
        await contract.methods.send(transferAddress, transferAmount)
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


    const onTransfer = (e) => {
        e.preventDefault();
        transfer();
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
                        value={userPrice} onChange={(e) => setUserPrice(e.target.value)} />
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
                    <input type="number" required defaultValue={withdrawPrice / 10 ** 18} />
                    {withdrawAmount !== 0 && <h3 style={{ color: "green", textAlign: "center" }}>You will get {withdrawAmount * withdrawPrice / 10 ** 18} ETH</h3>}
                    <button style={{ display: "inline-block", marginLeft: "39%" }}>Sell berkcoin</button>
                </form>
            </div>
            <div >
                <h2>Send berkcoin</h2>
                <form id="newOrder" onSubmit={onTransfer}>
                    <label>Amount: </label>
                    <input type="number" required
                        value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
                    <label>Recipient wallet address:</label>
                    <input type="text" required
                        value={transferAddress} onChange={(e) => setTransferAddress(e.target.value)} />
                    <button style={{ display: "inline-block", marginLeft: "39%" }}>Send berkcoin</button>
                </form>
            </div>
        </div >
    )
}

export default Trade