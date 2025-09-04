import assert from "node:assert/strict";
import { describe,it } from "node:test";
import { network } from "hardhat";
import { getAddress } from "viem";

describe("Polling Contract",async ()=>{
    const {viem}=await network.connect();
    const [owner,voter1,voter2]=await viem.getWalletClients();
    const VoteOptions={
        None:0,
        Yes:1,
        No:2
    };

    it("Should set the deployer as the owner",async ()=>{
        const polling=await viem.deployContract("Polling");
        const contractOwner=await polling.read.owner();
        assert.equal(contractOwner,getAddress(owner.account.address),"Deployer is not set as the owner");

    });

    it("addProposal can only be called by owner",async ()=>{
        const polling=await viem.deployContract("Polling");

        const pollinAsAnotherUser=await viem.getContractAt(
            "Polling",
            polling.address,
            {client:{wallet:voter1}}
        );
        const newProposal="Is Pluto a planet";

        await assert.rejects(
            pollinAsAnotherUser.write.addProposal([newProposal]),
            (err:Error)=>err.message.includes("Only owner can access"),
            "Non owner was able to call the addProposal function"
        );
    });

    it("Should add a new Proposal to proposals array",async ()=>{
        const polling=await viem.deployContract("Polling");
        const _description="Is Mars on Earth";

        await polling.write.addProposal([_description]);
        const addedProposal=await polling.read.proposals([0n]);
        assert.equal(addedProposal[0],_description,"Proposal description is incorrect");
        assert.equal(addedProposal[1],0n,"Default yesCount is not zero");
        assert.equal(addedProposal[2],0n,"Default noCount is not zero");
    });

    it("Should emit ProposalCreated event when addProposal is called",async ()=>{

        const polling=await viem.deployContract("Polling");
        const _description="Is Mars on Earth";
        await viem.assertions.emitWithArgs(
            polling.write.addProposal([_description]),
            polling,
            "ProposalCreated",
            [0n,_description]
        );

    });

    it("Should revert if proposalId is Invalid",async ()=>{
        const polling=await viem.deployContract("Polling");
        await assert.rejects(
            polling.write.vote([100n,VoteOptions.None]),
            (err:Error)=>err.message.includes("Invalid proposal ID")

        );

    });
    it("Should revert for Invalid vote choice",async ()=>{
        const polling=await viem.deployContract("Polling");
        await polling.write.addProposal(["A proposal"]);

        await assert.rejects(
            polling.write.vote([0n,VoteOptions.None]),
            (err:Error)=>err.message.includes("Invalid Choice")
        );
    });

    it("Should not allow a voter to vote twice",async ()=>{
        const polling=await viem.deployContract("Polling");
        await polling.write.addProposal(["Proposal"]);

        const pollingVoter1=await viem.getContractAt(
            "Polling",
            polling.address,
            {client:{wallet:voter1}}
        );
        await pollingVoter1.write.vote([0n,VoteOptions.Yes]);
        const voteChoice=await pollingVoter1.read.proposals([0n]);
       await assert.rejects(
            pollingVoter1.write.vote([0n,VoteOptions.Yes]),
            (err:Error)=>err.message.includes( "You have already voted for this Proposal"),
            "A User cannot vote twice for the same proposal"
        )
    });
    it("Should allow a Voter to vote Yes",async ()=>{
        const polling=await viem.deployContract("Polling");
        await polling.write.addProposal(["Proposal"]);

        const pollingVoter1=await viem.getContractAt(
            "Polling",
            polling.address,
            {client:{wallet:voter1}}
        );
        await pollingVoter1.write.vote([0n,VoteOptions.Yes]);
        const voteChoice=await pollingVoter1.read.proposals([0n]);
        assert.equal(
            voteChoice[1],
            1n,
            "Error voting Yes for the given proposal"
        );
        assert.equal(await pollingVoter1.read.votes([0n,voter1.account.address]),VoteOptions.Yes);
    });
    it("Should allow a Voter to vote No",async ()=>{
        const polling=await viem.deployContract("Polling");
        await polling.write.addProposal(["Proposal"]);

        const pollingVoter1=await viem.getContractAt(
            "Polling",
            polling.address,
            {client:{wallet:voter1}}
        );
        await pollingVoter1.write.vote([0n,VoteOptions.No]);
        const voteChoice=await pollingVoter1.read.proposals([0n]);
        assert.equal(
            voteChoice[2],
            1n,
            "Error voting Yes for the given proposal"
        );
        assert.equal(await pollingVoter1.read.votes([0n,voter1.account.address]),VoteOptions.No);
    });

});