// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IReward {
    function recordDonation(address donator, uint256 amount) external;
}

interface IAdmin {
    function collectFee(uint256 _amount) external;
    function isAdminExist(address _admin) external view returns (bool);
}

contract CrowdFunding is Ownable {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        uint256 storedAmount;
        string image;
        address[] donators;
        uint256[] donations;
        bool isReleased;
    }

    IReward public reward;
    IAdmin public admin;
    address adminContract;
    mapping(uint256 => Campaign) private requestList;
    mapping(uint256 => Campaign) private campaigns;
    uint256 private numberOfRequest = 0;
    uint256 private numberOfCampaigns = 0;
    uint256 public fundLocked;

    constructor(address payable _rewardContract, address payable _adminContract) Ownable(msg.sender) {
        reward = IReward(_rewardContract);
        adminContract = _adminContract;
        admin = IAdmin(_adminContract);
    }

    receive() external payable {}

    modifier onlyAdmin {
        require(admin.isAdminExist(msg.sender), "You are not admin");
        _;
    }

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

    // Approve campaign from request list then create the campaign
    function approveRequest(uint256 _id) public onlyAdmin{
        require(_id <= numberOfRequest && _id >= 0, "Campaign not exist");
        Campaign memory campaign = requestList[_id];

        _createCampaign(campaign.owner, campaign.title, campaign.description, campaign.target, campaign.deadline, campaign.image);

        delete requestList[_id];
    }

    // Donate funds then record amount into Reward contract
    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent, ) = payable(address(this)).call{value: amount}("");

        require(sent, "Send Ether failed");

        fundLocked += amount; // mencatat donasi yang terkumpul
        campaign.amountCollected += amount;
        campaign.storedAmount += amount;
        reward.recordDonation(msg.sender, amount);
    }

    // Release funds to the campaign owner
    function releaseFunds(uint256 _id) external onlyAdmin payable {
        address _campaignOwner = campaigns[_id].owner;
        uint256 _storedAmount = campaigns[_id].storedAmount;

        require(_campaignOwner != address(0), "Can not send to address zero");
        require(_storedAmount != 0, "No funds can be released");

        uint256 _amountAfterFee = _storedAmount * 95 / 100; // platform fee = 5%
        uint256 _fee = _storedAmount - _amountAfterFee;
        
        (bool success, ) = payable(adminContract).call{value: _fee}(""); // send fee into Admin contract
        require(success, "Can not collect fee");
        admin.collectFee(_fee);

        (bool sent, ) = payable(_campaignOwner).call{value: _amountAfterFee}("");

        require(sent, "Release of funds failed");

        fundLocked -= _storedAmount;
        campaigns[_id].storedAmount = 0;
        campaigns[_id].isReleased = true;
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            if (item.isReleased == false) {
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
