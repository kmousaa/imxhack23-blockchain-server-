import { ImmutableXClient, ImmutableMethodParams, ETHTokenType, ERC721TokenType } from "@imtbl/imx-sdk";
import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImmutableX, Config, createStarkSigner, TokenAmount, UnsignedTransferRequest } from "@imtbl/core-sdk";
import "dotenv/config";

export async function transfer_nft(tokenId: string, user_public_key: string) {
  const config = Config.SANDBOX; // Or Config.PRODUCTION
  const client = new ImmutableX(config);


  const ethNetwork = 'goerli'; // Or 'mainnet'
  const provider = new AlchemyProvider(ethNetwork, process.env.ALCHEMY_API_KEY);
  const wallet = new Wallet(process.env.SECOND_ACCOUNT_PRIVATE_ETH_KEY!);
  const ethSigner = wallet.connect(provider);

  const starkPrivateKey = process.env.SECOND_ACCOUNT_STARK_PRIVATE_KEY!;
  console.log(`starkPrivateKey: ${starkPrivateKey}`);
  const starkSigner = createStarkSigner(starkPrivateKey);

  const walletConnection = { ethSigner, starkSigner }

  const asset = await client.getAsset({
    tokenAddress: "0x4AFdB479275d2DA24642Bfde6235114c19499F48",
    tokenId: "8741776544454944"
  })
  console.log(asset);

  const unsignedTransferRequest: UnsignedTransferRequest = {
    type: "ERC721",
    tokenId: "8741776544454944",
    tokenAddress: "0x4AFdB479275d2DA24642Bfde6235114c19499F48",
    receiver: "0x4BF69D0962979A8288c46e8587Ff709ba6261337"
  }

  const transfer = await client.transfer(walletConnection, unsignedTransferRequest);
  console.log(transfer);
}