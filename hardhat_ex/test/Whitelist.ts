import assert from "node:assert/strict";
import { describe,it } from "node:test";
import { network } from "hardhat";

describe("Whitelist contract",async ()=>{
    const {viem}=await network.connect();
    const [owner,otherAccount,thirdAccount]=await viem.getWalletClients();

    it("The owner is the deployer",async ()=>{
        const whitelist=await viem.deployContract("Whitelist");
        const contractOwner=await whitelist.read.owner();
        assert.equal(owner.account.address,contractOwner.toLocaleLowerCase());
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

    

});
