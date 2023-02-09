import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from "../Marketplace.json";
import { useLocation } from "react-router";
import { redirect } from "react-router-dom";

export default function SellNFT() {
  const [formParams, updateFormParams] = useState({ name: "", description: "", price: "" });
  const [fileURL, setFileURL] = useState(null);
  const [message, updateMessage] = useState("");
  const location = useLocation();
  const ethers = require("ethers");

  const onChangeFile = async (e) => {
    const file = e.target.files[0];
    console.log({ file });
    try {
      const response = await uploadFileToIPFS(file);
      if (response.success) {
        console.log(`file uploaded to ${response.pinataURL}`);
        setFileURL(response.pinataURL);
      }
    } catch (error) {
      console.log("error while upload image ", error);
    }
  };

  const uploadMetadataToIPFS = async () => {
    const { name, description, price } = formParams;
    if (!name || !description || !price || !fileURL) return;
    const jsonData = { name, description, price, image: fileURL };
    try {
      const { success, pinataURL } = await uploadJSONToIPFS(jsonData);
      if (success) {
        console.log(`Json uploaded to ${pinataURL}`);
        return pinataURL;
      }
    } catch (error) {
      console.log("error while upload json metadata ", error);
    }
  };

  const listNFT = async (e) => {
    e.preventDefault();
    try {
      const metadataURL = await uploadMetadataToIPFS();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      updateMessage("Please wait while uploading ...");

      let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);
      const price = ethers.utils.parseEther(formParams.price);
      const listingPrice = (await contract.getListPrice()).toString();
      console.log({ listingPrice });
      const transation = await contract.createToken(metadataURL, price, { value: listingPrice });
      await transation.wait();
      alert("Successfuly listed your nft");
      updateMessage("");
      updateFormParams({ name: "", description: "", price: "" });
      redirect("/");
    } catch (error) {
      console.log("error while list NFT ", error);
    }
  };

  return (
    <div className="">
      <Navbar></Navbar>
      <div className="flex flex-col place-items-center mt-10" id="nftForm">
        <form onSubmit={listNFT} className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
          <h3 className="text-center font-bold text-purple-500 mb-8">
            Upload your NFT to the marketplace
          </h3>
          <div className="mb-4">
            <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">
              NFT Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Axie#4563"
              onChange={(e) => updateFormParams({ ...formParams, name: e.target.value })}
              value={formParams.name}
            ></input>
          </div>
          <div className="mb-6">
            <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="description">
              NFT Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              cols="40"
              rows="5"
              id="description"
              type="text"
              placeholder="Axie Infinity Collection"
              value={formParams.description}
              onChange={(e) => updateFormParams({ ...formParams, description: e.target.value })}
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">
              Price (in ETH)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Min 0.01 ETH"
              step="0.01"
              value={formParams.price}
              onChange={(e) => updateFormParams({ ...formParams, price: e.target.value })}
            ></input>
          </div>
          <div>
            <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="image">
              Upload Image
            </label>
            <input type={"file"} onChange={onChangeFile}></input>
          </div>
          <br></br>
          <div className="text-green text-center">{message}</div>
          <button
            onClick={""}
            className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg"
          >
            List NFT
          </button>
        </form>
      </div>
    </div>
  );
}
