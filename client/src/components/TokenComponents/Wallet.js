import React, { useEffect, useState } from 'react';
import LoadingTriangle from '../PageComponents/LoadingTriangle';

const Wallet = ({ web3, account, balance }) => {
    const [transactions, setTransactions] = useState(undefined);
    useEffect(() => {
        const retrieveTransactions = async () => {
            const transactions = [];
            const latestBlockIndex = await web3.eth.getBlockNumber();
            for (var i = 0; i < 5; i++) {
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
    return (
        <div>
            <h3>Wallet Public Address: {account}</h3>
            <h3>Wallet Balance: {balance}</h3>
            <h3>Your Latest Transactions:</h3>
            {transactions === undefined &&
                <LoadingTriangle />
            }
            <ul style={{ listStyleType: "none" }}>
                {transactions !== undefined && transactions.slice(0).map((transaction) => (
                    <li key={transaction.hash} style={{ width: "80%", border: "1px solid black", display: "inline-block", boxSizing: "border-box" }}>
                        <p><span style={{ marginLeft: "3%" }}>Hash: {transaction.hash}</span><span style={{ float: "right", color: "green", marginRight: "3%" }}>Value: {transaction.value / (10 ** 18)}</span></p>
                    </li>
                ))}
            </ul>
        </div >
    )
}

export default Wallet