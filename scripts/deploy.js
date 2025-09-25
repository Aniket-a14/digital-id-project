const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Tourist = await ethers.getContractFactory("TouristIDRegistryV1");
  const proxy = await upgrades.deployProxy(Tourist, [deployer.address], { initializer: "initialize" });

  console.log("Proxy deployed to:", proxy.target ?? proxy.address); // upgrades returns object with address in older versions; target in some setups
  const address = proxy.target ?? proxy.address;

  const deploymentsPath = path.join(__dirname, "..", "deployments.json");
  let data = {};
  if (fs.existsSync(deploymentsPath)) {
    data = JSON.parse(fs.readFileSync(deploymentsPath));
  }
  data.TouristIDRegistry = address;
  fs.writeFileSync(deploymentsPath, JSON.stringify(data, null, 2));
  console.log("Saved address to deployments.json");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
