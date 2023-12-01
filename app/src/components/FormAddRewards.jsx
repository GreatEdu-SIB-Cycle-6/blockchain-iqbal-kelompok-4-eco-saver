import React, { useState } from "react";
import { useStateContext } from "../context";
import { ethers } from "ethers";

import { checkIfImage } from "../utils";
import Loader from "./Loader";

const rewardsAddRewards = () => {
  const { addItem, addMetadata } = useStateContext();
  const [isImageNft, setIsImageNft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rewards, setRewards] = useState({
    name: "",
    description: "",
    rarity: 0,
    minAmount: "",
    remaintingItem: "",
    image: "",
    isNft: false,
  });
  const [metadata, setMetadata] = useState({
    imgUri: "",
    tokenUri: "",
  });

  const handleRewards = (fieldRewards, event) => {
    setRewards({ ...rewards, [fieldRewards]: event.target.value });
  };

  const handleAddRewards = (event) => {
    event.preventDefault();

    checkIfImage(rewards.image, async (exist) => {
      if (exist) {
        setIsLoading(true);
        await addItem({
          ...rewards,
          minAmount: ethers.utils.parseUnits(rewards.minAmount, 18),
        });
        setIsLoading(false);
      } else {
        alert("Masukkan link gambar yang valid!");
        setRewards({ ...rewards, image: "" });
      }
    });
  };

  const handleMetaData = (fieldMetadata, event) => {
    setMetadata({ ...metadata, [fieldMetadata]: event.target.value });
  };

  const handleAddMetaData = async () => {
    try {
      if (metadata.imgUri && metadata.tokenUri) {
        await addMetadata(metadata);
        setMetadata({ imgUri: "", tokenUri: "" });
      }
    } catch (error) {
      console.error("Error adding metadata:", error);
    }
  };

  const handleNftChange = (value) => {
    setIsImageNft(value === "yes");
    setRewards({ ...rewards, isNft: value === "yes" });
  };

  return (
    <div className="rounded-[10px] font-poppins max-w-4xl mx-auto w-screen flex flex-col items-center justify-center border border-[#14213d]">
      {isLoading && <Loader />}
      <div className="my-6">
        <h1 className="text-white text-[40px] font-poppins">
          Add Rewards Dashboard
        </h1>
      </div>
      <form onSubmit={handleAddRewards} className="w-full grid gap-2 px-4">
        <div className="flex justify-between items-center">
          <label className="w-32 text-right pr-4 font-medium text-gray-500">
            Name
          </label>
          <div className="flex-1">
            <input
              type="text"
              required
              className="w-full rounded-md appearance-none border border-gray-300
                    py-2 px-2 bg-white text-gray-500 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600
                    focus:border-tranparent"
              placeholder="Name"
              value={rewards.name}
              onChange={(event) => handleRewards("name", event)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <label className="w-32 text-right pr-4 font-medium text-gray-500">
            Description
          </label>
          <div className="flex-1">
            <input
              type="text"
              required
              className="w-full rounded-md appearance-none border border-gray-300
                    py-2 px-2 bg-white text-gray-500 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600
                    focus:border-tranparent"
              placeholder="Description"
              value={rewards.description}
              onChange={(event) => handleRewards("description", event)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <label className="w-32 text-right pr-4 font-medium text-gray-500">
            Min Amount
          </label>
          <div className="flex-1">
            <input
              type="number"
              // min="0"
              // step="0.1"
              required
              className="w-full rounded-md appearance-none border border-gray-300
                    py-2 px-2 bg-white text-gray-500 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600
                    focus:border-tranparent"
              placeholder="Min amount"
              value={rewards.minAmount}
              onChange={(event) => handleRewards("minAmount", event)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <label className="w-32 text-right pr-4 font-medium text-gray-500">
            Stock Item
          </label>
          <div className="flex-1">
            <input
              type="number"
              min="0"
              step="1"
              required
              className="w-full rounded-md appearance-none border border-gray-300
                    py-2 px-2 bg-white text-gray-500 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600
                    focus:border-tranparent"
              placeholder="Stock item"
              value={rewards.remaintingItem}
              onChange={(event) => handleRewards("remaintingItem", event)}
            />
          </div>
        </div>
        <div className="flex justify-start items-center focus:ring-primary-500 focus:border-primary-500">
          <label className="w-32 text-right pr-4 font-medium text-gray-500">
            Rarity
          </label>
          <select
            className="focus:outline-none focus:ring-2 focus:ring-sky-600 w-52 text-gray-500
                py-2 px-3 border border-gray-300 bg-white rounded-md"
            value={rewards.rarity}
            onChange={(event) => handleRewards("rarity", event)}
          >
            <option value={0}>Common</option>
            <option value={1}>Rare</option>
            <option value={2}>Limited</option>
          </select>
        </div>
        <div className="flex justify-between items-center">
          <label className="w-32 text-right pr-4 font-medium text-gray-500">
            Image Url
          </label>
          <div className="flex-1">
            <input
              type="url"
              required
              className="w-full rounded-md appearance-none border border-gray-300
                    py-2 px-2 bg-white text-gray-500 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600
                    focus:border-tranparent"
              placeholder="Img url"
              value={rewards.image}
              onChange={(event) => handleRewards("image", event)}
            />
          </div>
        </div>
        <div className="flex justify-start items-center">
          <div className="w-32 text-right pr-4 font-medium text-gray-500">
            Is Nft?
          </div>
          <div className="flex items-center mr-4">
            <input
              name="isImageNft"
              type="radio"
              className=" focus:ring-sky-600 h-4 w-4 text-sky-600 border-gray-300
              "
              value="yes"
              onChange={(event) => handleNftChange(event.target.value)}
            />
            <label className="ml-1 block text-gray-500">Yes</label>
          </div>
          <div className="flex items-center">
            <input
              name="isImageNft"
              type="radio"
              className="focus:ring-sky-600 h-4 w-4 text-sky-600 border-gray-300"
              value="no"
              onChange={(event) => {
                handleRewards("image", event);
                handleNftChange(event.target.value);
              }}
            />
            <label className="ml-1 block text-gray-500">No</label>
          </div>
        </div>
        {isImageNft ? (
          <div className="pb-[20px]">
            <div className="flex justify-between items-center"></div>
            <p className="items-center flex justify-center mb-4 text-[20px] text-white">
              Add Metadata
            </p>
            <div className="flex justify-between items-center">
              <label className="w-32 text-right pr-4 font-medium text-gray-500">
                Image URI
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  required
                  className="w-full rounded-md appearance-none border border-gray-300
                    py-2 px-2 bg-white text-gray-500 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600
                    focus:border-tranparent"
                  placeholder="Image URI"
                  value={metadata.imgUri}
                  onChange={(event) => handleMetaData("imgUri", event)}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <label className="w-32 text-right pr-4 mb-12 font-medium text-gray-500">
                Token URI
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  required
                  className="w-full mt-2 rounded-md appearance-none border border-gray-300
                    py-2 px-2 bg-white text-gray-500 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600
                    focus:border-tranparent"
                  placeholder="ipfs://"
                  value={metadata.tokenUri}
                  onChange={(event) => handleMetaData("tokenUri", event)}
                />
                <button
                  type="submit"
                  className="py-2 px-2 border border-gray-300 rounded-md mt-4
            shadow-md font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2
            bg-sky-600 focus:ring-sky-600"
                  onClick={handleAddMetaData}
                >
                  Add Rewards
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              type="submit"
              className="py-2 px-2 border border-gray-300 rounded-md mb-4
            shadow-md font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2
            bg-sky-600 focus:ring-sky-600"
            >
              Add Rewards
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default rewardsAddRewards;
