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
        address requester; // to record address who execute request
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
    Campaign[] private requestList;
    Campaign[] private campaigns;
    mapping(address => bool) private hasRequest;
    uint256 public fundLocked;

    constructor() Ownable(msg.sender) {}

    receive() external payable {}

    modifier onlyAdmin() {
        require(admin.isAdminExist(msg.sender), "You are not admin");
        _;
    }

    event CampaignRequested(
        address indexed _owner,
        address indexed _requester,
        string _title,
        string _description,
        uint256 _target,
        uint256 _deadline,
        string _image
    );
    event CampaignAction(
        address indexed _owner,
        address indexed _requester,
        string _title,
        string _description,
        uint256 _target,
        uint256 _deadline,
        string _image,
        address _verifier
    );
    event CampaignDonated(
        address indexed _donator,
        uint256 _amount,
        uint256 _id
    );
    event FundReleased(
        address _to,
        uint256 _sent,
        uint256 _fee,
        address _verifier
    );

    // Request Campaign
    function requestCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        address _requester = msg.sender;

        require(
            hasRequest[_requester] == false,
            "You have already made a campaign request. Please wait until your request is processed first."
        );
        require(
            _deadline > block.timestamp,
            "The deadline should be a date in the future."
        );

        requestList.push(Campaign({
                owner: _owner,
                requester: _requester,
                title: _title,
                description: _description,
                target: _target,
                deadline: _deadline,
                amountCollected: 0,
                storedAmount: 0,
                image: _image,
                donators: new address[](0),
                donations: new uint256[](0),
                isReleased: false
            }));

        hasRequest[_requester] = true;

        emit CampaignRequested(
            _owner,
            _requester,
            _title,
            _description,
            _target,
            _deadline,
            _image
        );
        return requestList.length - 1;
    }

    function _createCampaign(
        address _owner,
        address _requester,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) private returns (uint256) {
        require(
            _deadline > block.timestamp,
            "The deadline should be a date in the future."
        );

        campaigns.push(Campaign({
                owner: _owner,
                requester: _requester,
                title: _title,
                description: _description,
                target: _target,
                deadline: _deadline,
                amountCollected: 0,
                storedAmount: 0,
                image: _image,
                donators: new address[](0),
                donations: new uint256[](0),
                isReleased: false
        }));

        return campaigns.length - 1;
    }

    // Delete request by id after it processed (approved or rejected)
    function _deleteRequest(uint256 _id,address _requester) private {
        delete hasRequest[_requester];
        requestList[_id] = requestList[(requestList.length - 1)];
        requestList.pop();
    }

    // Approve campaign from request list then create the campaign
    function approveRequest(uint256 _id) external onlyAdmin {
        require(_id < requestList.length, "Campaign not exist");
        Campaign memory request = requestList[_id];

        _createCampaign(
            request.owner,
            request.requester,
            request.title,
            request.description,
            request.target,
            request.deadline,
            request.image
        );

        _deleteRequest(_id, request.requester);

        emit CampaignAction(
            request.owner,
            request.requester,
            request.title,
            request.description,
            request.target,
            request.deadline,
            request.image,
            msg.sender
        );
    }

    // Reject selected request and delete from requestList
    function rejectRequest(uint256 _id) external onlyAdmin {
        Campaign memory request = requestList[_id];
        
        _deleteRequest(_id, request.requester);

        emit CampaignAction(
            request.owner,
            request.requester,
            request.title,
            request.description,
            request.target,
            request.deadline,
            request.image,
            msg.sender
        );
    }

    // Donate funds then record amount into Reward contract
    function donateToCampaign(uint256 _id) external payable {
        address _donator = msg.sender;
        uint256 _amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        require(campaign.isReleased == false, "You cannot donate to a campaign that has already ended");

        campaign.donators.push(_donator);
        campaign.donations.push(_amount);

        (bool sent, ) = payable(address(this)).call{value: _amount}("");

        require(sent, "Send Ether failed");

        fundLocked += _amount; // mencatat donasi yang terkumpul
        campaign.amountCollected += _amount;
        campaign.storedAmount += _amount;
        reward.recordDonation(_donator, _amount);

        emit CampaignDonated(_donator, _amount, _id);
    }

    // Release funds to the campaign owner
    function releaseFunds(uint256 _id) external payable onlyAdmin {
        address _campaignOwner = campaigns[_id].owner;
        uint256 _storedAmount = campaigns[_id].storedAmount;

        require(_campaignOwner != address(0), "Can not send to address zero");
        require(_storedAmount != 0, "No funds can be released");

        uint256 _amountAfterFee = (_storedAmount * 95) / 100; // platform fee = 5%
        uint256 _fee = _storedAmount - _amountAfterFee;

        (bool success, ) = payable(adminContract).call{value: _fee}(""); // send fee into Admin contract
        require(success, "Can not collect fee");
        admin.collectFee(_fee);

        (bool sent, ) = payable(_campaignOwner).call{value: _amountAfterFee}(
            ""
        );

        require(sent, "Release of funds failed");

        fundLocked -= _storedAmount;
        campaigns[_id].storedAmount = 0;
        campaigns[_id].isReleased = true;

        emit FundReleased(_campaignOwner, _amountAfterFee, _fee, msg.sender);
    }

    // Admin instance must be set first with Admin Contract address
    function setAdmin(address _admin) external onlyOwner {
        adminContract = _admin;
        admin = IAdmin(_admin);
    }

    // Reward must be set first with Reward Contract address
    function setReward(address _reward) external onlyOwner {
        reward = IReward(_reward);
    }

    function getDonators(
        uint256 _id
    ) external view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    // Get all campaigns
    function getCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }

    // Get campaign by id
    function getCampaign(uint256 _id) external view returns (Campaign memory) {
        return campaigns[_id];
    }

    // Get all pending request list
    function getRequestList() external view returns (Campaign[] memory) {
        return requestList;
    }

    // get request data by Id
    function getRequest(uint256 _id) external view returns (Campaign memory) {
        return requestList[_id];
    }
}
