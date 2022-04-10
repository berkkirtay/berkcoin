# Berkcoin Decentralized App 
[![Node.js CI](https://github.com/berkkirtay/berkcoin/actions/workflows/berkcoin_tests.yml/badge.svg)](https://github.com/berkkirtay/berkcoin/actions/workflows/berkcoin_tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Berkcoin is an interactive token environment that allows users to trade and stake their tokens along with NFT features.
It uses ERC20 token standard with its own features. Contracts are deployed with truffle framework.
This project aims to be a basic token environment with standard features. 
To ensure integrity and functionality of contracts I included unit tests and CI.**

**Website is deployed on ropsten testnet at: [berkkirtay.github.io/berkcoin](https://berkkirtay.github.io/berkcoin)**

## Basic usage:
Any wallet provider can be used via getWeb3 function.

### Requirements:
- Metamask for transactions
- Any Ethereum testnet (preferably you can use ganache or ropsten testnet)
- Truffle (to compile contracts and migrate)

### Compiling the Contracts:
1. Set related fields in truffle-config.js and migrations folder
2. On command line: truffle compile && truffle migrate
3. To migrate on a testnet or mainnet use: truffle migrate --network {name of testnet}

- Run app:
cd client && npm run start

## Screenshots of Client:

### Token Staking: 

![Enc1](https://raw.githubusercontent.com/berkkirtay/berkcoin/main/examples/Staking.PNG)

### Token Trade: 

![Enc1](https://raw.githubusercontent.com/berkkirtay/berkcoin/main/examples/Trade.PNG)

### NFT Marketplace: 

![Enc1](https://raw.githubusercontent.com/berkkirtay/berkcoin/main/examples/NFTMarketplace.PNG)

### Collectible Info: 

![Enc1](https://raw.githubusercontent.com/berkkirtay/berkcoin/main/examples/CollectibleInfo.PNG)
