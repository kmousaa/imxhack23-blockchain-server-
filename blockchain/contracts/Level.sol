// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@chainlink/contracts/";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Mintable.sol";

contract Level is ERC721URIStorage, Mintable {
    string public constant TOKEN_URI =
        "https://ipfs.io/ipfs/bafyreiggzjanzlnhgwh5djsk5bm27sf5tt4xl7juzhqitee2mb52v6vkyq/metadata.json";

    constructor(
        address _owner,
        string memory _name,
        string memory _symbol,
        address _imx
    ) ERC721(_name, _symbol) Mintable(_owner, _imx) {}

    function _mintFor(
        address user,
        uint256 id,
        bytes memory blueprint
    ) internal override {
        _safeMint(user, id);
        _setTokenURI(id, TOKEN_URI);
        // TODO: Do something with blueprint :)
    }
}
