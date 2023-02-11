import { ethers, run, network } from "hardhat";
import "dotenv/config";
import "@nomiclabs/hardhat-etherscan";


async function main() {
  const Level = await ethers.getContractFactory("Level");
  const args = [process.env.OWNER_PUBLIC_KEY!, "Level", "ACH", process.env.SANDBOX_STARK_CONTRACT_ADDRESS!];
  const level = await Level.deploy(process.env.OWNER_PUBLIC_KEY!, "Level", "LVL", process.env.SANDBOX_STARK_CONTRACT_ADDRESS!);
  console.log("Deploying contract...");
  await level.deployed();
  console.log(`Level smart contract deployed at ${level.address}`);
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    await level.deployTransaction.wait(6);
    await verify(level.address, args);
  }
}

async function verify(contractAddress: string, args: any[]) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!")
    }
    else {
      console.log(e);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});