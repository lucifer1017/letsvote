import assert from "node:assert/strict";
import { describe,it } from "node:test";
import {network} from 'hardhat';
import { getAddress } from "viem";

describe("MessageBoard contract",async ()=>{
    const {viem}=await network.connect();
    const [owner,otherAccount]=await viem.getWalletClients();
    const INITIAL_MESSAGE="Hello world";
    it("Should set the deployer as owner and set the initial message",async ()=>{
        const messageBoard=await viem.deployContract("MessageBoard",[INITIAL_MESSAGE]);

        const contractOwner=await messageBoard.read.owner();
        assert.equal(contractOwner,getAddress(owner.account.address),"Deployer is not the owner");
        const initialMessage=await messageBoard.read.message();
        assert.equal(initialMessage,INITIAL_MESSAGE,"Message not set correctly");

    });

    it("Should emit MessageUpdated event after successfully calling updateMessage",async ()=>{
        const messageBoard=await viem.deployContract("MessageBoard",[INITIAL_MESSAGE]);
        const newMessage="Yellow world";

        await viem.assertions.emitWithArgs(
            messageBoard.write.updateMessage([newMessage]),
            messageBoard,
            "MessageUpdated",
            [getAddress(owner.account.address),newMessage]
        );
    });

    it("Should allow only owner to call the updateMessage fn",async ()=>{
        const messageBoard=await viem.deployContract("MessageBoard",[INITIAL_MESSAGE]);
        const messageBoardOtherUser=await viem.getContractAt(
            "MessageBoard",
            messageBoard.address,
            {client:{wallet:otherAccount}}
        );
        const newMessage="Yellow world";
        await assert.rejects(
            messageBoardOtherUser.write.updateMessage([newMessage]),
            (err:Error)=>err.message.includes("Only the owner can update the message"),
            "Other user is able to update message"
        );
    });

    it("Should update the message when update function is called",async ()=>{
        const messageBoard=await viem.deployContract("MessageBoard",[INITIAL_MESSAGE]);
        const newMessage="Yellow world";
        await messageBoard.write.updateMessage([newMessage]);
        const updatedMessage=await messageBoard.read.message();
        assert.equal(updatedMessage,newMessage,"Unable to update message");
    })

});
