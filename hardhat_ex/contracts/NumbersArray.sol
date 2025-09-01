// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.28;

contract NumbersArray {
    address public owner;
    uint[] public nums;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Can be accessed by Owner only");
        _;
    }
    event NumberAdded(uint indexed num);

    function addNums(uint num) public onlyOwner {
        nums.push(num);
        emit NumberAdded(num);
    }
}
