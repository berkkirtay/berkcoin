## Berkcoin dApp project with Truffle 
[![Node.js CI](https://github.com/berkkirtay/berkcoin/actions/workflows/berkcoin_tests.yml/badge.svg)](https://github.com/berkkirtay/berkcoin/actions/workflows/berkcoin_tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
#### Website is deployed on ropsten testnet at: [berkkirtay.github.io/berkcoin](https://berkkirtay.github.io/berkcoin)

### Basic usage:
Any network can be used via getWeb3 function.

### Requirements:
- Metamask
- Any Ethereum testnet (preferably you can use ganache)
- Truffle (in order to compile contracts)

### Compiling the Contracts:
1. Set related fields in truffle-config.js and migrations folder
2. On command line: truffle compile && truffle migrate
3. To migrate on a testnet or mainnet use: truffle migrate --network {name of testnet}

- Run app:
cd client && npm run start

## Screenshots of Client:

### Token staking: 

![Enc1](https://raw.githubusercontent.com/berkkirtay/berkcoin/main/examples/Staking.PNG)

### Token Trade: 

![Enc1](https://raw.githubusercontent.com/berkkirtay/berkcoin/main/examples/Trade.PNG)

### NFT Marketplace: 

![Enc1](https://raw.githubusercontent.com/berkkirtay/berkcoin/main/examples/NFTMarketplace.PNG)

### Collectible Info: 

![Enc1](https://raw.githubusercontent.com/berkkirtay/berkcoin/main/examples/CollectibleInfo.PNG)

