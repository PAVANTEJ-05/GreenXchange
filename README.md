# 🌿 GreenXchange

GreenXchange is a decentralized **green-credits marketplace** enabling transparent trading of tokenized environmental assets.  
It combines **ERC-1155 green credits**, an **upgradeable on-chain orderbook**, and **PYUSD stablecoin settlement** — all wrapped in a modern **Next.js + Ethers.js** frontend.

---

## 🚀 Overview

GreenXchange bridges verified sustainability projects with real blockchain markets.

- ♻️ Tokenized environmental credits (Green, Carbon, Water, Renewable)
- ⚖️ Orderbook with on-chain escrow and upgradeable smart contracts
- 💰 Settlement in PYUSD with configurable platform/referrer fees
- 🌐 Fully decentralized and transparent credit lifecycle

---

## 🧱 Core Components

### 🌱 **GreenCreditToken (ERC-1155)**
Implements verified green credit issuance with strict owner controls.
- Register, approve, mint, freeze/unfreeze, revoke, and retire credits.
- Tracks `totalSupply` and `totalRetired` per token.
- Supports multiple credit types via enum.
- Metadata managed via `baseURI` for off-chain storage (IPFS/metadata server).

### ⚖️ **GreenXchangeOrderbook (Upgradeable)**
A UUPS-based orderbook that manages buy/sell orders in PYUSD.
- Role-based access via `AccessControl` (`ADMIN`, `MANAGER`, `UPGRADER`)
- Escrows PYUSD or ERC-1155 tokens during trades
- Handles `placeOrder`, `fillOrder`, and `cancelOrder`
- Automatic settlement, platform fees, and referrer rewards
- Protected by `Pausable` and `ReentrancyGuard`

### 💸 **PYUSD Integration**
- Supports any ERC-20-compatible stablecoin
- Default Sepolia PYUSD if `address(0)` is passed during initialization
- Accurate decimals tracking for PYUSD math

---
## 🧠 Tech Stack

| Layer | Stack |
|-------|-------|
| Smart Contracts | Solidity, OpenZeppelin, UUPS |
| Frontend | Next.js 14 (App Router), TailwindCSS |
| Blockchain Interaction | Ethers.js |
| Token Standards | ERC-1155 (GreenCreditToken), ERC-20 (PYUSD) |
| Network | Ethereum Sepolia Testnet |

---
## 🖥️ Frontend

The frontend is built with **Next.js (App Router)** and **TailwindCSS**, with **Ethers.js** for blockchain interactions.

Key features:
- 🦊 Wallet connection via MetaMask (`window.ethereum`)
- 📊 Real-time orderbook and portfolio view
- 🪙 Place, fill, and cancel orders directly on-chain
- ✅ Mint, retire, and manage green credits
- ⚙️ Context-based contract management (`Orderbook`, `MintToken`, `Web3Context`)

---

## 📂 Project Structure (Simplified)

```text
pavantej-05-greenxchange/
├── ABI/
│   ├── GreenCreditTokenAbi.js
│   └── GreenXchangeOrderbookAbi.js
├── contracts/
│   ├── GreenCreditToken.sol
│   └── GreenXchangeOrderbook.sol
└── frontend/
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.mjs
    └── src/
        ├── app/ (Next.js pages)
        ├── components/ (UI + Web3)
        ├── contexts/ (React state + contract logic)
        └── utils/ (helpers, formatters, SDKs)
```
---
## ⚙️ Getting Started

### 1️⃣ Prerequisites

Make sure you have:
- Node.js v18+
- npm or yarn
- A MetaMask wallet connected to Sepolia testnet

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/greenxchange.git
cd greenxchange/frontend
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧩 Frontend Integration Notes

- All contract ABIs live under `/ABI`
- The context files (`Orderbook.js`, `MintToken.js`, etc.) handle:
  - Connecting to wallet
  - Getting contract instances
  - Calling contract methods (`placeOrder`, `fillOrder`, `approve`, etc.)
- Uses `ethers@5.8.0` for compatibility with existing hooks and providers
.

## 📜 License

Released under the MIT License.

© 2025 GreenXchange. All rights reserved.
