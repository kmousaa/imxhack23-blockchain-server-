import { Link, ImmutableXClient, ImmutableMethodParams } from "@imtbl/imx-sdk";
import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import "dotenv/config";

async function main() {
  const ethNetwork = 'goerli'; // Or 'mainnet'
  const provider = new AlchemyProvider(ethNetwork, process.env.ALCHEMY_API_KEY);
  const wallet = new Wallet(process.env.PRIVATE_ETH_KEY!);
  const client = await ImmutableXClient.build({
    publicApiUrl: "https://api.sandbox.x.immutable.com/v1",
  });

  const link = new Link(process.env.REACT_APP_SANDBOX_LINK_URL);
  const res = await link.setup({});
  const assets = await client.getAssets({ user: res.address });
  console.log(assets);
}




main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});