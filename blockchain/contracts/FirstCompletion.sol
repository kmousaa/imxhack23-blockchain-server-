// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@chainlink/contracts/";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Mintable.sol";

contract FirstCompletion is ERC721URIStorage, Mintable {
    constructor(
        address _owner,
        string memory _name,
        string memory _symbol,
        address _imx
    ) ERC721(_name, _symbol) Mintable(_owner, _imx) {}

    function _mintFor(
        address user,
        uint256 tokenId,
        bytes memory blueprint
    ) internal override {
        _safeMint(user, tokenId);
        _setTokenURI(tokenId, string(blueprint));
    }
}
