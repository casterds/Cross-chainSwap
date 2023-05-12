pragma solidity ^0.8.0;

contract MockOracle {
    int256 public answer;
    uint256 public timestamp;

    constructor(int256 _staticOracleAnswer) {
        answer = _staticOracleAnswer;
        timestamp = block.timestamp;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80, // roundId,
            int256, // answer,
            uint256, // startedAt,
            uint256, // updatedAt,
            uint80 // answeredInRound
        )
    {
        return (0, answer, 0, timestamp, 0);
    }

    function setTimestamp(uint256 _timestamp) public {
        timestamp = _timestamp;
    }
}
