import React, { useEffect, useState } from 'react';
import LoadingTriangle from '../PageComponents/LoadingTriangle';
import abiDecoder from 'abi-decoder';
import BerkToken from '../../contracts/BerkToken.json';

const Wallet = ({ web3, account, balance }) => {
    // API URI can be changed based on the network where token was deployed.
    const apiURI = "http://ropsten.etherscan.io/tx/";
    const contractAddress = "0x4f96994119416199e1276a59b580e070278da3a1";

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        retrieveTransactions();
        return () => {
            setTransactions([]);
        }

    }, [])

    const retrieveTransactions = async () => {
        abiDecoder.addABI(BerkToken.abi);
        const transactions = [];
        // We can easily fetch indexed transactions:
        const pastLogs = await web3.eth.getPastLogs(
            { fromBlock: '0x0', address: contractAddress });
        // Decoding transactions inputs:
        const filteredTransactions = new Set();
        pastLogs.forEach(async (log) => {
            const transaction = await web3.eth.getTransaction(log.transactionHash);
            if (transaction.from === account) {
                const decodedLog = abiDecoder.decodeMethod(transaction.input);
                if (decodedLog !== undefined) {
                    if (filteredTransactions.has(transaction.hash) === false) {
                        filteredTransactions.add(transaction.hash);
                        var value = 0;
                        if (decodedLog.name === "send" || decodedLog.name === "stake") {
                            const params = decodedLog.params;
                            value = params[1].value;
                        }
                        transactions.push({
                            "hash": transaction.hash,
                            "log": decodedLog,
                            "value": value
                        });
                    }
                }
            }
        })
        setTransactions(transactions);
    }

    return (
        <div style={{ margin: "0 auto" }}>
            <h3>User: {account}</h3>
            <h3>User Balance: {balance} {balance !== 0 && "berkcoins"}</h3>
            <h3>Your Latest Transactions:</h3>
            {transactions.length !== 0 &&
                <table className="transactionList">
                    <tbody>
                        <tr>
                            <th >Transaction Hash</th>
                            <th >Transaction Method</th>
                            <th >Berkcoin Value</th>
                        </tr>
                        {transactions.slice(0).map((transaction) => (
                            <tr key={transaction.hash}>
                                <td >
                                    <a style={{ color: "green" }}
                                        href={apiURI + transaction.hash}
                                        target="_blank" rel="noopener noreferrer">
                                        {transaction.hash}
                                        <span>&#x2197;</span>
                                    </a>
                                </td>
                                <td>{transaction.log.name}</td>
                                <td>{transaction.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            {transactions.length === 0 &&
                <LoadingTriangle />
            }
        </div >
    )
}

export default Wallet