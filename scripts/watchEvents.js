require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function main() {
  const deploymentsPath = path.join(__dirname, "..", "deployments.json");
  if (!fs.existsSync(deploymentsPath)) throw new Error("deployments.json missing");
  const data = JSON.parse(fs.readFileSync(deploymentsPath));
  const address = data.TouristIDRegistry;
  if (!address) throw new Error("Proxy address not found");

  const abi = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "artifacts", "contracts", "TouristIDRegistryV1.sol", "TouristIDRegistryV1.json"))).abi;
  const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_MUMBAI || "http://127.0.0.1:8545");

  const contract = new ethers.Contract(address, abi, provider);

  contract.on("IDRegistered", (who, name, dob, ipfsHash, event) => {
    console.log("IDRegistered:", who, name, dob.toString(), ipfsHash);
  });

  contract.on("IDUpdated", (who, name, dob, ipfsHash, event) => {
    console.log("IDUpdated:", who, name, dob.toString(), ipfsHash);
  });

  console.log("Listening for events on", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
