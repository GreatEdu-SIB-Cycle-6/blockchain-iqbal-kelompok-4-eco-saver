// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
 
contract EcoSaverNFT is ERC721URIStorage, Ownable {
    address rewardContract;
    uint256 tokenId;
    mapping (string => string) internal metadataList;
 
    constructor() ERC721("EcoSaverNFT", "ECO") Ownable(msg.sender) {}
 
    function mint(address _to, string calldata _tokenURI) external {
        require(msg.sender == rewardContract, "Forbidden access");
        tokenId++;
        uint256 _tokenId = tokenId;
 
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, metadataList[_tokenURI]);
    }
 
    function setRewardContractAddr(address _rewardContract) public onlyOwner {
        rewardContract = _rewardContract;
    }
 
    function addMetadata(string calldata _imgURI, string calldata _tokenURI) external onlyOwner {
        metadataList[_imgURI] = _tokenURI;
    }
}