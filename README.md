# Digital ID Project (Blockchain-based Tourist Digital ID)

This project implements the **Digital ID system**:
- production-style upgradeable Solidity contract (UUPS + AccessControl)
- Hardhat project for compile/test/deploy
- Backend Express server that integrates DigiLocker (placeholder), canonicalizes + encrypts data, pins to IPFS, computes hashes and calls the contract

> IMPORTANT: This repository is a working prototype and must be adapted for production:
> - Replace placeholder crypto with KMS-based envelope encryption
> - Implement DigiLocker OAuth securely (the code has a placeholder)
> - Use multisig for admin/upgrader roles
> - Audit smart contracts and backend before mainnet

## Quickstart (local dev)

### 1) Prereqs
- Node.js v18+ and npm
- Git
- Optional: Docker for running a local IPFS node (or use Infura/Pinata)
- Hardhat

### 2) Install dependencies
From project root:
```bash
npm run install:all
```

### 3) Configure environment variables
- Copy `.env.example` to `.env` in the project root and backend folder (if needed).
- Fill in your secrets (DigiLocker, Alchemy, private key, etc.) in `.env`.

### 4) Compile contracts
From project root:
```bash
npx hardhat compile
```

### 5) Deploy contracts (local or testnet)
- For local node (run `npx hardhat node` in a separate terminal):
```bash
npx hardhat run scripts/deploy.js --network localhost
```
- For Mumbai testnet:
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

### 6) Run backend server
From `backend` folder:
```bash
npm start
```

### 7) Test and interact
- Use the backend API endpoints as described in the code/docs.
- Interact with the contract using the address in `deployments.json`.

---

## Step-by-Step Usage Guide

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd digital-id-project
```

### 2. Install dependencies (root and backend)
```bash
npm run install:all
```

### 3. Set up environment variables
- Copy `.env.example` to `.env` in the root and backend folders.
- Edit `.env` and fill in:
  - `ALCHEMY_MUMBAI` (your Alchemy/Infura RPC URL for Mumbai)
  - `PRIVATE_KEY` (your wallet's private key, **never share this**)
  - `BACKEND_PORT` (default: 4000)
  - DigiLocker credentials if using real integration

### 4. Compile smart contracts
```bash
npx hardhat compile
```

### 5. Deploy the contract
- For local development:
  1. Start a local node in a new terminal:
     ```bash
     npx hardhat node
     ```
  2. Deploy:
     ```bash
     npx hardhat run scripts/deploy.js --network localhost
     ```
- For Mumbai testnet:
  ```bash
  npx hardhat run scripts/deploy.js --network mumbai
  ```
- The deployed contract address will be saved in `deployments.json`.

### 6. Start the backend server
```bash
cd backend
npm start
```
- The server will run on the port set in `.env` (default: 4000).

### 7. Register a digital ID
- Use Postman, curl, or similar to POST to:
  ```
  http://localhost:4000/api/register
  ```
- Example JSON body:
  ```json
  {
    "address": "0xYourWalletAddress",
    "name": "Alice",
    "dob": "2000-01-01",
    "metadata": { "nationality": "Wonderland", "passport": "123456" }
  }
  ```

### 8. Fetch a digital ID
- Use your browser or API tool to GET:
  ```
  http://localhost:4000/api/get/0xYourWalletAddress
  ```
- You will receive the digital ID info if registered.

### 9. (Optional) Update a digital ID
- Implement the update endpoint in the backend if needed, following the contract's `updateID` function.

### 10. Troubleshooting
- If you see `ECONNREFUSED 127.0.0.1:8545`, make sure your local node is running or your `.env` points to a live RPC.
- If you see `private key too short`, ensure your `.env` has a real private key, not an address.
- If you see `MODULE_NOT_FOUND`, run `npm install` in the correct directory.

---

## API Endpoints
- `POST /api/register` — Register a new digital ID
- `GET /api/get/:address` — Fetch a digital ID by address

---

## Notes
- All contract interactions use the address in `deployments.json`.
- For production, secure your secrets and audit all code.
- See comments in code for further extension and integration points.

---

## Troubleshooting
- If you see `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)` on Windows, it is safe to ignore.
- Always run Hardhat commands from the project root, not from the backend folder.
- If you change contract code, recompile and redeploy.

---

## Project structure
- `contracts/` — Solidity smart contracts
- `scripts/` — Deployment and upgrade scripts
- `backend/` — Express server, API, integrations
- `test/` — Hardhat/ethers test cases

---

## Security & Production
- Never commit real secrets to `.env` or source control.
- Use a secure KMS for key management in production.
- Audit all code before mainnet deployment.

---
