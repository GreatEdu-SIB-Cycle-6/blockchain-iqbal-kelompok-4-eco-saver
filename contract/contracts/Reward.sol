// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IEcoSaverNFT {
    function mint(address _to, string calldata _tokenURI) external;
}

contract Reward is Ownable{
    enum Rarity {LIMITED, RARE, COMMON}
    struct Item {
        string name;
        string description; 
        Rarity rarity;
        uint256 minAmount;
        uint256 remainingItem;
        string image; // If the reward is an NFT, this field must be filled with image URI of the NFT
        bool isNft;
    }

    IEcoSaverNFT private ecoSaverNFT;
    address public crowdFundingAddr;
    mapping (uint256 => Item) private rewardList;
    uint256 public numberOfReward;
    mapping (address => uint256) public donatorData;
    // mapping (address => Item[]) public claimHistory;

    constructor(address _ecoSaverNFT) Ownable(msg.sender) {
        ecoSaverNFT = IEcoSaverNFT(_ecoSaverNFT);
    }

    // Menambahkan item untuk reward
    function addItem(string calldata _name, string calldata _description, Rarity _rarity, uint256 _minAmount, uint256 _remainingItem, string calldata _image, bool _isNft) public onlyOwner returns(uint256) {
        Item storage item = rewardList[numberOfReward];

        item.name = _name;
        item.description = _description;
        item.rarity = _rarity;
        item.minAmount = _minAmount;
        item.remainingItem = _remainingItem;
        item.image = _image;
        item.isNft = _isNft;

        numberOfReward++;
        return numberOfReward - 1;
    }

    // Catat jumlah donasi tiap user
    function recordDonation(address donator, uint256 amount) external {
        require(msg.sender == crowdFundingAddr, "Forbidden access");
        donatorData[donator] += amount;
    }

    function claimReward(uint256 _id) public {
        uint256 minAmount = rewardList[_id].minAmount;
        address donator = msg.sender;

        require(donatorData[donator] >= minAmount , "The amount of your donation is insufficient.");
        bool isNft = rewardList[_id].isNft;
        
        if (isNft) {
            string memory _imageURI = rewardList[_id].image;
            ecoSaverNFT.mint(msg.sender, _imageURI);
        } else {
            donatorData[donator] -= minAmount;
            rewardList[_id].remainingItem -= 1;
        }

    }

    
}