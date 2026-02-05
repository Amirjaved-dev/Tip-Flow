// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "hardhat/console.sol";

/**
 * @title TipFlowSession
 * @notice Validates off-chain tipping sessions and handles on-chain settlement.
 * @dev Intended for Hackathon MVP. Implements Yellow Network-style state channel logic simplified.
 */
contract TipFlowSession {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    IERC20 public immutable usdcToken;

    struct Session {
        address creator;
        uint256 totalAmount;
        bool isActive;
    }

    // specific sessionId to session details
    mapping(bytes32 => Session) public sessions;

    event SessionCreated(bytes32 indexed sessionId, address indexed creator, uint256 amount);
    event SessionSettled(
        bytes32 indexed sessionId,
        address indexed creator,
        uint256 totalDistributed,
        uint256 refundAmount
    );

    event TipReceived(
        address indexed recipient,
        uint256 amount,
        address indexed tipper,
        bytes32 indexed sessionId
    );

    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
    }

    /**
     * @notice Starts a tipping session by locking USDC.
     * @param _amount The amount of USDC to lock for this session.
     * @return sessionId The unique identifier for the session.
     */
    function createSession(uint256 _amount) external returns (bytes32 sessionId) {
        require(_amount > 0, "Amount must be greater than 0");

        // Transfer USDC from user to this contract
        bool success = usdcToken.transferFrom(msg.sender, address(this), _amount);
        require(success, "USDC transfer failed");

        // Generate a unique session ID based on creator and block info
        sessionId = keccak256(abi.encodePacked(msg.sender, block.timestamp, _amount));

        sessions[sessionId] = Session({ creator: msg.sender, totalAmount: _amount, isActive: true });

        emit SessionCreated(sessionId, msg.sender, _amount);
    }

    /**
     * @notice Settles a session by verifying the off-chain "final state" signature and distributing funds.
     * @param _sessionId The ID of the session to settle.
     * @param _recipients List of addresses to receive tips.
     * @param _amounts List of amounts for each recipient.
     * @param _signature The signature of the creator confirming this distribution.
     */
    function settleSession(
        bytes32 _sessionId,
        address[] calldata _recipients,
        uint256[] calldata _amounts,
        bytes calldata _signature
    ) external {
        Session storage session = sessions[_sessionId];
        require(session.isActive, "Session is not active");
        require(_recipients.length == _amounts.length, "Arrays length mismatch");

        // Calculate total to distribute
        uint256 totalToDistribute = 0;
        for (uint256 i = 0; i < _amounts.length; i++) {
            totalToDistribute += _amounts[i];
        }

        require(totalToDistribute <= session.totalAmount, "Insufficient session balance");

        // Verify Signature
        // The message signed off-chain should be hash(sessionId, recipients, amounts)
        bytes32 messageHash = keccak256(abi.encodePacked(_sessionId, _recipients, _amounts));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(_signature);

        require(signer == session.creator, "Invalid signature");

        // Effects: Close Session
        session.isActive = false;

        // Interactions: Distribute Tips
        for (uint256 i = 0; i < _recipients.length; i++) {
            if (_amounts[i] > 0) {
                require(usdcToken.transfer(_recipients[i], _amounts[i]), "Transfer to recipient failed");
                emit TipReceived(_recipients[i], _amounts[i], session.creator, _sessionId);
            }
        }

        // Refund remaining balance to creator
        uint256 refund = session.totalAmount - totalToDistribute;
        if (refund > 0) {
            require(usdcToken.transfer(session.creator, refund), "Refund failed");
        }

        emit SessionSettled(_sessionId, session.creator, totalToDistribute, refund);
    }

    /**
     * @notice Allows creator to withdraw funds if no tips were sent, without a signature (simplified for MVP).
     * @dev unique to MVP, allows manual closing.
     */
    function abortSession(bytes32 _sessionId) external {
        Session storage session = sessions[_sessionId];
        require(session.isActive, "Session not active");
        require(session.creator == msg.sender, "Not session creator");

        session.isActive = false;
        require(usdcToken.transfer(session.creator, session.totalAmount), "Refund failed");

        emit SessionSettled(_sessionId, msg.sender, 0, session.totalAmount);
    }
}
