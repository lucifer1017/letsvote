import assert from "node:assert/strict";
import { describe,it } from "node:test";
import { network } from "hardhat";

describe("NumbersArray Contract",async function(){
    const {viem}=await network.connect();
    const [owner,otherAccount]=await viem.getWalletClients();
    
   it("The deployer should be set as owner",async function(){
    const numbersArray=await viem.deployContract("NumbersArray");
    const contractOwner=await numbersArray.read.owner();
    assert.equal(owner.account.address,contractOwner.toLocaleLowerCase(),"Owner is not the deployer");

   });

   it("The addNums function can only be accessed by the owner(the deployer)",async function(){
    const numbersArray=await viem.deployContract("NumbersArray");
    const numbersArrayAsOther=await viem.getContractAt(
        "NumbersArray",
        numbersArray.address,
        {client:{wallet:otherAccount}}
    );
    const _testNum=75n;
    await assert.rejects(
        numbersArrayAsOther.write.addNums([_testNum]),
        (err: Error)=> err.message.includes("Can be accessed by Owner only"),
        "Function call should have reverted"
    );
   });

   it("Should allow the Owner to add a number to nums array and emit NumberAdded event",async function(){
    const numbersArray=await viem.deployContract("NumbersArray");
    const _testNum=75n;
    await viem.assertions.emitWithArgs(  //checks for emitted event;
        numbersArray.write.addNums([_testNum]),
        numbersArray,
        "NumberAdded",
        [_testNum]
    );
    //now here we will check if _testNum was added in the nums array or not;
    const addedNumber=await numbersArray.read.nums([0n]);
    assert.equal(_testNum,addedNumber);

   });
    


});