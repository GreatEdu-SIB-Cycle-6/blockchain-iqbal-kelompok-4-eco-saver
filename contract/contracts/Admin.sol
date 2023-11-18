// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Admin is Ownable {
    address public crowdFunding;
    address[] private admins;
    mapping (address => uint256) private adminIndex;
    mapping (address => bool) private adminStatus;
    mapping (address => uint) public distributeFeeFailed;
    uint256 public feeCollected;

    constructor() Ownable(msg.sender) {
        admins.push(msg.sender);
        adminIndex[msg.sender] = 0;
        adminStatus[msg.sender] = true;
    }

    receive() external payable {}

    event AdminLog(address _address);
    event FeeDistributed(uint256 _numberOfAdmins, uint256 _amountPerAdmin);

    function addAdmin(address _newAdmin) external onlyOwner {
        require(isAdminExist(_newAdmin) == false, "The address is already admin");
        adminIndex[_newAdmin] = getAdminLength();
        admins.push(_newAdmin);
        adminStatus[_newAdmin] = true;

        emit AdminLog(_newAdmin);
    }

    function removeAdmin(address _admin) external onlyOwner {
        require(isAdminExist(_admin), "Admin does not exist");

        uint256 _indexToRemove = adminIndex[_admin]; // index of address that will be removed
        address _adminToMove = admins[getAdminLength() - 1]; // get the last admin address

        admins[_indexToRemove] = _adminToMove; // replace address that will be removed with the last admin address
        adminIndex[_adminToMove] = _indexToRemove; // change index of last address with index from address that will be removed
        admins.pop();
        delete adminStatus[_admin];

        emit AdminLog(_admin);
    }

    function isAdminExist(address _admin) public view returns (bool) {
        return adminStatus[_admin];
    }

    // distribute collected fee to admins
    function distributeFee() external onlyOwner payable {
        require(feeCollected > 0, "Nothing can be distributed");

        uint256 _numOfAdmins = getAdminLength();
        uint256 _amount = feeCollected / _numOfAdmins;

        for (uint i = 0; i < _numOfAdmins; i++) {
            address _admin = admins[i];

            (bool success, ) = payable(_admin).call{value: _amount}("");

            if (success) {
                feeCollected -= _amount;
            } else if(success != true){
                distributeFeeFailed[_admin] += _amount;
            }
        }

        emit FeeDistributed(_numOfAdmins, _amount);
    }

    function collectFee(uint256 _amount) external {
        require(msg.sender == crowdFunding, "Forbidden access"); // sender must from crowdfunding contract
        feeCollected += _amount;
    }

    function getAdminLength() public view returns (uint256) {
        return admins.length;
    }

    function getAdmins() public view returns (address[] memory) {
        return admins;
    }

    // Crowdfunding address must be set first here
    function setCrowdFundingAddr(address _crowdFunding) external onlyOwner {
        crowdFunding = _crowdFunding;
    }

}