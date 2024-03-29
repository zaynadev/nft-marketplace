// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs/promises");

async function main() {
  const Contract = await hre.ethers.getContractFactory("NFTMarketplace");
  const contract = await Contract.deploy();
  await contract.deployed();

  const data = {
    address: contract.address,
    abi: contract.interface.format(),
  };
  fs.writeFile("./frontend/src/Marketplace.json", JSON.stringify(data, null, 2), {
    encoding: "utf-8",
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
