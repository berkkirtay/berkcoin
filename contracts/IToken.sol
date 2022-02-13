// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IToken {
    function send(address receiver, uint256 amount) external;

    function deposit(uint256 amount) external payable;

    function withdraw(uint256 amount) external;

    function getBalance(address externalAddress)
        external
        view
        returns (uint256);

    function getTokenPrice() external view returns (uint256);

    function stake(uint256 duration, uint256 amountToBeStaked) external;
}
