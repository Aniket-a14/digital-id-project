require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const deploymentsPath = path.join(__dirname, "..", "..", "deployments.json");
const deployment = fs.existsSync(deploymentsPath) ? JSON.parse(fs.readFileSync(deploymentsPath)) : {};
const address = deployment.TouristIDRegistry;

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_MUMBAI || "http://127.0.0.1:8545");
const signer = process.env.PRIVATE_KEY ? new ethers.Wallet(process.env.PRIVATE_KEY, provider) : provider;

const abiPath = path.join(__dirname, "..", "..", "artifacts", "contracts", "TouristIDRegistryV1.sol", "TouristIDRegistryV1.json");
if (!fs.existsSync(abiPath)) {
  throw new Error("ABI not found. Compile contracts first.");
}
const abi = JSON.parse(fs.readFileSync(abiPath)).abi;

const contract = new ethers.Contract(address, abi, signer);

module.exports = {
  registerID: async (who, name, dob, ipfsHash) => {
    const tx = await contract.registerID(who, name, dob, ipfsHash);
    await tx.wait();
    return tx;
  },
  updateID: async (who, name, dob, ipfsHash) => {
    const tx = await contract.updateID(who, name, dob, ipfsHash);
    await tx.wait();
    return tx;
  },
  getID: async (who) => {
    const r = await contract.getID(who);
    // r is tuple; return friendly object
    return {
      name: r[0],
      dob: r[1].toString(),
      ipfsHash: r[2],
      exists: r[3]
    };
  }
};
