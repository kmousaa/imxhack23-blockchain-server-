import { ImmutableXClient, ImmutableMethodParams } from "@imtbl/imx-sdk";
import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import "dotenv/config";

export async function get_nft_owner(tokenId: string) {
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

  return (await client.getAsset({
    address: process.env.RECORD_NFT_CONTRACT_ADDRESS!,
    id: tokenId
  })).user;
}
