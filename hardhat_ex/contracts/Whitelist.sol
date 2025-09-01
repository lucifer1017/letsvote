// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

contract Whitelist {
    address public owner;
    mapping(address => bool) public isWhitelisted;

    constructor() {
        owner = msg.sender;
    }

    event AddressWhitelisted(address indexed _user);
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can add to Whitelist");
        _;
    }

    function addToWhitelist(address _user) public onlyOwner {
        require(!isWhitelisted[_user], "User is already Whitelisted");
        isWhitelisted[_user] = true;
        emit AddressWhitelisted(_user);
    }
}
