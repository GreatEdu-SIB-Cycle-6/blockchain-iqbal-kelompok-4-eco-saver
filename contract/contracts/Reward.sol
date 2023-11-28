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
    struct Claim {
        address claimant;
        string shipAddress;
        Item item;
        uint256 claimDate;
    }

    IEcoSaverNFT public ecoSaverNFT;
    address public crowdFundingAddr;
    Item[] private rewardList;
    mapping (address => uint256) private donatorData;
    Claim[] private shippingHistory;

    constructor() Ownable(msg.sender) {}

    event ItemAdded(string _name, string _description, Rarity _rarity, uint256 _minAmount, uint256 _remainingItem, string _image, bool _isNft);
    event RewardClaimed(address _recipient, uint256 _rewardId, uint256 _claimDate);

    // Menambahkan item untuk reward
    function addItem(string calldata _name, string calldata _description, Rarity _rarity, uint256 _minAmount, uint256 _remainingItem, string calldata _image, bool _isNft) public onlyOwner returns(uint256) {

        rewardList.push(Item({
            name: _name,
            description: _description,
            rarity: _rarity,
            minAmount: _minAmount,
            remainingItem: _remainingItem,
            image: _image,
            isNft: _isNft
        }));

        emit ItemAdded(_name, _description, _rarity, _minAmount, _remainingItem, _image, _isNft);
        return rewardList.length - 1;
    }

    // Catat jumlah donasi tiap user
    function recordDonation(address donator, uint256 amount) external {
        require(msg.sender == crowdFundingAddr, "Forbidden access");
        donatorData[donator] += amount;
    }

    // Claim a reward then record into claimHistory
    function claimReward(uint256 _id, string memory _shipAddress) external {
        Item storage reward = rewardList[_id];
        require(reward.remainingItem > 0, "Selected item is out of stock");
        uint256 _minAmount = reward.minAmount;
        address _donator = msg.sender;

        require(donatorData[_donator] >= _minAmount , "The amount of your donation is insufficient.");
        bool isNft = reward.isNft;
        
        if (isNft) {
            string memory _imageURI = reward.image;
            ecoSaverNFT.mint(msg.sender, _imageURI);
            donatorData[_donator] -= _minAmount;
            reward.remainingItem -= 1;
        } else {
            donatorData[_donator] -= _minAmount;
            reward.remainingItem -= 1;
            shippingHistory.push(Claim({
                claimant: _donator,
                shipAddress: _shipAddress,
                item: reward,
                claimDate: block.timestamp
            }));
        }
        
        emit RewardClaimed(_donator, _id, block.timestamp);
    }

    // Delete reward by id
    function deleteReward(uint256 _id) external onlyOwner {
        rewardList[_id] = rewardList[(rewardList.length - 1)];
        rewardList.pop();
    }

    // ecoSaverNFT must be set first with EcoSaverNFT contract address
    function setEcoSaverNFT(address _ecoSaverNFT) external onlyOwner {
        ecoSaverNFT = IEcoSaverNFT(_ecoSaverNFT);
    }

    // crowdFundingAddr must be set first with CrowdFunding contract address
    function setCrowdFundingAddr(address _crowdfunding) external onlyOwner {
        crowdFundingAddr = _crowdfunding;
    }

    // get all reward item
    function getRewardList() external view returns (Item[] memory) {
        return rewardList;
    }

    // get reward data by id
    function getReward(uint256 _id) external view returns (Item memory) {
        return rewardList[_id];
    }

    // get claim history
    function getShippingHistory() external view returns (Claim[] memory) {
        return shippingHistory;
    }

    // get donator data by address
    function getDonatorData(address _donator) external view returns (uint256){
        return donatorData[_donator];
    }
    
}
