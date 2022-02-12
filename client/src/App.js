import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"

import getWeb3 from "./services/getWeb3";

import CryptoStaking from "./contracts/TokenWithStaking";


import Nav from "./components/Nav";
import Wallet from "./components/Wallet";
import Market from "./components/Market";
import Trade from "./components/Trade";
import Staking from "./components/Staking";
import { Footer } from './components/Footer';

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
      const deployedNetwork = CryptoStaking.networks[networkId];
      const instance = new web3.eth.Contract(
        CryptoStaking.abi,
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
    setBalance(response / 10 ** 18);
    const ethBalance = await web3.eth.getBalance(accounts[0]);
    setEthBalance(web3.utils.fromWei(ethBalance, 'ether'));
  };


  if (web3 === undefined || accounts === undefined || contract === undefined) {
    return (
      <div>
        <Footer
          account={undefined}
          connect={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <Router>
      <Footer
        account={accounts[0]}
      />
      <Nav />
      <Routes>
        <Route path='/' element={<Navigate to={"/wallet"} />} />

        <Route path='/wallet' element={<Wallet
          web3={web3}
          account={accounts[0]}
          balance={balance} />} />

        <Route path='/market' element={<Market
          orders={undefined} />} />

        <Route path='/trade' element={<Trade
          account={accounts[0]}
          contract={contract}
          balance={balance}
          ethBalance={ethBalance}
          getBalance={getBalance} />} />

        <Route path='/staking' element={<Staking
          account={accounts[0]}
          contract={contract}
          balance={balance} />} />
      </Routes>
      -
    </Router>
  );
}

export default App;
