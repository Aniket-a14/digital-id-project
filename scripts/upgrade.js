const fs = require('fs');
const path = require('path');

async function main() {
  const deploymentsPath = path.join(__dirname, "..", "deployments.json");
  if (!fs.existsSync(deploymentsPath)) {
    throw new Error("deployments.json not found. Deploy first.");
  }
  const data = JSON.parse(fs.readFileSync(deploymentsPath));
  const proxyAddress = data.TouristIDRegistry;
  if (!proxyAddress) throw new Error("Proxy address not found in deployments.json");

  console.log("Upgrading proxy at", proxyAddress);

  const TouristV1 = await ethers.getContractFactory("TouristIDRegistryV1");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, TouristV1);
  console.log("Upgraded proxy. Transaction hash:", upgraded.deployTransaction?.hash);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
