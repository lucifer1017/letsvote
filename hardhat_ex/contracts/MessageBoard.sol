// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MessageBoard
 * @dev A simple contract where an owner can post a public message.
 */
contract MessageBoard {
    address public owner;
    string public message;

    /**
     * @dev Sets the initial message and the contract owner.
     */
    constructor(string memory initialMessage) {
        message = initialMessage;
        owner = msg.sender;
    }

    event MessageUpdated(address indexed updater, string newMessage);

    /**
     * @notice Allows the owner to update the message.
     * @dev Reverts if called by any account other than the owner.
     * @param newMessage The new message to be stored.
     */
    function updateMessage(string memory newMessage) public {
        require(msg.sender == owner, "Only the owner can update the message");
        message = newMessage;
        emit MessageUpdated(msg.sender, newMessage);
    }
}
