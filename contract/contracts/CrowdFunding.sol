// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CrowdFunding is Ownable {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    Reward public reward;

    constructor(address payable _rewardContract) Ownable(msg.sender) {
        reward = Reward(_rewardContract);
        admin[msg.sender] = true;
    }

    mapping (address => bool) public admin;

    uint256 public fundLocked;

    // membuat request list
    mapping(uint256 => Campaign) public requestList;
    uint256 public numberOfRequest = 0;

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    receive() external payable { }

    // Request Campaign
    function requestCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage request = requestList[numberOfRequest];

        require(_deadline > block.timestamp, "The deadline should be a date in the future.");

        request.owner = _owner;
        request.title = _title;
        request.description = _description;
        request.target = _target;
        request.deadline = _deadline;
        request.amountCollected = 0;
        request.image = _image;

        numberOfRequest++;

        return numberOfRequest - 1;
    }

    function _createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) internal returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(_deadline > block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    // Approve campaign from request list
    function approveRequest(uint256 _id) public {
        require(admin[msg.sender] == true, "You are not admin");
        require(_id <= numberOfRequest && _id >= 0, "Campaign not exist");
        Campaign memory campaign = requestList[_id];

        _createCampaign(campaign.owner, campaign.title, campaign.description, campaign.target, campaign.deadline, campaign.image);

        delete requestList[_id];
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent, ) = payable(address(this)).call{value: amount}("");

        require(sent, "Send Ether failed");

        fundLocked += amount; // mencatat donasi yang terkumpul
        campaign.amountCollected += amount;
        reward.recordDonation(msg.sender, amount);
    }

    // Release funding for campaign
    function releaseFunds(uint256 _id) public payable {
        address campaignOwner = campaigns[_id].owner;
        uint256 amountCollected = campaigns[_id].amountCollected;

        require(campaignOwner != address(0));

        (bool sent, ) = payable(campaignOwner).call{value: amountCollected}("");

        require(sent, "Release of funds failed");

        fundLocked -= amountCollected;
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            if (item.deadline > block.timestamp) {
                allCampaigns[i] = item;    
            }
            
        }

        return allCampaigns;
    }

    function getRequestList() public view returns (Campaign[] memory) {
        Campaign[] memory allRequests = new Campaign[](numberOfRequest);

        for (uint i = 0; i < numberOfRequest; i++) 
        {
            Campaign storage item = requestList[i];

            if (item.deadline > block.timestamp) {
                allRequests[i] = item;
            }

        }

        return allRequests;
    }
}

contract Reward is Ownable{
    enum Rarity {COMMON, UNCOMMON, RARE}
    struct Item {
        string name;
        string description;
        Rarity rarity;
        uint256 minAmount;
        uint256 remainingItem;
        string image;
        bool isNft;
    }

    constructor() Ownable(msg.sender) {
        
    }
    mapping (uint256 => Item) public rewardList;
    uint256 public numberOfReward;
    mapping (address => uint256) public donatorData;
    // mapping (address => Item[]) public claimHistory;

    // Menambahkan item
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

    // Catat donasi dari kontrak Crowdfunding
    function recordDonation(address donator, uint256 amount) external {
        donatorData[donator] += amount;
    }

    function claimReward(uint256 _id) public {
        uint256 minAmount = rewardList[_id].minAmount;
        address donator = msg.sender;

        require(donatorData[donator] >= minAmount , "The amount of your donation is insufficient.");

        donatorData[donator] -= minAmount;
        rewardList[_id].remainingItem -= 1;
    }
}