//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    uint256 listPrice = 0.0001 ether;
    address payable owner;

    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool listed;
    }

    mapping(uint256 => ListedToken) idToListenTokens;

    constructor() ERC721("NFTMarketplace", "MKP") {
        owner = payable(msg.sender);
    }

    modifier ListedTokenExist(uint256 tokenId) {
        require(
            idToListenTokens[tokenId].owner != address(0),
            "This token is not listed"
        );
        _;
    }

    function updateListPrice(uint256 _listPrice) external onlyOwner {
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestListedToken() public view returns (ListedToken memory) {
        return idToListenTokens[_tokenIds.current()];
    }

    function getListedToken(uint256 tokenId)
        public
        view
        ListedTokenExist(tokenId)
        returns (ListedToken memory)
    {
        return idToListenTokens[tokenId];
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }
}
