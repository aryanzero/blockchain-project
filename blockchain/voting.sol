// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    // Structure to represent a voter
    struct Voter {
        bool hasVoted; // To check if the voter has already voted
        uint8 vote;    // Candidate ID (0 or 1)
    }

    // Structure to represent a candidate
    struct Candidate {
        string name;   // Name of the candidate
        uint voteCount; // Number of votes the candidate has received
    }

    // Array of candidates
    Candidate[2] public candidates;

    // Mapping to store the voter information
    mapping(address => Voter) public voters;

    // Event to notify when a vote is cast
    event VoteCast(address indexed voter, uint8 candidate);

    // Constructor to initialize the candidates
    constructor(string memory candidate1, string memory candidate2) {
        candidates[0] = Candidate(candidate1, 0);
        candidates[1] = Candidate(candidate2, 0);
    }

    // Function to cast a vote
    function vote(uint8 candidate) external {
        require(candidate < 2, "Invalid candidate"); // Ensure the candidate ID is valid
        Voter storage sender = voters[msg.sender];
        require(!sender.hasVoted, "Already voted"); // Ensure the voter hasn't voted already
        
        sender.hasVoted = true; // Mark the voter as having voted
        sender.vote = candidate; // Store the vote
        candidates[candidate].voteCount += 1; // Increment the candidate's vote count

        emit VoteCast(msg.sender, candidate); // Emit the vote cast event
    }
    function getAllVotes() external view returns (uint[] memory) {
    uint[] memory votes = new uint[](2);
    votes[0] = candidates[0].voteCount;
    votes[1] = candidates[1].voteCount;
    return votes;
}

    // Function to get the voting result
    function getResults() external view returns (string memory winnerName, uint winnerVoteCount) {
        if (candidates[0].voteCount > candidates[1].voteCount) {
            return (candidates[0].name, candidates[0].voteCount);
        } else if (candidates[1].voteCount > candidates[0].voteCount) {
            return (candidates[1].name, candidates[1].voteCount);
        } else {
            return ("It's a tie!", candidates[0].voteCount); // In case of a tie
        }
    }
}
