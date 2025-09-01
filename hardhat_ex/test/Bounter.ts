
import assert from "node:assert/strict";
import { describe,it } from "node:test";
import {network} from 'hardhat';

describe ("Bounter", async function(){

    const {viem}=await network.connect();
    const publicClient =await viem.getPublicClient();

    it("Should emit the Increment event when calling the inc() function",async function(){

        const bounter=await viem.deployContract("Bounter");
        await viem.assertions.emitWithArgs(
            bounter.write.inc(),
            bounter,
            "Increment",
            [1n]

        );

    });
    it("Should emit the Decrement event when calling the dec() function",async function(){

        const bounter=await viem.deployContract("Bounter");
        await viem.assertions.emitWithArgs(
            bounter.write.dec(),
            bounter,
            "Decrement",
            [1n]

        );

    });
    it("The sum of the Increment events should match the current value", async function(){
        const bounter= await viem.deployContract("Bounter");
        const deploymentBlockNumber= await publicClient.getBlockNumber();

        for(let i=1n;i<=10n;i++){
            bounter.write.incBy([i]);
        }
        const events= await publicClient.getContractEvents({
            address:bounter.address,
            abi:bounter.abi,
            eventName:"Increment",
            fromBlock:deploymentBlockNumber,
            strict:true
        });

        let total=100n;
        for(const event of events){
            total+=event.args.by;
        }
        assert.equal(total,await bounter.read.x());
    });
    it("The final difference should be in accordance to the number of times Decrement event is called",async function(){
        const bounter=await viem.deployContract("Bounter");
        const deploymentBlockNumber=await publicClient.getBlockNumber();

        for(let i=10n;i>=1n;i--){
            bounter.write.decBy([i]);
        }
        const events= await publicClient.getContractEvents({
            address:bounter.address,
            abi:bounter.abi,
            eventName:"Decrement",
            fromBlock:deploymentBlockNumber,
            strict:true
        });
        let total=100n;
        for(const event of events){
            total-=event.args.by;
        }

        assert.equal(total,await bounter.read.x());

    });



});