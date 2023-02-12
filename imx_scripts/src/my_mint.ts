import { ImmutableXClient, ImmutableMethodParams } from "@imtbl/imx-sdk";
import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import "dotenv/config";

export async function mint_nfts(recordBlueprint: string, recordMetadataIPFSUrl: string, completionBlueprint: string, completionMetadataIPFSUrl: string, user_public_key: string) {
  const ethNetwork = 'goerli'; // Or 'mainnet'
  const provider = new AlchemyProvider(ethNetwork, process.env.ALCHEMY_API_KEY);
  const wallet = new Wallet(process.env.PRIVATE_ETH_KEY!);
  const ethSigner = wallet.connect(provider);
  const minter = await ImmutableXClient.build({
    publicApiUrl: "https://api.sandbox.x.immutable.com/v1",
    starkContractAddress: process.env.SANDBOX_STARK_CONTRACT_ADDRESS,
    registrationContractAddress: "0x1C97Ada273C9A52253f463042f29117090Cd7D83",
    gasLimit: "7000000",
    gasPrice: "40000000000",
    signer: ethSigner
  })

  const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER + 1).toString();
  const recordTokens = ([{
    id,
    blueprint: recordBlueprint,
  }]);
  const completionTokens = ([{
    id,
    blueprint: completionBlueprint,
  }]);

  const recordUpdateCollectionResponse = await minter.updateCollection(process.env.RECORD_NFT_CONTRACT_ADDRESS!, { metadata_api_url: recordMetadataIPFSUrl })
  console.log(recordUpdateCollectionResponse);
  const completionUpdateCollectionResponse = await minter.updateCollection(process.env.COMPLETION_NFT_CONTRACT_ADDRESS!, { metadata_api_url: completionMetadataIPFSUrl })
  console.log(completionUpdateCollectionResponse);


  const recordPayload: ImmutableMethodParams.ImmutableOffchainMintV2ParamsTS = [
    {
      contractAddress: process.env.RECORD_NFT_CONTRACT_ADDRESS!, // NOTE: a mintable token contract is not the same as regular erc token contract
      users: [
        {
          // etherKey: wallet.address.toLowerCase(),
          etherKey: user_public_key,
          tokens: recordTokens,
        },
      ],
    },
  ];

  const completionPayload: ImmutableMethodParams.ImmutableOffchainMintV2ParamsTS = [
    {
      contractAddress: process.env.COMPLETION_NFT_CONTRACT_ADDRESS!, // NOTE: a mintable token contract is not the same as regular erc token contract
      users: [
        {
          // etherKey: wallet.address.toLowerCase(),
          etherKey: user_public_key,
          tokens: completionTokens,
        },
      ],
    },
  ];

  const recordResult = await minter.mintV2(recordPayload);
  const completionResult = await minter.mintV2(completionPayload);
  console.log(recordResult);
  console.log(completionResult);
  return [recordResult.results[0]?.token_id, completionResult.results[0]?.token_id];
}
