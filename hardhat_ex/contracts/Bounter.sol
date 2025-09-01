// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Bounter {
    uint public x = 100;

    event Increment(uint by);
    event Decrement(uint by);

    function inc() public {
        x++;
        emit Increment(1);
    }

    function dec() public {
        x--;
        emit Decrement(1);
    }

    function incBy(uint by) public {
        require(by > 0, "incBy: increment should be positive");
        x += by;
        emit Increment(by);
    }

    function decBy(uint by) public {
        require(by > 0, "decBy: decrement should be positive");
        x -= by;
        emit Decrement(by);
    }
}
