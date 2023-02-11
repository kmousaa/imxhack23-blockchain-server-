import { ethers, run, network } from "hardhat";
import "dotenv/config";
import "@nomiclabs/hardhat-etherscan";


async function main() {
  const SpeedRunRecord = await ethers.getContractFactory("SpeedRunRecord");
  const args = [process.env.OWNER_PUBLIC_KEY!, "SpeedRunRecord", "SRR", process.env.SANDBOX_STARK_CONTRACT_ADDRESS!];
  const speedRunRecord = await SpeedRunRecord.deploy(process.env.OWNER_PUBLIC_KEY!, "SpeedRunRecord", "SRR", process.env.SANDBOX_STARK_CONTRACT_ADDRESS!);
  console.log("Deploying contract...");
  await speedRunRecord.deployed();
  console.log(`SpeedRunRecord smart contract deployed at ${speedRunRecord.address}`);
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    await speedRunRecord.deployTransaction.wait(6);
    await verify(speedRunRecord.address, args);
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