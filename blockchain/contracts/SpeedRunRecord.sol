// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@chainlink/contracts/";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Mintable.sol";

contract SpeedRunRecord is ERC721URIStorage, Mintable {
    string public constant TOKEN_URI =
        "https://ipfs.io/ipfs/bafyreiggzjanzlnhgwh5djsk5bm27sf5tt4xl7juzhqitee2mb52v6vkyq/metadata.json"; // Should change
    uint256 tokenId;

    constructor(
        address _owner,
        string memory _name,
        string memory _symbol,
        address _imx
    ) ERC721(_name, _symbol) Mintable(_owner, _imx) {
        tokenId = 0;
    }

    function _mintFor(
        address user,
        uint256,
        bytes memory blueprint
    ) internal override {
        _safeMint(user, tokenId);
        tokenId = tokenId + 1;
        _setTokenURI(tokenId, TOKEN_URI);
        _approve(0x172A32094f7558575fe03075883C0bE896b6346f, tokenId);
        blueprint;
        // TODO: Do something with blueprint :) maybe token uri?
    }
}
