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

    describe("EcoSaverNFT Contract", function () {
        
        it("Owner can set rewardContract variable", async function () {

            // Here we'll use ecoSaverNFTContract address as dummy address to replace existing rewardContract address
            const { ecoSaverNFT, ecoSaverNFTContract, owner, admin1, user } = await loadFixture(deployCrowdfundingFixture);
            
            // Set rewardContract by owner
            await ecoSaverNFT.connect(owner).setRewardContractAddr(ecoSaverNFTContract);
            let addressAfter = await ecoSaverNFT.connect(owner).rewardContract();
            expect(addressAfter).to.be.equal(ecoSaverNFTContract);

            // Set rewardContract by other than owner
            await expect(ecoSaverNFT.connect(admin1).setRewardContractAddr(ecoSaverNFTContract)).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(ecoSaverNFT.connect(user).setRewardContractAddr(ecoSaverNFTContract)).to.be.revertedWith("Ownable: caller is not the owner");
        })

        it("Owner can add metadata for NFT Minting", async function () {
            
            const { ecoSaverNFT, owner, admin1, user } = await loadFixture(deployCrowdfundingFixture);

            // Add metadata from owner must be success
            await ecoSaverNFT.connect(owner).addMetadata("ipfs://owner", "ipfs://ownermetadata");
            const metadata = await ecoSaverNFT.connect(owner).getMetadata("ipfs://owner");
            expect(metadata).to.be.equals("ipfs://ownermetadata");

            // Add metadata from other than owner must be reverted
            await expect(ecoSaverNFT.connect(admin1).addMetadata("http://admin1.com", "http://admin1.com")).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(ecoSaverNFT.connect(user).addMetadata("http://google.com", "http://metadata.com")).to.be.revertedWith("Ownable: caller is not the owner");
        })

    })

    describe("Reward Contract", async function () {

        it("Owner can add reward item", async function () {

            const { reward, owner, admin1, user } = await loadFixture(deployCrowdfundingFixture);

            // Add item from owner must be success
            await reward.connect(owner).addItem("T-shirt", "T-shirt with superhero picture", 1, 100, 99, "ipfs://image", false); 
            const item = await reward.connect(owner).getReward(0);
            await expect(item).to.be.an("array").that.does.not.include("");
            await expect(item).to.be.an("array").that.does.not.include(0);

            // Add item from other than owner must be reverted
            await expect(reward.connect(admin1).addItem("T-shirt", "T-shirt with superhero picture", 1, 100, 99, "ipfs://image", false)).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(reward.connect(user).addItem("T-shirt", "T-shirt with superhero picture", 1, 100, 99, "ipfs://image", false)).to.be.revertedWith("Ownable: caller is not the owner");

        })

    })

})