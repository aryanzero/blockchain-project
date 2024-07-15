// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Voter {
        bool hasVoted;
        uint8 vote;
        bytes32 publicKey;
        bytes32 encryptedVote;
        bytes32 proof;
    }

    struct Candidate {
        string name;
        uint voteCount;
    }

    Candidate[2] public candidates;
    mapping(address => Voter) public voters;
    address[] public voterAddresses;
    uint public constant MAX_VOTERS = 10;

    event VoteCast(address indexed voter, uint8 candidate);
    event PublicKeyRegistered(address indexed voter, bytes32 publicKey);

    constructor(string memory candidate1, string memory candidate2) {
        candidates[0] = Candidate(candidate1, 0);
        candidates[1] = Candidate(candidate2, 0);
    }

    function registerPublicKey(bytes32 publicKey) external {
        require(voterAddresses.length < MAX_VOTERS, "Voter limit reached");
        require(voters[msg.sender].publicKey == bytes32(0), "Already registered");
        
        voters[msg.sender] = Voter({
            hasVoted: false,
            vote: 0,
            publicKey: publicKey,
            encryptedVote: "",
            proof: ""
        });
        
        voterAddresses.push(msg.sender);
        emit PublicKeyRegistered(msg.sender, publicKey);
    }

    function vote(uint8 candidate, bytes32 encryptedVote, bytes32 proof) external {
        require(candidate < 2, "Invalid candidate");
        Voter storage sender = voters[msg.sender];
        require(!sender.hasVoted, "Already voted");

        sender.hasVoted = true;
        sender.vote = candidate;
        sender.encryptedVote = encryptedVote;
        sender.proof = proof;
        candidates[candidate].voteCount += 1;

        emit VoteCast(msg.sender, candidate);
    }

    function getAllVotes() external view returns (uint[] memory) {
        uint[] memory votes = new uint[](2);
        votes[0] = candidates[0].voteCount;
        votes[1] = candidates[1].voteCount;
        return votes;
    }
function getAllVoters() external view returns (bytes32[] memory) {
    bytes32[] memory publicKeys = new bytes32[](voterAddresses.length);
    for (uint i = 0; i < voterAddresses.length; i++) {
        publicKeys[i] = voters[voterAddresses[i]].publicKey;
    }
    return publicKeys;
}

    function getResults() external view returns (string memory winnerName, uint winnerVoteCount) {
        if (candidates[0].voteCount > candidates[1].voteCount) {
            return (candidates[0].name, candidates[0].voteCount);
        } else if (candidates[1].voteCount > candidates[0].voteCount) {
            return (candidates[1].name, candidates[1].voteCount);
        } else {
            return ("It's a tie!", candidates[0].voteCount);
        }
    }
}