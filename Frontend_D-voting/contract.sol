// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.26;

// import "@openzeppelin/contracts/security/Pausable.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VotingEVM is Pausable, ReentrancyGuard {

    address public immutable electionCommission;

    constructor() {
        electionCommission = msg.sender;
    }

    enum VotingStatus { NotStarted, InProgress, Ended, VotingStopped }
    enum Gender { NotSpecified, Male, Female, Other }

    struct Voter {
        string name;
        uint age;
        uint voterId;
        Gender gender;
        uint voteCandidateId;
        address voterAddress;
    }

    struct Candidate {
        string name;
        string party;
        uint age;
        Gender gender;
        uint candidateId;
        address candidateAddress;
        uint votes;
    }

    address public winner;
    uint private nextVoterId = 1;
    uint private nextCandidateId = 1;
    uint private startTime = 0;
    uint private endTime = 0;
    bool private stopVoting;

    mapping(uint => Voter) private voterDetails;
    mapping(address => bool) private voterExist;
    mapping(uint => Candidate) private candidateDetails;
    mapping(address => bool) private candidateExist;

    address[] private voterList;
    address[] private candidateList;

    event VoterRegistered(address indexed voterAddress, uint voterId);
    event CandidateRegistered(address indexed candidateAddress, uint candidateId);
    event VotingPeriodSet(uint startTime, uint endTime);
    event VoteSuccessful(address indexed voterAddress, string message);
    event ResultAnnounced(address indexed winner, string name, uint votes);

    modifier votingNotOver() {
        require(block.timestamp <= endTime && !stopVoting, "Voting is over or stopped");
        _;
    }

    modifier onlyCommissioner() {
        require(msg.sender == electionCommission, "Permission denied: Not election commissioner");
        _;
    }

    modifier validAge(uint _age) {
        require(_age >= 18, "Age must be at least 18");
        _;
    }

    function registerVoter(string calldata _name, uint _age, Gender _gender) external validAge(_age) whenNotPaused {
        require(!voterExist[msg.sender], "Voter already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");

        voterDetails[nextVoterId] = Voter({
            name: _name,
            age: _age,
            voterId: nextVoterId,
            gender: _gender,
            voteCandidateId: 0,
            voterAddress: msg.sender
        });

        voterExist[msg.sender] = true;
        voterList.push(msg.sender);

        emit VoterRegistered(msg.sender, nextVoterId);
        nextVoterId++;
    }

    function getVoterDetails(uint _voterID) public view returns (string memory name, uint age, Gender gender) {
        Voter memory voter = voterDetails[_voterID];
        return (voter.name, voter.age, voter.gender);
    }

    function registerCandidate(string calldata _name, string calldata _party, uint _age, Gender _gender) external validAge(_age) whenNotPaused {
        require(!candidateExist[msg.sender], "Candidate already registered");
        require(msg.sender != electionCommission, "Election commissioner cannot be a candidate");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_party).length > 0, "Party cannot be empty");

        candidateDetails[nextCandidateId] = Candidate({
            name: _name,
            party: _party,
            age: _age,
            gender: _gender,
            candidateId: nextCandidateId,
            candidateAddress: msg.sender,
            votes: 0
        });

        candidateExist[msg.sender] = true;
        candidateList.push(msg.sender);
        
        emit CandidateRegistered(msg.sender, nextCandidateId);
        nextCandidateId++;
    }

    function getCandidateDetails(uint _candidateID) public view returns (string memory name, string memory party, uint age, Gender gender) {
        Candidate memory candidate = candidateDetails[_candidateID];
        return (candidate.name, candidate.party, candidate.age, candidate.gender);
    }

    function getCandidateList() public view returns (address[] memory) {
        return candidateList;
    }

    function getVoterList() public view returns (address[] memory) {
        return voterList;
    }

    function emergencyStopVoting() public onlyCommissioner whenNotPaused {
        require(block.timestamp >= startTime, "Voting has not started yet");
        stopVoting = true;
    }

    function setVotingPeriod(uint _startTime, uint _endTime) external onlyCommissioner whenNotPaused {
        require(_endTime > _startTime, "End time must be greater than start time");
        startTime = _startTime;
        endTime = _endTime;
        emit VotingPeriodSet(startTime, endTime);
    }

    function getVotingStatus() public view returns (VotingStatus) {
        if (stopVoting) {
            return VotingStatus.VotingStopped;
        } else if (block.timestamp < startTime) {
            return VotingStatus.NotStarted;
        } else if (block.timestamp >= startTime && block.timestamp <= endTime) {
            return VotingStatus.InProgress;
        } else {
            return VotingStatus.Ended;
        }
    }

    function vote(uint _voterId, uint _candidateId) external votingNotOver nonReentrant whenNotPaused {
        Voter storage voter = voterDetails[_voterId];
        Candidate storage candidate = candidateDetails[_candidateId];

        require(voter.voteCandidateId == 0, "You have already voted");
        require(voter.voterAddress == msg.sender, "Unauthorized voter");
        require(candidate.candidateAddress != address(0), "Candidate not found");

        voter.voteCandidateId = _candidateId;
        candidate.votes++;

        emit VoteSuccessful(voter.voterAddress, "Vote added successfully");
    }

    function announceResult() external onlyCommissioner whenNotPaused {
        require(getVotingStatus() == VotingStatus.Ended, "Voting is not ended yet");

        uint winningVoteCount = 0;
        uint winningCandidateId;

        for (uint i = 1; i < nextCandidateId; i++) {
            if (candidateDetails[i].votes > winningVoteCount) {
                winningVoteCount = candidateDetails[i].votes;
                winningCandidateId = i;
            }
        }

        winner = candidateDetails[winningCandidateId].candidateAddress;
        emit ResultAnnounced(winner, candidateDetails[winningCandidateId].name, winningVoteCount);
    }

    function resetElection() external onlyCommissioner {
        for (uint i = 1; i < nextVoterId; i++) {
            delete voterExist[voterDetails[i].voterAddress];
            delete voterDetails[i];
        }
        for (uint i = 1; i < nextCandidateId; i++) {
            delete candidateExist[candidateDetails[i].candidateAddress];
            delete candidateDetails[i];
        }
        delete voterList;
        delete candidateList;
        nextVoterId = 1;
        nextCandidateId = 1;
        startTime = 0;
        endTime = 0;
        stopVoting = false;
        winner = address(0);
    }
}
