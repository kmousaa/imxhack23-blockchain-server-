import { ImmutableXClient, ImmutableMethodParams } from "@imtbl/imx-sdk";
import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import "dotenv/config";

async function main(tokenId: string) {
  const ethNetwork = 'goerli'; // Or 'mainnet'
  const provider = new AlchemyProvider(ethNetwork, process.env.ALCHEMY_API_KEY);
  const wallet = new Wallet(process.env.PRIVATE_ETH_KEY!);
  const ethSigner = wallet.connect(provider);
  const client = await ImmutableXClient.build({
    publicApiUrl: "https://api.sandbox.x.immutable.com/v1",
    starkContractAddress: process.env.SANDBOX_STARK_CONTRACT_ADDRESS,
    registrationContractAddress: "0x1C97Ada273C9A52253f463042f29117090Cd7D83",
    gasLimit: "7000000",
    gasPrice: "40000000000",
    signer: ethSigner
  });
  const asset = await client.getAsset({
    address: "0x9bcba45f0e36cf8421738525d6d75ac6c4af3a20",
    id: "44"
  })
  console.log(asset);
  console.log(await client.getAsset({
    address: process.env.NFT_CONTRACT_ADDRESS!,
    id: "11"
  }))

  // const tokens = ([{
  //   id: tokenId,
  //   blueprint: ""
  // }])

  // client.mintV2([{
  //   users: [
  //     {
  //       etherKey: "0x172A32094f7558575fe03075883C0bE896b6346f",
  //       tokens
  //     }]
  // }])
}

main("").catch((error) => {
  console.error(error);
  process.exitCode = 1;
});