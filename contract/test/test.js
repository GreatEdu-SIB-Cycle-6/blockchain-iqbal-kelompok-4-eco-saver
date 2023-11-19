const {expect} = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("EcoSaver Crowdfunding Testing", function () {
    async function deployCrowdfundingFixture() {
        // Get Signers
        const [owner, admin1, admin2, user] = await ethers.getSigners();

        // EcoSaverNFT Contract
        const ecoSaverNFT = await ethers.deployContract("EcoSaverNFT");
        await ecoSaverNFT.waitForDeployment();
        const ecoSaverNFTContract = (await ecoSaverNFT.getAddress()).toString();

        // Reward Contract
        const reward = await ethers.deployContract("Reward", [ecoSaverNFTContract]);
        await reward.waitForDeployment();
        const rewardContract = (await reward.getAddress()).toString();

        // Admin Contract
        const admin = await ethers.deployContract("Admin");
        await admin.waitForDeployment();
        const adminContract = (await admin.getAddress()).toString();

        // CrowdFunding Contract
        const crowdFunding = await ethers.deployContract("CrowdFunding", [rewardContract, adminContract]);
        await crowdFunding.waitForDeployment();
        const  crowdFundingContract = (await crowdFunding.getAddress()).toString();

        // Set address for integration
        await ecoSaverNFT.connect(owner).setRewardContractAddr(rewardContract);
        await reward.connect(owner).setCrowdFundingAddr(crowdFundingContract);
        await admin.connect(owner).setCrowdFundingAddr(crowdFundingContract);

        return { ecoSaverNFT, ecoSaverNFTContract, reward, admin, crowdFunding, owner, admin1, admin2, user };
    }

    describe("EcoSaverNFT", function () {
        
        it("Only owner can set rewardContract variable", async function () {

            // Here we'll use ecoSaverNFT contract address as dummy address to replace existing rewardContract address
            const { ecoSaverNFT, ecoSaverNFTContract, owner, admin1, user } = await loadFixture(deployCrowdfundingFixture);
            
            // Set rewardContract by owner
            await ecoSaverNFT.connect(owner).setRewardContractAddr(ecoSaverNFTContract);
            let addressAfter = await ecoSaverNFT.connect(owner).rewardContract();
            expect(addressAfter).to.be.equal(ecoSaverNFTContract);

            // Set rewardContract by other than owner
            await expect(ecoSaverNFT.connect(admin1).setRewardContractAddr(ecoSaverNFTContract)).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(ecoSaverNFT.connect(user).setRewardContractAddr(ecoSaverNFTContract)).to.be.revertedWith("Ownable: caller is not the owner");
        })

    })
})