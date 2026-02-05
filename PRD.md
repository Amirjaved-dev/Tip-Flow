# Product Requirements Document (PRD): Tip-Flow

| **Project Name** | Tip-Flow |
| :--- | :--- |
| **Version** | 1.0 (MVP) |
| **Status** | In Development |
| **Last Updated** | 2026-02-05 |

## 1. Executive Summary
**Tip-Flow** is a decentralized application (dApp) designed to enable **frictionless, gasless micro-tipping** for content creators. By leveraging a session-based state channel architecture, Tip-Flow allows users to lock a budget of USDC once and then send multiple tips instantly without incurring gas fees for each transaction. This solves the economic inefficiency of on-chain micro-payments.

## 2. Problem Statement
*   **High Gas Fees**: Tipping small amounts (e.g., $0.50, $1.00) on Ethereum L1 or even some L2s is impractical if the gas fee rivals the tip amount.
*   **Transaction Friction**: Users must sign a wallet transaction for every single tip, breaking the flow of consuming content.
*   **Latency**: On-chain confirmations take time, preventing real-time interaction (e.g., during livestreams).

## 3. Product Vision
*"Streaming value to creators. Gasless. Instant. Seamless."*
To create a payment experience that feels as instant as Web2 (like Twitch bits or YouTube SuperChats) but maintains the self-custody and transparency of Web3.

## 4. Target Audience
*   **Tippers**: Fans, livestream viewers, and content consumers who want to support creators with small, frequent amounts.
*   **Creators**: Streamers, artists, and writers looking for a direct revenue stream with minimal overhead.

## 5. User Stories
### 5.1 The Tipper
*   **As a Tipper**, I want to deposit a fixed amount of USDC into a "Session" so that I have a budget for the day.
*   **As a Tipper**, I want to send tips to creators instantly without waiting for MetaMask/Wallet popups every time.
*   **As a Tipper**, I want to see my remaining session balance update in real-time.
*   **As a Tipper**, I want to end my session and receive any unspent funds back to my wallet automatically.

### 5.2 The Creator (Future/Implicit)
*   **As a Creator**, I want to receive aggregated tips from users without claiming them individually to save on gas.

## 6. Functional Requirements

### 6.1 Session Management (On-Chain)
*   **Create Session**: Users can call `createSession(amount)` on the `TipFlowSession` contract.
    *   **Pre-condition**: User must `approve` the contract to spend their USDC.
    *   **Action**: Transfers USDC from User -> Contract.
    *   **Result**: A unique `sessionId` is generated; funds are locked.
*   **Settle Session**: Users can call `settleSession(...)` to close the channel.
    *   **Input**: List of recipients, list of amounts, and a cryptographic signature verifying the final state.
    *   **Action**: Contract verifies signature, distributes tokens to recipients, refunds remainder to Creator.
*   **Abort Session**: Users can call `abortSession(sessionId)` to recover funds if no tips were made (or emergency exit).

### 6.2 Tipping Engine (Off-Chain)
*   **Local State**: The application must track the "Current Balance" and "Tips Queue" locally (e.g., browser storage).
*   **Instant Updates**: When a user clicks "Tip", the UI updates immediately. The tip is added to a local ledger.
*   **Persistence**: Session state should survive page reloads (handled via LocalStorage).

### 6.3 Creator Discovery
*   **List View**: Users can browse a list of available creators.
*   **ENS Support**: Users can tip any address or ENS name (e.g., `vitalik.eth`).

## 7. Technical Architecture

### 7.1 Smart Contract (`TipFlowSession.sol`)
*   **Language**: Solidity (>=0.8.0).
*   **Standard**: ERC20 (USDC).
*   **Logic**: Simplified State Channel.
    *   `createSession`: Lock funds.
    *   `settleSession`: Verify ECDSA signature of `(sessionId, recipients[], amounts[])` signed by the session owner. *Note: In a full state channel, the recipient would sign, but for this "Sender-driven" bulk settlement, self-signing by sender is accepted to prove intent to the contract for the bulk distribution.*

### 7.2 Frontend
*   **Framework**: Next.js (App Router).
*   **Boilerplate**: Scaffold-ETH 2.
*   **Libraries**:
    *   `wagmi` / `viem`: Blockchain interaction.
    *   `usehooks-ts`: Local storage persistence.
    *   `rainbowkit`: Wallet connection.
*   **Key Components**:
    *   `SessionCreate`: UI for approving and depositing funds.
    *   `TippingStream`: Visual feed of recent tips.
    *   `TipControl`: Buttons for quick tipping ($1, $5, etc.).

## 8. Roadmap & Future Improvements
*   **Phase 1 (MVP - Current)**: Single-sender sessions, manual settlement by sender, local storage persistence.
*   **Phase 2 (Security)**: Implement receiver signatures (true State Channel) to prevent sender from reneging on tips before settlement (currently sender settles, so they *could* theoretically choose not to include some tips if they are malicious, though the UI prevents this. True payment channels require counter-party signing).
*   **Phase 3 (Yellow Network)**: Full integration with Yellow Network for high-speed clearing.
*   **Phase 4 (Gasless Onboarding)**: Integrate EIP-7702 and Paymasters (Pimlico) so the initial `createSession` transaction is also gasless for the user.
*   **Phase 5 (Cross-Chain)**: Allow depositing USDC on Base/Arbitrum and settling on mainnet (or vice versa).

## 9. Success Metrics
*   **Session Conversion**: % of connected users who create a session.
*   **Tips per Session**: Average number of tips sent per active session.
*   **Gas Saved**: Estimated gas cost of N individual transactions vs 1 settlement transaction.
