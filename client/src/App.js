import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"

import getWeb3 from "./getWeb3";
import Token from "./contracts/Token.json"
import CryptoStaking from "./contracts/CryptoStaking.json";


import Nav from "./components/Nav";
import Wallet from "./components/Wallet";
import Market from "./components/Market";
import Trade from "./components/Trade";
import Staking from "./components/Staking";

function App() {
  // Rewriting truffle generated code for react hooks:
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [balance, setBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);

  useEffect(() => {
    componentDidMount();
  }, [])

  useEffect(() => {
    if (web3 !== undefined && accounts !== undefined && contract !== undefined) {
      getBalance();
    }
  }, [web3, accounts, contract])

  const componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Token.networks[networkId];
      const instance = new web3.eth.Contract(
        Token.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setWeb3(web3);
      setAccounts(accounts);
      setContract(instance);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  const getBalance = async () => {
    const response = await contract.methods.getBalance(accounts[0])
      .call({ from: accounts[0] });
    setBalance(response);
    const ethBalance = await web3.eth.getBalance(accounts[0]);
    setEthBalance(web3.utils.fromWei(ethBalance, 'ether'));
  };

  const deposit = async (amount) => {
    await contract.methods.deposit()
      .send({ from: accounts[0], value: amount * 10 ** 18 });
    getBalance();
  };

  const withdraw = async (amount) => {
    await contract.methods.withdraw(amount)
      .send({ from: accounts[0] });
    getBalance();
  };


  if (web3 === undefined || accounts === undefined || contract === undefined) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <Router>
      <Nav />
      <Routes>
        <Route path='/' element={<Navigate to={"/wallet"} />} />
        <Route path='/wallet' element={<Wallet web3={web3} account={accounts[0]} balance={balance} />} />
        <Route path='/market' element={<Market orders={undefined} />} />
        <Route path='/trade' element={<Trade deposit={deposit} withdraw={withdraw} balance={balance} ethBalance={ethBalance} />} />
        <Route path='/staking' element={<Staking account={accounts[0]} />} />
      </Routes>
    </Router>
  );
}

export default App;
