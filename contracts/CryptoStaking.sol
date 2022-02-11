// SPDX-License-Identifier: MIT

// ETH stake provider contract; peers can stake their funds to gain rewards.

pragma solidity ^0.8.0;

contract CryptoStaking {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public accountStakeDates;
    mapping(address => uint256) public accountStakeAmounts;
    mapping(address => uint256) public latestStakeRewards;

    // Stake reward rate
    uint256 constant interest = 3;

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
        latestStakeRewards[msg.sender] =
            (((amountToBeStaked * duration) / (24 * 60 * 60)) * interest) /
            300;
        accountStakeAmounts[msg.sender] += latestStakeRewards[msg.sender];

        emit Stake(msg.sender, amountToBeStaked, duration);
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

    function checkStakeStatus() public {
        uint256 stakeTimeStamp = accountStakeDates[msg.sender];

        if (stakeTimeStamp <= block.timestamp) {
            handleCompletedStake();
            emit StakeCompleted(msg.sender);
        } else {
            emit StakeIsActive(msg.sender, accountStakeDates[msg.sender]);
        }
    }

    // If account's stake duration is over, then we set stake parameters as 0
    // after adding up the staked amount to the current balance.

    function handleCompletedStake() private {
        balances[msg.sender] += accountStakeAmounts[msg.sender];
        accountStakeDates[msg.sender] = 0;
        accountStakeAmounts[msg.sender] = 0;
        latestStakeRewards[msg.sender] = 0;
    }

    function getBalance(address publicAddress) public view returns (uint256) {
        return balances[publicAddress];
    }

    event Deposit(address from, uint256 amount);

    event Withdraw(address from, uint256 amount);

    event Stake(address from, uint256 amount, uint256 duration);

    event StakeCompleted(address from);

    event StakeIsActive(address from, uint256 duration);
}
