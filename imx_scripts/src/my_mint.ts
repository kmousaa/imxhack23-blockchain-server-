import { ImmutableXClient, ImmutableMethodParams } from "@imtbl/imx-sdk";
import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import "dotenv/config";

async function main(tokenId: string, blueprint: string, user_public_key: string, nft_contract_address: string) {
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


  const tokens = ([{
    id: tokenId,
    blueprint: blueprint,
  }]);

  const payload: ImmutableMethodParams.ImmutableOffchainMintV2ParamsTS = [
    {
      contractAddress: nft_contract_address, // NOTE: a mintable token contract is not the same as regular erc token contract
      users: [
        {
          // etherKey: wallet.address.toLowerCase(),
          etherKey: user_public_key,
          tokens,
        },
      ],
    },
  ];

  const result = await minter.mintV2(payload);
  console.log(result);
}

main("11", "seed: 9999", "0xccccd34d9b6f962fb20be544a986712be5f99926", process.env.NFT_CONTRACT_ADDRESS!).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
