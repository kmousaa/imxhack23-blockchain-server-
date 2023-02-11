import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL!;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY!;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [METAMASK_PRIVATE_KEY],
      chainId: 5,
    },
    localHost: { // Use by running npx hardhat node in terminal
      url: "http://127.0.0.1:8545",
      // accounts already provided by Hardhat Network
      chainId: 31337,
    }
  },
  solidity: "0.8.17",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
};

export default config;
