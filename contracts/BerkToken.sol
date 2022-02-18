// SPDX-License-Identifier: MIT

// For this project, I can merge my previous two smart contracts into one contract
// or i can use the same layout ( Stakers can provide services in a different node.)
// So, users can buy (swap) tokens with ETH and stake them via a staker.

// ETH stake provider contract; peers can stake their funds to gain rewards.

pragma solidity ^0.8.0;

import "./IToken.sol";
import "./CollectibleToken.sol";

contract BerkToken is IToken {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public accountStakeDates;
    mapping(address => uint256) public accountStakeAmounts;
    mapping(address => uint256) public latestStakeRewards;

    // Stake reward rate
    uint256 private constant interest = 5;
    uint256 private constant maxSupply = 1000000000;

    CollectibleToken private collectibleToken;
    uint256 public collectibleFee;

    constructor() {
        collectibleToken = new CollectibleToken();
        collectibleFee = collectibleToken.getTransactionFee();
    }

    /*
     * Transaction is processed within contract:
     * From: 0x23bc92ca3d8dd080dd65914e40bad5a5bec93769 : owner
     * to:  0xd2d656253b91c5915cafdcd8b3a5249950739e10 : receiver
     */

    function send(address receiver, uint256 amount) public {
        require(
            balances[msg.sender] >= amount,
            "You don't have enough funds to send!"
        );

        balances[msg.sender] -= amount;
        balances[receiver] += amount;

        emit Sent(msg.sender, receiver, amount);
    }

    // duration -> seconds
    function stake(uint256 duration, uint256 amountToBeStaked) public {
        require(
            balances[msg.sender] >= amountToBeStaked,
            "You have insufficient funds to stake!"
        );

        require(
            accountStakeDates[msg.sender] == 0,
            "This account has already established a stake process!"
        );

        require(duration > 0, "Duration should be a positive value!");

        // Stake amounts of accounts:
        accountStakeAmounts[msg.sender] = amountToBeStaked;

        // Take out the staked amount from the user balance.
        balances[msg.sender] -= amountToBeStaked;

        // Timestamp for stake duration.
        accountStakeDates[msg.sender] = block.timestamp + duration;

        // Stake reward
        latestStakeRewards[msg.sender] = calculateStakeReward(
            amountToBeStaked,
            duration
        );

        accountStakeAmounts[msg.sender] += latestStakeRewards[msg.sender];

        emit Stake(msg.sender, amountToBeStaked, duration);
    }

    function calculateStakeReward(uint256 amountToBeStaked, uint256 duration)
        private
        pure
        returns (uint256)
    {
        uint256 stakeRate = interest;
        stakeRate = stakeRate * duration;

        // More than 100 ETH:
        if (amountToBeStaked > 100) {
            stakeRate = stakeRate * 2;
        }
        return stakeRate / 10000;
    }

    function deposit(uint256 amount) public payable {
        require(msg.value > 1, "Deposit amount must be more than 1 wei!");

        uint256 tokenPrice = getTokenPrice();

        require(
            msg.value >= amount * tokenPrice,
            "Deposit amount worth must be at least 1 berkcoin!"
        );

        // Here we get token amount based on the deposited ETH amount:
        // If user deposit 1 ETH and current token price is 0.2 ETH, then
        // user will have 5 tokens in his account address.

        // uint256 depositedAmount = msg.value;
        // balances[msg.sender] += depositedAmount / tokenPrice;
        balances[msg.sender] += amount;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        require(
            balances[msg.sender] >= amount,
            "You don't have enough funds in your bank account!"
        );

        uint256 tokenPrice = getTokenPrice();

        payable(msg.sender).transfer(amount * tokenPrice);
        balances[msg.sender] -= amount;

        emit Withdraw(msg.sender, amount);
    }

    function checkStakeStatus(address publicAddress, uint256 currentTimeStamp)
        public
    {
        uint256 stakeTimeStamp = accountStakeDates[publicAddress];
        require(
            stakeTimeStamp <= currentTimeStamp,
            "Stake duration has not been ended yet!"
        );

        handleCompletedStake(publicAddress);
        emit StakeCompleted(publicAddress);
    }

    // If account's stake duration is over, then we set stake parameters as 0
    // after adding up the staked amount to the current balance.

    function handleCompletedStake(address publicAddress) private {
        balances[publicAddress] += accountStakeAmounts[publicAddress];
        accountStakeDates[publicAddress] = 0;
        accountStakeAmounts[publicAddress] = 0;
        latestStakeRewards[publicAddress] = 0;
    }

    function getBalance(address publicAddress) public view returns (uint256) {
        return balances[publicAddress];
    }

    function getStakeAmount(address publicAddress)
        public
        view
        returns (uint256)
    {
        return accountStakeAmounts[publicAddress];
    }

    function getCurrentStakeReward(address publicAddress)
        public
        view
        returns (uint256)
    {
        return latestStakeRewards[publicAddress];
    }

    function getStakeCompletionDate(address publicAddress)
        public
        view
        returns (uint256)
    {
        return accountStakeDates[publicAddress];
    }

    function getInterest() public pure returns (uint256) {
        return interest;
    }

    function getTokenPrice() public view returns (uint256) {
        uint256 contractBalance = getContractBalance();
        uint256 tokenPrice = contractBalance / maxSupply;

        // If it is the first transaction on this smart contract,
        // token price will be 0. To prevent multiply error, we
        // assing token price with the lowest possible value 1.

        if (tokenPrice == 0) {
            tokenPrice = 10000000;
        }
        return tokenPrice;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // NFT Handlers:

    function registerNewCollectible(
        string memory tokenUri,
        string memory description,
        uint256 price
    ) public {
        collectibleToken.createNewCollectible(
            tokenUri,
            description,
            price,
            msg.sender
        );
        require(
            balances[msg.sender] >= price / collectibleFee,
            "Sender doesn't have enough funds to pay registration fee!"
        );
        balances[msg.sender] -= price / collectibleFee;
    }

    function setPriceOfCollectible(uint256 tokenID, uint256 price) public {
        collectibleToken.setPriceOfCollectible(msg.sender, tokenID, price);
    }

    function buyCollectible(uint256 tokenID) public {
        uint256 price = collectibleToken.getPriceOfCollectible(tokenID);
        require(
            price <= balances[msg.sender],
            "Sender doesn't have enough funds!"
        );

        address collectibleOwner = collectibleToken.getTokenOwner(tokenID);
        balances[collectibleOwner] += price;
        balances[msg.sender] -= price;
        collectibleToken.transferCollectible(msg.sender, tokenID);
    }

    function getTokenURI(uint256 tokenID) public view returns (string memory) {
        return collectibleToken.getTokenURI(tokenID);
    }

    function getTokenCreator(uint256 tokenID) public view returns (address) {
        return collectibleToken.getTokenCreator(tokenID);
    }

    function getTokenOwner(uint256 tokenID) public view returns (address) {
        return collectibleToken.getTokenOwner(tokenID);
    }

    function getTokenDescription(uint256 tokenID)
        public
        view
        returns (string memory)
    {
        return collectibleToken.getTokenDescription(tokenID);
    }

    function getTokenHash(uint256 tokenID) public view returns (bytes32) {
        return collectibleToken.getTokenHash(tokenID);
    }

    function getPriceOfCollectible(uint256 tokenID)
        public
        view
        returns (uint256)
    {
        return collectibleToken.getPriceOfCollectible(tokenID);
    }

    function getCollectibleFee() public view returns (uint256) {
        return collectibleFee;
    }

    function getTokenCount() public view returns (uint256) {
        return collectibleToken.getTokenCount();
    }

    event Sent(address from, address to, uint256 amount);

    event Deposit(address from, uint256 amount);

    event Withdraw(address from, uint256 amount);

    event Stake(address from, uint256 amount, uint256 duration);

    event StakeCompleted(address from);

    event StakeIsActive(address from, uint256 duration);
}
