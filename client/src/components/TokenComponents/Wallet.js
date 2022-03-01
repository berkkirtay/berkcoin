import React, { useEffect, useState } from 'react';
import LoadingTriangle from '../PageComponents/LoadingTriangle';
import BigNumber from 'bignumber.js';

const Wallet = ({ web3, account, balance }) => {
    // API URI can be changed based on the network where token was deployed.
    const apiURI = "http://ropsten.etherscan.io/tx/";

    const [transactions, setTransactions] = useState(undefined);
    useEffect(() => {
        const retrieveTransactions = async () => {
            const transactions = [];
            const latestBlockIndex = await web3.eth.getBlockNumber();
            for (var i = 0; i < 30; i++) {
                const block = await web3.eth.getBlock(latestBlockIndex - i, true);
                block.transactions.forEach((transaction) => {
                    if (transaction.from === account) {
                        transactions.push(transaction);
                    }
                })
            }
            setTransactions(transactions);
        }
        retrieveTransactions();
    }, [])

    const getValue = (transaction) => {
        //input format: 32-256-256-256
        const input = String(transaction.input);
        const tokens = input.substring(8, input.length);
        return new BigNumber("0x".concat(tokens.substring(128, input.length)), 16).toString(10);
    }
    return (
        <div style={{ margin: "0 auto" }}>
            <h3>User: {account}</h3>
            <h3>User Balance: {balance} {balance !== 0 && "berkcoins"}</h3>
            <h3>Your Latest Transactions:</h3>
            {transactions === undefined &&
                <LoadingTriangle />
            }
            <ul style={{ listStyleType: "none", marginTop: "5%" }}>
                {transactions !== undefined && transactions.slice(0).map((transaction) => (
                    <li key={transaction.hash} style={{ width: "80%", border: "1px solid black", display: "inline-block", boxSizing: "border-box" }}>
                        <p>
                            <span style={{ color: "green", marginLeft: "3%" }}>Tx: <a style={{ color: "green" }} href={apiURI + transaction.hash} target="_blank">{transaction.hash}</a></span>
                            <span style={{ float: "right", color: "green", marginRight: "3%" }}>Berkcoin Value: {getValue(transaction)}</span>
                        </p>
                    </li>
                ))}
            </ul>
        </div >
    )
}

export default Wallet