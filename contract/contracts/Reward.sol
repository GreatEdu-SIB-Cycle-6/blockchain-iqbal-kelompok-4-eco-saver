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

    event ItemAdded(string _name, string _description, Rarity _rarity, uint256 _minAmount, uint256 _remainingItem, string _image, bool _isNft);
    event RewardClaimed(address _recipient, uint256 _rewardId);

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

        emit ItemAdded(_name, _description, _rarity, _minAmount, _remainingItem, _image, _isNft);
        return numberOfReward - 1;
    }

    // Catat jumlah donasi tiap user
    function recordDonation(address donator, uint256 amount) external {
        require(msg.sender == crowdFundingAddr, "Forbidden access");
        donatorData[donator] += amount;
    }

    function claimReward(uint256 _id) external {
        uint256 _minAmount = rewardList[_id].minAmount;
        address _donator = msg.sender;

        require(donatorData[_donator] >= _minAmount , "The amount of your donation is insufficient.");
        bool isNft = rewardList[_id].isNft;
        
        if (isNft) {
            string memory _imageURI = rewardList[_id].image;
            ecoSaverNFT.mint(msg.sender, _imageURI);
        } else {
            donatorData[_donator] -= _minAmount;
            rewardList[_id].remainingItem -= 1;
        }
        
        emit RewardClaimed(_donator, _id);
    }

    function setCrowdFundingAddr(address _crowdfunding) external onlyOwner {
        crowdFundingAddr = _crowdfunding;
    }

    
}
