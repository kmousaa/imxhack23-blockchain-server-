import express from "express";
import fs from "fs";
import { storeNFT } from "./make_svg_from_seed";
import { mint_nfts } from "./my_mint";
import { get_nft_owner } from "./get_owner_of_nft";
import { get_owned_nfts } from "./get_my_nfts";
import { transfer_nft } from "./send_record_nft_to_new_holder";
import "dotenv/config";

const recordTokenIdToIPFS: {
    values: { [key: string]: string }
} = JSON.parse(fs.readFileSync("./src/completionTokenIdToIPFS.json").toString());
const completionTokenIdToIPFS: {
    values: { [key: string]: string }
} = JSON.parse(fs.readFileSync("./src/recordTokenIdToIPFS.json").toString());
const tokenIdToSeed: {
    values: { [key: string]: string }
} = JSON.parse(fs.readFileSync("./src/tokenIdToSeed.json").toString());
const seedToTokenId: {
    values: { [key: string]: string }
} = JSON.parse(fs.readFileSync("./src/seedToTokenId.json").toString());
const seedToFastestTime: {
    values: { [key: string]: string }
} = JSON.parse(fs.readFileSync("./src/seedToFastestTime.json").toString());
const app = express();
const PORT = process.env.PORT || 3000;

// detect json payload 
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('HELLO WORLD');
});

app.get('/Owner/:seed', async (req, res) => {
    const seed = req.params.seed
    const tokenId = seedToTokenId.values[seed];
    const ownerAddress = await get_nft_owner(tokenId);


    if (!seed) {
        return res.status(403).send({ 'success': false })
    }
    else if (typeof seed !== 'string') {
        return res.status(403).send({ 'success': false })
    }
    else {
        return res.status(201).send({
            ownerAddress,
            'success': true,
        })
    }
})


app.get('/Seeds/:key', async (req, res) => {
    const key = req.params.key
    const tokenIds = await get_owned_nfts(key);
    const seeds = tokenIds.map(id => tokenIdToSeed.values[id]);

    if (!key) {
        return res.status(403).send({ 'success': false })
    }
    else if (typeof key !== 'string') {
        return res.status(403).send({ 'success': false })
    }
    else {
        return res.status(201).send({
            seeds,
            'success': true
        })
    }
})

app.post('/mintSeed', async (req, res) => {
    // const { seed, publicKey } = req.body;
    const seed = req.query.seed?.toString()!;
    const publicKey = req.query.publicKey?.toString()!;
    const time = req.query.publicKey?.toString()!;
    const id = Math.floor(Math.random() * 1000).toString();
    // CREATE SVG FILES HERE
    const recordCIDs = await storeNFT("./src/record.svg", seed, id);
    const recordCID = recordCIDs[0];
    const recordMetadataCID = recordCIDs[1];
    console.log(recordMetadataCID);
    // const recordIPFSUrl = "http://ipfs.io/ipfs/" + recordCID.toString();
    const recordIPFSUrl = "https://gateway.pinata.cloud/ipfs/" + recordCID;
    const recordMetadataIPFSUrl = "https://gateway.pinata.cloud/ipfs/" + recordMetadataCID;
    const completionCIDs = await storeNFT("./src/completion.svg", "completion.svg", "You completed this level first!");
    const completionCID = completionCIDs[0];
    const completionMetadataCID = completionCIDs[1];
    console.log(completionMetadataCID);
    // const completionIPFSUrl = "http://ipfs.io/ipfs/" + completionCID.toString();
    const completionIPFSUrl = "https://gateway.pinata.cloud/ipfs/" + completionCID;
    const completionMetadataIPFSUrl = "https://gateway.pinata.cloud/ipfs/" + completionMetadataCID;
    const tokenIdArray = await mint_nfts(recordIPFSUrl, recordMetadataIPFSUrl, completionIPFSUrl, completionMetadataIPFSUrl, publicKey); // blueprint not being used atm
    const recordTokenId: string = tokenIdArray[0]!;
    const completionTokenId: string = tokenIdArray[0]!;
    recordTokenIdToIPFS.values[recordTokenId] = recordIPFSUrl;
    completionTokenIdToIPFS.values[completionTokenId] = completionIPFSUrl;
    tokenIdToSeed.values[completionTokenId] = seed;
    seedToTokenId.values[seed] = completionTokenId;
    seedToFastestTime.values[seed] = time;
    fs.writeFileSync("./src/recordTokenIdToIPFS.json", JSON.stringify(recordTokenIdToIPFS));
    fs.writeFileSync("./src/completionTokenIdToIPFS.json", JSON.stringify(completionTokenIdToIPFS));
    fs.writeFileSync("./src/tokenIdToSeed.json", JSON.stringify(tokenIdToSeed));
    fs.writeFileSync("./src/seedToTokenId.json", JSON.stringify(seedToTokenId));
    fs.writeFileSync("./src/seedToFastestTime.json", JSON.stringify(seedToFastestTime));
    return res.status(201).send({ 'success': true });
});

app.post("/levelComplete", async (req, res) => { // assume level has been completed before
    const seed = req.query.seed?.toString()!;
    const publicKey = req.query.publicKey?.toString()!;
    const time = req.query.time?.toString()!;
    // const tokenId = seedToTokenId.values[seed];
    const tokenId = "8741776544454944";
    if (!seedToFastestTime.values[seed] || parseInt(time) < parseInt(seedToFastestTime.values[seed])) {
        seedToFastestTime.values[seed] = time;
        transfer_nft(tokenId, publicKey);
    }
    return res.status(201).send({ 'success': true });
})

app.listen(PORT, () => console.log(`started and listening on port ${PORT}.`));