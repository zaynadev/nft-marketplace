import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";

export default function Marketplace() {
  const sampleData = [
    {
      name: "NFT#1",
      description: "Super Mario",
      website: "http://localhost",
      image: "https://gateway.pinata.cloud/ipfs/QmY8VNgpqnXT4kUaZMpGo3AQvwkeHpwymPs6QpvaQ8miXx",
      price: "0.03ETH",
      currentlySelling: "True",
      address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
      name: "NFT#2",
      description: "Yoshi",
      website: "http://localhost",
      image: "https://gateway.pinata.cloud/ipfs/QmY29apSSEbMqcaXj4cffeBzxrsc1J8ieq6PbenTLbowbP",
      price: "0.03ETH",
      currentlySelling: "True",
      address: "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
      name: "NFT#3",
      description: "Luigi",
      website: "http://localhost",
      image: "https://gateway.pinata.cloud/ipfs/QmYwWyw4S7yunAAAfod6xCQCuF858nm8Q1s8H87cpFUY5v",
      price: "0.03ETH",
      currentlySelling: "True",
      address: "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
  ];
  const [data, updateData] = useState(sampleData);

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex flex-col place-items-center mt-20">
        <div className="md:text-xl font-bold text-white">Top NFTs</div>
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
      </div>
    </div>
  );
}
