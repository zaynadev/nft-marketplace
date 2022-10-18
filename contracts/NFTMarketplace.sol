//SPDX-License-Identifier: unlicensed

pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    Counters.Counter private _itemsSold;

    uint listingPrice = 0.001 ether;

    struct MarketItem{
        uint tokenId;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;
    }

    mapping(uint => MarketItem) private idToMarketItem;

    event MarketItemCreated(
        uint indexed tokenId,
        address seller,
        address owner,
        uint price,
        bool sold
    );

    constructor() ERC721("My NFTs", "MNFTS"){}

    function getListingPrice() public view returns(uint){
        return listingPrice;
    }

    function updateListingPrice(uint _listingPrice) public onlyOwner {
        listingPrice = _listingPrice;
    }

    function createToken(string memory tokenURI, uint price) public payable returns(uint){
        require(msg.value == listingPrice, "wrong listing price amount!");
        require(price > 0, "price should be greater than 0!");
        _tokenId.increment();
        uint newTokenId = _tokenId.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _createMarketItem(newTokenId, price);
        return newTokenId;
    }

    function createMarketSale(uint tokenId) public payable {
        MarketItem memory item = idToMarketItem[tokenId];
        require(item.sold == false, "item sold!");
        require(item.seller != address(0), "token does not exist!");
        require(msg.value == item.price, "wrog token price!");

        item.seller.transfer(msg.value);
        item.seller = payable(address(0));
        item.owner = payable(msg.sender);
        item.sold = true;
        idToMarketItem[tokenId] = item;

        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);
        

    }

    function resellToken(uint tokenId, uint price) public payable {
        require(price > 0, "price should be greater than 0!");
        require(msg.value == listingPrice, "wrong listing price amount!");
        require(idToMarketItem[tokenId].owner == msg.sender, "only owner can resell the token");
        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _itemsSold.decrement();
        _transfer(msg.sender, address(this), tokenId);
    }

    function fetchMarketItems() public view returns(MarketItem[] memory){
        uint itemCount = _tokenId.current();
        uint unsoldItems = itemCount - _itemsSold.current();
        uint currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](unsoldItems);
        for(uint i = 1; i <= itemCount; i++){
            if(idToMarketItem[i].sold == false && idToMarketItem[i].owner == address(this)){
                items[currentIndex] = idToMarketItem[i];
                currentIndex ++;
            }
        }

        return items;
    }

    function fetchMyItems() public view returns(MarketItem[] memory){
        uint itemsBalance = super.balanceOf(msg.sender);
        uint itemCount = _tokenId.current();
        uint currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](itemsBalance);
        for(uint i = 1; i <= itemCount; i++){
            if(idToMarketItem[i].sold == true && idToMarketItem[i].owner == msg.sender){
                items[currentIndex] = idToMarketItem[i];
                currentIndex ++;
            }
        }
        return items;
    }

        function fetchItemsListed() public view returns(MarketItem[] memory){
        uint itemCount = _tokenId.current();
        uint currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint i = 1; i <= itemCount; i++){
            if(idToMarketItem[i].sold == false && idToMarketItem[i].seller == msg.sender){
                items[currentIndex] = idToMarketItem[i];
                currentIndex ++;
            }
        }
        return items;
    }

    function _createMarketItem(uint tokenId, uint price) internal{
        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );
        _transfer(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    
}