// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// For this project, I can merge my previous two smart contracts into one contract
// or i can use the same layout ( Stakers can provide services in a different node.)
// So, users can buy (swap) tokens with ETH and stake them via a staker.

contract Token {
    mapping(address => uint256) public balances;
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    // receive() external payable {}

    /*
     * Transaction is processed withing cryptoBank.
     * From: 0x23bc92ca3d8dd080dd65914e40bad5a5bec93769 : owner
     * to:  0xd2d656253b91c5915cafdcd8b3a5249950739e10 : receiver
     */

    function send(address receiver, uint256 amount) public {
        require(
            balances[owner] >= amount,
            "You don't have enough funds to send!"
        );

        balances[msg.sender] -= amount;
        balances[receiver] += amount;

        emit Sent(msg.sender, receiver, amount);
    }

    function getBalance(address publicAddress) public view returns (uint256) {
        return balances[publicAddress];
    }

    // A conversion rate between ETH and banks currency can be included.
    // But for now, I assume bank's currency is in ETH.

    function deposit() public payable {
        require(msg.value > 1, "Deposit amount must be more than 1 wei!");

        uint256 depositedAmount = msg.value / 10**18;
        balances[msg.sender] += depositedAmount;

        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        require(
            balances[msg.sender] >= amount,
            "You don't have enough funds in your bank account!"
        );

        payable(msg.sender).transfer(amount * 10**18);
        balances[msg.sender] -= amount;

        emit Withdraw(msg.sender, amount);
    }

    error InsufficientBalance(uint256 requested, uint256 available);

    event Sent(address from, address to, uint256 amount);

    event Deposit(address from, uint256 amount);

    event Withdraw(address from, uint256 amount);
}
