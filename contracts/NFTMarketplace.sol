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

    struct TokenList {
        uint256 tokenId;
        address owner;
        address seller;
        uint256 price;
        bool currentlyListed;
    }

    mapping(uint256 => TokenList) tokenLists;
    mapping(address => uint256) tokenBalance;
    mapping(address => uint256) funds;
    event TokenListed(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    constructor() ERC721("NFTMarketplace", "MKP") {
        owner = payable(msg.sender);
    }

    modifier ListedTokenExist(uint256 tokenId) {
        require(
            tokenLists[tokenId].owner != address(0),
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

    function getLatestListedToken() public view returns (TokenList memory) {
        return tokenLists[_tokenIds.current()];
    }

    function getListedToken(uint256 tokenId)
        public
        view
        ListedTokenExist(tokenId)
        returns (TokenList memory)
    {
        return tokenLists[tokenId];
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    function createToken(string memory _tokenURI, uint256 price)
        external
        payable
        returns (uint256)
    {
        require(msg.value == listPrice, "invalid balance for listing");
        require(price > 0, "price should be grather than 0");
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _safeMint(msg.sender, id);
        _setTokenURI(id, _tokenURI);
        tokenBalance[msg.sender]++;
        createTokenList(id, price);
        return id;
    }

    function createTokenList(uint256 tokenId, uint256 price) private {
        tokenLists[tokenId] = TokenList(
            tokenId,
            address(this),
            msg.sender,
            price,
            true
        );
        _transfer(msg.sender, address(this), tokenId);
    }

    function getAllNFTs() external view returns (TokenList[] memory) {
        uint256 allTokens = _tokenIds.current();
        uint256 numberOfTokensListed = allTokens - _itemsSold.current();
        TokenList[] memory tokens = new TokenList[](numberOfTokensListed);
        uint256 index;
        for (uint256 i = 1; i < allTokens; i++) {
            if (tokenLists[i].currentlyListed) {
                tokens[index] = tokenLists[i];
                index++;
            }
        }

        return tokens;
    }

    function getMyNFTs() external view returns (TokenList[] memory) {
        uint256 numberOfTokens = _tokenIds.current();
        uint256 userTokens = tokenBalance[msg.sender];
        TokenList[] memory tokens = new TokenList[](userTokens);
        uint256 index;
        for (uint256 i = 1; i <= numberOfTokens; i++) {
            if (tokenLists[i].seller == msg.sender) {
                tokens[index] = tokenLists[i];
                index++;
            }
        }
        return tokens;
    }

    function executeSale(uint256 tokenId) external payable {
        TokenList storage token = tokenLists[tokenId];
        require(
            token.currentlyListed && token.seller != address(0),
            "token does not exist"
        );
        require(msg.value == token.price, "invalid amount");
        _itemsSold.increment();
        tokenBalance[msg.sender]--;
        _transfer(address(this), msg.sender, tokenId);
        approve(address(this), tokenId);
        funds[owner] += listPrice;
        funds[token.seller] += token.price;
        token.currentlyListed = false;
        token.owner = payable(msg.sender);
        token.seller = payable(address(0));
    }

    function withdraw() external {
        uint256 balance = funds[msg.sender];
        require(balance > 0, "unsufficent balance");
        funds[msg.sender] = 0;
        (bool sent, ) = payable(msg.sender).call{value: balance}("");
        require(sent, "transfer failed");
    }
}
