# Tip-Flow 💸

**Frictionless, Gasless Micro-Tipping for Content Creators.**

Tip-Flow is a decentralized application (dApp) built on Ethereum that enables users to support their favorite creators with instant, gas-free micro-payments. By leveraging a session-based state channel architecture, Tip-Flow solves the high cost and friction associated with on-chain tipping.

> **Note**: This project is built using [Scaffold-ETH 2](https://scaffoldeth.io), an open-source toolkit for building dApps.

## 🌟 Key Features

- **Gasless Tipping**: Users lock a budget once and send tips instantly without individual transaction fees.
- **Session-Based**: Create a tipping session with a fixed budget. Unused funds are returned upon session closure.
- **Instant Updates**: Tips are reflected immediately on the creator's dashboard.
- **Creator Discovery**: Browse and search for creators by wallet address or ENS name.
- **Secure**: Built on proven smart contract patterns for state channels (currently utilizing sender-driven settlement for MVP).

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [RainbowKit](https://www.rainbowkit.com/), [wagmi](https://wagmi.sh/), [viem](https://viem.sh/)
- **Smart Contracts**: [Solidity](https://docs.soliditylang.org/), [Hardhat](https://hardhat.org/)
- **State Management**: LocalStorage for session persistence

## 🚀 Quickstart

To get started with Tip-Flow locally, follow these steps:

1.  **Install Dependencies**
    ```bash
    yarn install
    ```

2.  **Start Local Chain**
    In a separate terminal window, start a local Ethereum network:
    ```bash
    yarn chain
    ```

3.  **Deploy Contracts**
    In a second terminal window, deploy the smart contracts:
    ```bash
    yarn deploy
    ```

4.  **Start Frontend**
    In a third terminal window, start the Next.js application:
    ```bash
    yarn start
    ```

    Visit your app at `http://localhost:3000`.

## 📜 Smart Contracts

The core logic resides in `packages/hardhat/contracts`:

-   `TipFlowSession.sol`: Manages session creation, locking funds, and settlement of tips.
-   `MockUSDC.sol`: Used for local testing to simulate USDC token transfers.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.