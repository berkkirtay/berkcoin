import React, { useEffect, useState } from 'react';
import LoadingTriangle from '../PageComponents/LoadingTriangle';
import { findUserCollectible, getTransactions } from '../../services/ContractHelper';

const Wallet = ({ web3, contract, account, balance }) => {
    // API URI can be changed based on the network where token was deployed.
    const apiURI = "http://ropsten.etherscan.io/tx/";

    const [transactions, setTransactions] = useState([]);
    const [userCollectible, setUserCollectible] = useState(undefined);

    useEffect(() => {
        const retrieveUserCollectible = async () => {
            const retrievedCollectible = await findUserCollectible(account, contract);
            setUserCollectible(retrievedCollectible);
        }

        const retrieveTransactions = async () => {
            const retrievedTransactions = await getTransactions(account, contract, web3);
            setTransactions(retrievedTransactions);
        }

        retrieveUserCollectible();
        retrieveTransactions();

    }, [account, contract, web3])

    const userProfileCollectibleStyle = {
        display: "flex",
        backgroundColor: "#00BFFF",
        width: "150px",
        height: "150px",
        borderRadius: "4%",
        float: "left",
        cursor: "pointer",
        margin: "1%"
    }

    const userInfoStyle = {
        float: "left",
        margin: "1%"
    }

    return (
        <div>
            <div style={{ display: "flex" }}>
                <div>
                    {userCollectible !== undefined ?
                        (
                            <img alt="pfp" src={userCollectible.tokenURI} style={userProfileCollectibleStyle} >
                            </img>
                        )
                        :
                        (
                            <LoadingTriangle />
                        )
                    }
                </div>
                <div style={userInfoStyle}>
                    <h3>Welcome back! {account}
                    </h3>
                    <h3>Your Balance: {balance} {balance !== 0 && "berkcoins"}</h3>
                    <h3>Your Latest Transactions:</h3>
                </div>
            </div>

            {!(transactions.length === 0 || userCollectible === undefined) ?
                (
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
                                        <a style={{ color: "#0948cf" }}
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
                )
                :
                (
                    <LoadingTriangle />
                )
            }
        </div >
    )
}

export default Wallet