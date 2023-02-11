import { Link, ImmutableXClient, ImmutableMethodParams, ProviderPreference } from "@imtbl/imx-sdk";
import "dotenv/config";

async function main() {
  const ethNetwork = 'goerli'; // Or 'mainnet'
  const client = await ImmutableXClient.build({
    publicApiUrl: "https://api.sandbox.x.immutable.com/v1",
  });

  const link = new Link(process.env.REACT_APP_SANDBOX_LINK_URL);
  // const res = await link.setup({}); // not working :(
  const res = await link.setup({
    providerPreference: ProviderPreference.METAMASK,
  }); // not working :(
  const assets = await client.getAssets({ user: res.address });
  console.log(assets);
}




main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});