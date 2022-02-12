// SPDX-License-Identifier: MIT

// For this project, I can merge my previous two smart contracts into one contract
// or i can use the same layout ( Stakers can provide services in a different node.)
// So, users can buy (swap) tokens with ETH and stake them via a staker.

// ETH stake provider contract; peers can stake their funds to gain rewards.

pragma solidity ^0.8.0;

contract TokenWithStaking {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public accountStakeDates;
    mapping(address => uint256) public accountStakeAmounts;
    mapping(address => uint256) public latestStakeRewards;

    // Stake reward rate
    uint256 private constant interest = 1;

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
        view
        returns (uint256)
    {
        uint256 stakeRate = interest;
        // More than one day:
        if (duration > 24 * 60 * 60) {
            stakeRate = stakeRate * 2;
        }
        // More than 100 ETH:
        if (amountToBeStaked > 100) {
            stakeRate = stakeRate * 2;
        }
        uint256 contractBalance = getContractBalance();
        return (stakeRate * contractBalance) / 10000;
    }

    function deposit() public payable {
        require(msg.value > 1, "Deposit amount must be more than 1 wei!");

        uint256 depositedAmount = msg.value;
        balances[msg.sender] += depositedAmount;

        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        require(
            balances[msg.sender] >= amount,
            "You don't have enough funds in your bank account!"
        );

        payable(msg.sender).transfer(amount);
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

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    event Sent(address from, address to, uint256 amount);

    event Deposit(address from, uint256 amount);

    event Withdraw(address from, uint256 amount);

    event Stake(address from, uint256 amount, uint256 duration);

    event StakeCompleted(address from);

    event StakeIsActive(address from, uint256 duration);
}
