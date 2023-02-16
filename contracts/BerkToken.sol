// SPDX-License-Identifier: MIT

// I implemented a token for this project that allows users
// trade, stake and transfer operations.
// I also injected CollectibleToken contract and wrote some wrapped
// functions to use NFT functionalities with this contract

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IBerkToken.sol";
import "./CollectibleToken.sol";
import "./Social.sol";

contract BerkToken is IBerkToken, ERC20 {
    address public owner;

    //mapping(address => uint256) public _balances;
    mapping(address => uint256) public accountStakeDates;
    mapping(address => uint256) public accountStakeAmounts;
    mapping(address => uint256) public latestStakeRewards;

    // Stake reward rate
    uint256 private constant interest = 2;
    uint256 private constant minimumTokenValue = 1000000000000;
    // 10**18 means 18 decimal points.
    // 1 berkcoin = 1 * 10**18.
    uint256 private maxSupply = 100000000 * 10**18;

    CollectibleToken private collectibleToken;
    uint256 public collectibleFee;

    Social private social;

    constructor() ERC20("berkcoin", "BERK") {
        owner = msg.sender;
        collectibleToken = new CollectibleToken();
        collectibleFee = collectibleToken.getTransactionFee();
        social = new Social();
        // Minting initial tokens
        _mint(msg.sender, maxSupply);
    }

    function mint(address account, uint256 amount) external {
        require(
            msg.sender == owner,
            "Only contract owner can mint new tokens!"
        );
        _mint(account, amount * 10**18);
        maxSupply += amount * 10**18;
    }

    function burnTokens(uint256 amount) external {
        _burn(msg.sender, amount * 10**18);
    }

    /*
     * Transaction is processed within contract:
     * From: 0x23bc92ca3d8dd080dd65914e40bad5a5bec93769 : owner
     * to:  0xd2d656253b91c5915cafdcd8b3a5249950739e10 : receiver
     */

    function send(address receiver, uint256 amount) external {
        _transfer(msg.sender, receiver, amount * 10**18);
        emit Sent(msg.sender, receiver, amount * 10**18);
    }

    function deposit(uint256 amount) external payable {
        require(msg.value >= 1, "Deposit amount must be at least 1 wei!");

        uint256 tokenPrice = getTokenPrice();

        // Here we get token amount based on the deposited ETH amount:
        // If user deposit 1 ETH and current token price is 0.2 ETH, then
        // user will have 5 tokens in his account address.
        // In this case, user must deposit at least 1 ETH.
        // If user deposits more than 1 ETH, contract will not
        // compansate the additional number of ETH.

        require(
            msg.value >= (amount * tokenPrice),
            "Deposit amount worth must be at least 1 berkcoin!"
        );

        _transfer(owner, msg.sender, amount * 10**18);
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(
            balanceOf(msg.sender) >= amount * 10**18,
            "You don't have enough funds in your bank account!"
        );

        uint256 tokenPrice = getTokenPrice();

        payable(msg.sender).transfer(amount * tokenPrice);
        _transfer(msg.sender, owner, amount * 10**18);

        emit Withdraw(msg.sender, amount);
    }

    // duration -> seconds
    function stake(uint256 duration, uint256 amountToBeStaked) external {
        amountToBeStaked *= 10**18;
        require(
            balanceOf(msg.sender) >= amountToBeStaked,
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
        //_balances[msg.sender] -= amountToBeStaked;
        _transfer(msg.sender, owner, amountToBeStaked);

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
        return (amountToBeStaked * stakeRate) / 1000000000;
    }

    function checkStakeStatus(address publicAddress, uint256 currentTimeStamp)
        external
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
        _transfer(owner, publicAddress, accountStakeAmounts[publicAddress]);
        accountStakeDates[publicAddress] = 0;
        accountStakeAmounts[publicAddress] = 0;
        latestStakeRewards[publicAddress] = 0;
    }

    function getBalance(address publicAddress) external view returns (uint256) {
        return balanceOf(publicAddress) / 10**18;
    }

    function getStakeAmount(address publicAddress)
        external
        view
        returns (uint256)
    {
        return accountStakeAmounts[publicAddress] / 10**18;
    }

    function getCurrentStakeReward(address publicAddress)
        external
        view
        returns (uint256)
    {
        return latestStakeRewards[publicAddress] / 10**18;
    }

    function getStakeCompletionDate(address publicAddress)
        external
        view
        returns (uint256)
    {
        return accountStakeDates[publicAddress];
    }

    function getInterest() external pure returns (uint256) {
        return interest;
    }

    function getTokenPrice() public view returns (uint256) {
        uint256 contractBalance = getContractBalance();
        uint256 tokenPrice = contractBalance / maxSupply;

        // If it is the first transaction on this smart contract,
        // token price will be 0. To prevent multiply error, we
        // assing token price with the lowest possible value 1.

        // @var tokenPrice: minimum value of token
        if (tokenPrice < minimumTokenValue) {
            tokenPrice = minimumTokenValue;
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
        uint256 price,
        bool isAvailableToTrade
    ) external {
        collectibleToken.createNewCollectible(
            tokenUri,
            description,
            price * 10**18,
            msg.sender,
            isAvailableToTrade
        );
        require(
            balanceOf(msg.sender) >= collectibleFee,
            "Sender doesn't have enough funds to pay registration fee!"
        );
        //_balances[msg.sender] -= collectibleFee;
        _transfer(msg.sender, owner, collectibleFee);
    }

    function burnCollectible(uint256 tokenID) external {
        collectibleToken.burnCollectible(tokenID, msg.sender);
    }

    function setPriceOfCollectible(uint256 tokenID, uint256 price) external {
        require(
            balanceOf(msg.sender) >= collectibleFee / 10,
            "Sender doesn't have enough funds to pay registration fee!"
        );
        _transfer(msg.sender, owner, collectibleFee / 10);
        collectibleToken.setPriceOfCollectible(
            msg.sender,
            tokenID,
            price * 10**18
        );
    }

    function setAvailabilityOfCollectible(uint256 tokenID, bool availability)
        external
    {
        collectibleToken.setAvailabilityOfCollectible(
            msg.sender,
            tokenID,
            availability
        );
    }

    function buyCollectible(uint256 tokenID) external {
        uint256 price = collectibleToken.getPriceOfCollectible(tokenID);
        require(
            getAvailabilityOfToken(tokenID) == true,
            "Token is not available for trade!"
        );
        require(
            price <= balanceOf(msg.sender),
            "Sender doesn't have enough funds!"
        );

        address collectibleOwner = collectibleToken.getTokenOwner(tokenID);
        _transfer(msg.sender, collectibleOwner, price);
        collectibleToken.transferCollectible(msg.sender, tokenID);
    }

    function getTokenURI(uint256 tokenID)
        external
        view
        returns (string memory)
    {
        return collectibleToken.getTokenURI(tokenID);
    }

    function getTokenCreator(uint256 tokenID) external view returns (address) {
        return collectibleToken.getTokenCreator(tokenID);
    }

    function getTokenOwner(uint256 tokenID) external view returns (address) {
        return collectibleToken.getTokenOwner(tokenID);
    }

    function getTokenDescription(uint256 tokenID)
        external
        view
        returns (string memory)
    {
        return collectibleToken.getTokenDescription(tokenID);
    }

    function getTokenHash(uint256 tokenID) external view returns (bytes32) {
        return collectibleToken.getTokenHash(tokenID);
    }

    function getPriceOfCollectible(uint256 tokenID)
        external
        view
        returns (uint256)
    {
        return collectibleToken.getPriceOfCollectible(tokenID) / 10**18;
    }

    function getAvailabilityOfToken(uint256 tokenID)
        public
        view
        returns (bool)
    {
        return collectibleToken.getAvailabilityOfToken(tokenID);
    }

    function getCollectibleFee() public view returns (uint256) {
        return collectibleFee / 10**18;
    }

    function getTokenCount() external view returns (uint256) {
        return collectibleToken.getTokenCount();
    }

    function getAccessibility(uint256 tokenID) external view returns (bool) {
        return collectibleToken.getAccessibility(tokenID);
    }

    // Social handlers:
    function sendPost(string memory title, string memory text) external {
        social.sendPost(title, text);
    }

    function burnPost(uint256 postID) external {
        social.burnPost(postID);
    }

    function votePost(uint256 postID, int256 vote) external {
        social.votePost(postID, vote);
    }

    function getPostAuthor(uint256 postID) external view returns (address) {
        return social.getPostAuthor(postID);
    }

    function getPostTitle(uint256 postID)
        external
        view
        returns (string memory)
    {
        return social.getPostTitle(postID);
    }

    function getPostText(uint256 postID) external view returns (string memory) {
        return social.getPostText(postID);
    }

    function getPostDate(uint256 postID) external view returns (uint256) {
        return social.getPostDate(postID);
    }

    function getPostUpvotes(uint256 postID) external view returns (int256) {
        return social.getPostUpvotes(postID);
    }

    function getPostCount() external view returns (uint256) {
        return social.getPostCount();
    }

    event Sent(address from, address to, uint256 amount);

    event Deposit(address from, uint256 amount);

    event Withdraw(address from, uint256 amount);

    event Stake(address from, uint256 amount, uint256 duration);

    event StakeCompleted(address from);

    event StakeIsActive(address from, uint256 duration);
}
