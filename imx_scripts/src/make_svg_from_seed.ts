import { NFTStorage, File } from 'nft.storage';
import mime from 'mime';
import fs from 'fs';
import path from 'path';
import "dotenv/config";


const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlBNkI4ZjJiNzBhYzc3QThiOGNhQzNiMENCNjk3OGRkMTc2QzQ0MkQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NTIxMjI3Mzg3NiwibmFtZSI6ImV4cHJlc3MtanMtdXBsb2FkIn0.6o1xCl93ivlF1wJ5z4AOb7qpJHBAhxfiC7MJqU6ZkhY' // I dont have an API key yet :(

export async function storeNFT(imagePath: string, seed: string, id: string) {
  // load the file from disk
  const image = await fileFromPath(imagePath)

  // create a new NFTStorage client using our API key
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

  // call client.store, passing in the image & metadata
  // return nftstorage.storeBlob(image);
  const cid = (await nftstorage.storeBlob(image)).toString();
  const metadata = JSON.stringify({
    name: "Seed-" + seed + " Speedrun Record",
    image_url: "https://gateway.pinata.cloud/ipfs/" + cid
  })
  const metadataCid = (await nftstorage.storeBlob(new File([metadata], id, { type: "application/json" }))).toString();
  return [cid, metadataCid];
}

async function fileFromPath(filePath: string) {
  const content = await fs.promises.readFile(filePath);
  const type = mime.getType(filePath)!
  return new File([content], path.basename(filePath), { type })
}
// console.log(mime.getType("./src/tokenIdToSeed.json"));

export async function storeNFTDirectory(imagePath: string, seed: string, id: string) {
  // load the file from disk
  const image = await fileFromPath(imagePath)

  // create a new NFTStorage client using our API key
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

  // call client.store, passing in the image & metadata
  // return nftstorage.storeBlob(image);
  const cid = (await nftstorage.storeBlob(image)).toString();
  const metadata = JSON.stringify({
    name: "Seed-" + seed + " Speedrun Record",
    image_url: "https://gateway.pinata.cloud/ipfs/" + cid
  })
  let files: File[] = [];
  for (let x = 0; x < 1000; ++x) {
    files.push(new File([metadata], x.toString(), { type: "application/json" }));
  }
  const metadataCid = (await nftstorage.storeDirectory(files)).toString();
  return metadataCid;
}
(async () => {
  const cid = (await storeNFTDirectory("./src/record.svg", "156", "1453")).toString();
  console.log(cid);
})();

// (await storeNFTDirectory("./src/record.svg", "156", "1453")).toString();
