// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//https://www.oklink.com/amoy/tx/0x7a6063dbc33476a3aad44cda00a16155afcdcfb609840af7ba7fa542d0d3608b

contract VotingEVM is Pausable, ReentrancyGuard {
    address public immutable electionCommission;

    constructor() {
        electionCommission = msg.sender;
    }

    enum VotingStatus { NotStarted, InProgress, Ended, VotingStopped }
    enum Gender { NotSpecified, Male, Female, Other }

    struct Voter {
        string name;
        uint8 age;
        Gender gender;
        address voteCandidateId;
    }

    struct Candidate {
        string name;
        string party;
        uint8 age;
        Gender gender;
        uint256 votes;
        uint256 deposit;
    }

    address public winner;
    uint256 private startTime;
    uint256 private endTime;
    bool private stopVoting;

    mapping(address => Voter) private voterDetails;
    mapping(address => Candidate) private candidateDetails;
    mapping(address => bool) private voterExist;
    mapping(address => bool) private candidateExist;

    address[] private voterList;
    address[] private candidateList;

    event VoterRegistered(address indexed voterAddress);
    event CandidateRegistered(address indexed candidateAddress);
    event VotingPeriodSet(uint256 startTime, uint256 endTime);
    event VoteSuccessful(address indexed voterAddress, string candidateName);
    event ResultAnnounced(address indexed winner, string name, uint256 votes);

    modifier votingNotOver() {
        require(block.timestamp <= endTime && !stopVoting, "Voting is over or stopped");
        _;
    }

    modifier onlyCommissioner() {
        require(msg.sender == electionCommission, "Permission denied: Not election commissioner");
        _;
    }

    modifier validAge(uint256 _age) {
        require(_age >= 18, "Age must be at least 18");
        _;
    }

    function registerVoter(string calldata _name, uint256 _age, Gender _gender) external validAge(_age) whenNotPaused {
        require(!voterExist[msg.sender], "Voter already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");

        voterDetails[msg.sender] = Voter(_name, uint8(_age), _gender, address(0));
        voterExist[msg.sender] = true;
        voterList.push(msg.sender);

        emit VoterRegistered(msg.sender);
    }

    function getVoter(address _voterAddress) public view returns (string memory name, uint256 age, Gender gender) {
        Voter storage voter = voterDetails[_voterAddress];
        return (voter.name, voter.age, voter.gender);
    }

    function registerCandidate(string calldata _name, string calldata _party, uint256 _age, Gender _gender) external payable validAge(_age) whenNotPaused {
        require(getVotingStatus() != VotingStatus.InProgress, "you can not Register,voting already started");
        require(!candidateExist[msg.sender], "Candidate already registered");
        require(msg.sender != electionCommission, "Election commissioner cannot be a candidate");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_party).length > 0, "Party cannot be empty");
        require(msg.value == 0.001 ether, "Deposit amount must be 0.001 ETH"); // 0.001 ETH = 1000000000000000 wei

        candidateDetails[msg.sender] = Candidate(_name, _party, uint8(_age), _gender, 0, msg.value);
        candidateExist[msg.sender] = true;
        candidateList.push(msg.sender);

        emit CandidateRegistered(msg.sender);
    }

    function getCandidate(address _candidateAddress) public view returns (string memory name, string memory party, uint256 age, Gender gender) {
        Candidate storage candidate = candidateDetails[_candidateAddress];
        return (candidate.name, candidate.party, candidate.age, candidate.gender);
    }

    function getCandidateList() public view returns (address[] memory) {
        return candidateList;
    }

    function getVoterList() public view returns (address[] memory) {
        return voterList;
    }

    function emergencyStopVoting() public onlyCommissioner whenNotPaused {
        require(getVotingStatus() == VotingStatus.InProgress, "Voting has not ended yet");
        stopVoting = true;
    }

    function setVotingPeriod(uint256 _startTime, uint256 _endTime) external onlyCommissioner whenNotPaused {
        require(_endTime > _startTime, "End time must be greater than start time");
        require(getVotingStatus() != VotingStatus.InProgress, "Cannot set period during active voting");

        startTime = _startTime;
        endTime = _endTime;

        emit VotingPeriodSet(_startTime, _endTime);
    }

    function getVotingStatus() public view returns (VotingStatus) {
        if (startTime == 0 || endTime == 0) return VotingStatus.NotStarted; 
        if (stopVoting) return VotingStatus.VotingStopped;
        if (block.timestamp < startTime) return VotingStatus.NotStarted;
        if (block.timestamp <= endTime) return VotingStatus.InProgress;
        return VotingStatus.Ended;
    }


    function vote(address _candidateAddress) external votingNotOver nonReentrant whenNotPaused {
        require(voterExist[msg.sender], "You are not registered to vote");
        require(voterDetails[msg.sender].voteCandidateId == address(0), "You have already voted");
        require(candidateExist[_candidateAddress], "Candidate not found");

        voterDetails[msg.sender].voteCandidateId = _candidateAddress;
        candidateDetails[_candidateAddress].votes++;

        emit VoteSuccessful(msg.sender, candidateDetails[_candidateAddress].name);
    }

    function announceResult() external onlyCommissioner whenNotPaused {
        require(getVotingStatus() == VotingStatus.Ended, "Voting has not ended yet");

        address winningCandidate;
        uint256 winningVoteCount;

        for (uint256 i = 0; i < candidateList.length; i++) {
            uint256 candidateVotes = candidateDetails[candidateList[i]].votes;
            if (candidateVotes > winningVoteCount) {
                winningVoteCount = candidateVotes;
                winningCandidate = candidateList[i];
            }
        }

        require(winningVoteCount > 0, "No votes were cast");

        winner = winningCandidate;
        emit ResultAnnounced(winner, candidateDetails[winner].name, winningVoteCount);
    }

    function resetElection() external onlyCommissioner {
    require(getVotingStatus() == VotingStatus.Ended, "Election not ended yet");

    // Reset voterExist mappings
    for (uint256 i = 0; i < voterList.length; i++) {
        voterExist[voterList[i]] = false;
    }

    // Reset candidateExist mappings
    for (uint256 i = 0; i < candidateList.length; i++) {
        candidateExist[candidateList[i]] = false;
    }

    // Clear the lists and reset other variables
    delete voterList;
    delete candidateList;
    startTime = 0;
    endTime = 0;
    stopVoting = false;
    winner = address(0);
}


    function electionCommissionBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}

    function transferETH(address payable _address, uint256 _amount) external onlyCommissioner {
        require(address(this).balance >= _amount, "Insufficient contract balance");
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "Transfer failed");
    }
}
