const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TouristIDRegistryV1", function () {
  let owner, other;
  let registry;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();
    const Tourist = await ethers.getContractFactory("TouristIDRegistryV1");
    registry = await upgrades.deployProxy(Tourist, [owner.address], { initializer: "initialize" });
    await registry.deployed();
  });

  it("should register a tourist (mock verification)", async () => {
    const tx = await contractService.registerTourist(user.address, "Alice", 946684800, "QmMockCid");
    expect(tx).to.have.property("hash");
  });

});
