import assert from "node:assert/strict";
import { describe,it } from "node:test";
import { network } from "hardhat";
import { getAddress, parseEther } from "viem";

describe("CrowdSale Contract",async ()=>{
    const {viem}=await network.connect();
    const [owner,buyer1]=await viem.getWalletClients();
    const _tokenPrice=parseEther('0.01');
    it("Should check if the deployer is the owner, also initial token price is set correctly",async ()=>{
        const crowdSale=await viem.deployContract("CrowdSale",[_tokenPrice]);
        const contractOwner=await crowdSale.read.owner();
        const price=await crowdSale.read.tokenPrice();
        assert.equal(
            contractOwner,
            getAddress(owner.account.address),
            "Deployer is not the owner"
        );
        assert.equal(
            price,_tokenPrice,"Token price not set correctly"
        );

    });
    it("calculateBonus should work as expected",async ()=>{
        const crowdSale=await viem.deployContract("CrowdSale",[_tokenPrice]);
        const bonus1=await crowdSale.read.calculateBonus([50n]);
        const bonus2=await crowdSale.read.calculateBonus([11n]);
        assert.equal(bonus1,5n,"Incorrect Bonus calculated for multiple");
        assert.equal(bonus2,1n,"Incorrect Bonus calculated for non-multiple");
    });

    it("Should allow a user to buy tokens and update their contributions",async ()=>{
        const crowdSale=await viem.deployContract("CrowdSale",[_tokenPrice]);

        const crowdSaleAsBuyer=await viem.getContractAt(
            "CrowdSale",
            crowdSale.address,
            {client:{wallet:buyer1}}

        );
        const purchaseValue=parseEther('0.05');
        await crowdSaleAsBuyer.write.buyTokens({value:purchaseValue});

        const contribution=await crowdSaleAsBuyer.read.contributions([buyer1.account.address]);

        assert.equal(contribution,purchaseValue,"Could not complete buyTokens transaction");
        

    });

    it("Should emit TokensPurchased event with correct arguments",async ()=>{
        const crowdSale=await viem.deployContract("CrowdSale",[_tokenPrice]);
        const crowdSaleAsBuyer=await viem.getContractAt(
            "CrowdSale",
            crowdSale.address,
            {client:{wallet:buyer1}}
        );

        const purchaseValue=parseEther('0.05');
        const tokensBought=purchaseValue/(_tokenPrice) ;

        await viem.assertions.emitWithArgs(
            crowdSaleAsBuyer.write.buyTokens({value:purchaseValue}),
            crowdSaleAsBuyer,
            "TokensPurchased",
            [getAddress(buyer1.account.address),purchaseValue,tokensBought]

        );
    });

    it("Should revert if a user sends 0 Ether or if Ethers sent are not a multiple of tokenPrice",async ()=>{
        const crowdSale=await viem.deployContract("CrowdSale",[_tokenPrice]);
        const crowdSaleAsBuyer=await viem.getContractAt(
            "CrowdSale",
            crowdSale.address,
            {client:{wallet:buyer1}}
        );
        // If a user Sends 0 Ether
        await assert.rejects(
            crowdSaleAsBuyer.write.buyTokens({value:0n}),
            (err:Error)=>err.message.includes("You must send some ether to buy tokens"),
            "Transaction did not fail, value passed:0 Eth"
        );
        const purchaseValue=parseEther('0.0001');
        await assert.rejects(
            crowdSaleAsBuyer.write.buyTokens({value:purchaseValue}),
            (err:Error)=>err.message.includes("Ether sent must be a multiple of token price"),
            "Transaction did not fail, value passed:not a multiple of tokenPrice"
        )
    });

});