import assert from "node:assert/strict";
import { describe,it } from "node:test";
import { network } from "hardhat";
import { getAddress } from "viem";

describe("Whitelist contract",async ()=>{
    const {viem}=await network.connect();
    const [owner,otherAccount,thirdAccount]=await viem.getWalletClients();

    it("The owner is the deployer",async ()=>{
        const whitelist=await viem.deployContract("Whitelist");
        const contractOwner=await whitelist.read.owner();
        assert.equal(contractOwner.toLocaleLowerCase(),owner.account.address,"Owner is not the deployer");
    });

    it("Only owner should be able to add to Whitelist",async ()=>{
        const whitelist=await viem.deployContract("Whitelist");
        const whitelistAsOther=await viem.getContractAt(
            "Whitelist",
            whitelist.address,
            {client:{wallet:otherAccount}}

        );
        await assert.rejects(
            whitelistAsOther.write.addToWhitelist([thirdAccount.account.address]),
            (err:Error)=>err.message.includes("Only owner can add to Whitelist"),
            "Function call should have been reverted"
        );
    });
    it("Should emit an AddressWhitelisted event",async ()=>{
        const whitelist=await viem.deployContract("Whitelist");

        await viem.assertions.emitWithArgs(
            whitelist.write.addToWhitelist([otherAccount.account.address]),
            whitelist,
            "AddressWhitelisted",
            [getAddress(otherAccount.account.address)]
        );
    });
    it("addNums function, owner should be able to add to nums array",async ()=>{
        const whitelist=await viem.deployContract("Whitelist");

        await whitelist.write.addToWhitelist([thirdAccount.account.address]);
        const isListed= await whitelist.read.isWhitelisted([thirdAccount.account.address]);

        assert.equal(
             isListed,
             true,
             "Owner could not add the user to isWhitelisted"   
        );
        
    });
    it("Should revert if trying to add already whitelisted user address",async ()=>{
        const whitelist=await viem.deployContract("Whitelist");

        await whitelist.write.addToWhitelist([otherAccount.account.address]);

        await assert.rejects(
            whitelist.write.addToWhitelist([otherAccount.account.address]),
            (err:Error)=>err.message.includes("User is already Whitelisted"),
            "Unable to revert adding already whitelisted user address"
        );
    });



});
