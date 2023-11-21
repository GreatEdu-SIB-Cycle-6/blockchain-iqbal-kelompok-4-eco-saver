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
        const reward = await ethers.deployContract("Reward");
        await reward.waitForDeployment();
        const rewardContract = (await reward.getAddress()).toString();

        // Admin Contract
        const admin = await ethers.deployContract("Admin");
        await admin.waitForDeployment();
        const adminContract = (await admin.getAddress()).toString();

        // CrowdFunding Contract
        const crowdFunding = await ethers.deployContract("CrowdFunding");
        await crowdFunding.waitForDeployment();
        const  crowdFundingContract = (await crowdFunding.getAddress()).toString();

        // Set address for integration
        await ecoSaverNFT.connect(owner).setRewardContractAddr(rewardContract);
        await reward.connect(owner).setCrowdFundingAddr(crowdFundingContract);
        await reward.connect(owner).setEcoSaverNFT(ecoSaverNFTContract);
        await admin.connect(owner).setCrowdFundingAddr(crowdFundingContract);
        await crowdFunding.connect(owner).setAdmin(adminContract);
        await crowdFunding.connect(owner).setReward(rewardContract);

        return { ecoSaverNFT, ecoSaverNFTContract, reward, rewardContract, admin, adminContract, crowdFunding, crowdFundingContract, owner, admin1, admin2, user };
    }

    describe("EcoSaverNFT Contract", function () {
        
        it("Owner can set rewardContract variable", async function () {

            /**
             * Here we'll use ecoSaverNFTContract address as dummy address 
             * to replace existing rewardContract address
             */
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

    describe("Reward Contract", function () {

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

        it("Owner can set crowdFundingAddr and ecoSaverNFT variable", async function() {
            
            /**
             * Here we'll use Reward Contract address as dummy address
             * to set the value of crowdFundingAddr and ecoSaverNFT variable
             */

            const { reward,rewardContract, owner, admin1, user } = await loadFixture(deployCrowdfundingFixture);

            /** Set by owner must be success */
            // crowdFundingAddr
            let before = await reward.connect(owner).crowdFundingAddr();
            await reward.connect(owner).setCrowdFundingAddr(rewardContract);
            let after = await reward.connect(owner).crowdFundingAddr();
            expect(before).to.be.not.equal(after);
            expect(after).to.be.equal(rewardContract);
            // ecoSaverNFT
            before = await reward.connect(owner).ecoSaverNFT();
            await reward.connect(owner).setEcoSaverNFT(rewardContract);
            after = await reward.connect(owner).ecoSaverNFT();
            expect(before).to.be.not.equal(after);
            expect(after).to.be.equal(rewardContract);

            /** Set by other than owner must be reverted */
            expect(reward.connect(admin1).setCrowdFundingAddr(rewardContract)).to.be.revertedWith("Ownable: caller is not the owner");
            expect(reward.connect(user).setCrowdFundingAddr(rewardContract)).to.be.revertedWith("Ownable: caller is not the owner");
            expect(reward.connect(admin1).setEcoSaverNFT(rewardContract)).to.be.revertedWith("Ownable: caller is not the owner");
            expect(reward.connect(user).setEcoSaverNFT(rewardContract)).to.be.revertedWith("Ownable: caller is not the owner");
        })

    })

    describe("Admin Contract", function () {
        
        it("Owner can add and remove admins", async function(){

            const {admin, owner, admin1} = await loadFixture(deployCrowdfundingFixture);

            // Add admin
            await admin.connect(owner).addAdmin(admin1);
            let theAdmin = await admin.connect(owner).isAdminExist(admin1);
            expect(theAdmin).to.be.true;

            // Remove admin
            await admin.connect(owner).removeAdmin(admin1);
            theAdmin = await admin.connect(owner).isAdminExist(admin1);
            expect(theAdmin).to.be.false;

            // Add admin by other than owner must reverted
            await expect(admin.connect(admin1).addAdmin(admin1)).to.be.revertedWith("Ownable: caller is not the owner");

            // Remove admin by other than owner must reverted
            await admin.connect(owner).addAdmin(admin1);
            await expect(admin.connect(admin1).removeAdmin(admin1)).to.be.revertedWith("Ownable: caller is not the owner");

        })

        it("Owner can set crowdFunding address variable", async function(){

            /**
             * Here we'll use Admin Contract address as dummy address
             * to set the value of crowdFunding address variable
             */

            const {admin, adminContract, owner, admin1, user} = await loadFixture(deployCrowdfundingFixture);

            // Set crowdFunding address variable by owner must be success
            const before = await admin.connect(owner).crowdFunding();
            await admin.connect(owner).setCrowdFundingAddr(adminContract);
            const after = await admin.connect(owner).crowdFunding();
            expect(before).to.be.not.equal(after);

            // Set crowdFunding address variable by other than owner must be reverted
            await expect(admin.connect(admin1).setCrowdFundingAddr(adminContract)).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(admin.connect(user).setCrowdFundingAddr(adminContract)).to.be.revertedWith("Ownable: caller is not the owner");

        })

    })

})