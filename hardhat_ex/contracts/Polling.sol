//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.28;

contract Polling {
    address public owner;
    Proposal[] public proposals;
    enum VoteOptions {
        None,
        Yes,
        No
    }
    mapping(uint => mapping(address => VoteOptions)) public votes;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can access");
        _;
    }

    struct Proposal {
        string description;
        uint yesCount;
        uint noCount;
    }
    event ProposalCreated(uint indexed proposalId, string description);
    event Voted(
        address indexed voter,
        uint indexed _proposalIdVotedFor,
        VoteOptions choice
    );

    function addProposal(string memory _description) external onlyOwner {
        uint _proposalId = proposals.length;

        proposals.push(
            Proposal({description: _description, yesCount: 0, noCount: 0})
        );
        emit ProposalCreated(_proposalId, _description);
    }

    function vote(uint _proposalId, VoteOptions _choice) external {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        require(
            votes[_proposalId][msg.sender] == VoteOptions.None,
            "You have already voted for this Proposal"
        );
        require(
            _choice == VoteOptions.Yes || _choice == VoteOptions.No,
            "Invalid Choice"
        );

        votes[_proposalId][msg.sender] = _choice;
        if (_choice == VoteOptions.Yes) {
            proposals[_proposalId].yesCount += 1;
        } else {
            proposals[_proposalId].noCount += 1;
        }
        emit Voted(msg.sender, _proposalId, _choice);
    }

    function getProposalCount() external view returns (uint) {
        return proposals.length;
    }
}
