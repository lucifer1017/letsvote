// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

contract CrowdSale {
    address public owner;
    uint public tokenPrice;
    mapping(address => uint) public contributions;

    event TokensPurchased(
        address indexed purchaser,
        uint amountPaid,
        uint tokensBought
    );

    constructor(uint _initialPrice) {
        owner = msg.sender;
        tokenPrice = _initialPrice;
    }

    function buyTokens() external payable {
        _prepurchaseCheck(msg.value);
        uint tokensToBuy = msg.value / tokenPrice;
        contributions[msg.sender] += msg.value;
        emit TokensPurchased(msg.sender, msg.value, tokensToBuy);
    }

    function _prepurchaseCheck(uint _value) internal view {
        require(_value > 0, "You must send some ether to buy tokens");
        require(
            _value % tokenPrice == 0,
            "Ether sent must be a multiple of token price"
        );
    }

    function calculateBonus(uint _amount) external pure returns (uint) {
        return _amount / 10;
    }
}
