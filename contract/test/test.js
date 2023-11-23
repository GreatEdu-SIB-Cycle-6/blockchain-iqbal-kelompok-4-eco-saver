const {expect} = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("EcoSaver Crowdfunding Testing", function () {
    async function deployCrowdfundingFixture() {
        // Get Signers
        const [owner, admin1, admin2, user, user2] = await ethers.getSigners();

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

        return { ecoSaverNFT, ecoSaverNFTContract, reward, rewardContract, admin, adminContract, crowdFunding, crowdFundingContract, owner, admin1, admin2, user, user2 };
    }

    describe("CrowdFunding Contract", function(){

        it("Campaign owner can create a request and get approved or rejected by admin", async function () {
            const { crowdFunding, owner, user, user2 } = await loadFixture(deployCrowdfundingFixture);

            // user as campaign owner can create a request campaign
            await crowdFunding.connect(user).requestCampaign(user, "Menanam Pohon", "Menanam Pohon di Purwokerto", 50, 1732258336, "ipfs://image");
            const request1 = await crowdFunding.connect(owner).getRequest(0);
            expect(request1[0]).to.be.equal(user.address);
            await crowdFunding.connect(user2).requestCampaign(user2, "Menanam Pohon", "Menanam Pohon di Purwokerto", 50, 1732258336, "ipfs://image");
            let coba2 = await crowdFunding.connect(owner).getRequest(1);
            expect(coba2[0]).to.be.equal(user2.address);

            // owner can reject the request from user
            await crowdFunding.connect(owner).rejectRequest(1);
            coba2 = await crowdFunding.connect(owner).getRequest(1);
            expect(coba2[0]).to.be.equal("0x0000000000000000000000000000000000000000");

            //owner can approve the request from user
            await crowdFunding.connect(owner).approveRequest(0);
            const campaign = await crowdFunding.connect(owner).getCampaign(0);
            expect(campaign[0]).to.be.equal(user.address);

        })

        it("Available campaigns can accept donations and record these donations", async function(){
            const { crowdFunding, reward, owner, user, user2 } = await loadFixture(deployCrowdfundingFixture);

            // user create a request campaign
            await crowdFunding.connect(user).requestCampaign(user, "Menanam Pohon", "Menanam Pohon di Purwokerto", 500000000000000, 1732258336, "ipfs://image");
            // admin approve the request
            await crowdFunding.connect(owner).approveRequest(0);

            // user2 donates to the campaign
            await crowdFunding.connect(user2).donateToCampaign(0, {value: ethers.parseUnits("17", "wei")});
            // expect donations to be recorded in campaign property
            const campaign = await crowdFunding.connect(owner).getCampaign(0);
            expect(campaign[9][0]).to.be.equal(user2.address);
            expect(campaign[10][0]).to.be.equal(17);
            // expect donations to be recorded in the reward contract
            const donatorData = await reward.connect(owner).getDonatorData(user2);
            expect(donatorData).to.be.equal(17);

        })

        it("Stored donation funds can be released by the admin", async function(){
            const { crowdFunding, admin, owner, user, user2 } = await loadFixture(deployCrowdfundingFixture);

            // user create a request campaign
            await crowdFunding.connect(user).requestCampaign(user, "Menanam Pohon", "Menanam Pohon di Purwokerto", 500000000000000, 1732258336, "ipfs://image");
            // admin approve the request
            await crowdFunding.connect(owner).approveRequest(0);
            // user2 donates to the campaign for 1 ether
            await crowdFunding.connect(user2).donateToCampaign(0, {value: ethers.parseEther("1")});

            // admin releases the donation funds to the campaign owner's address
            const balanceBefore = await ethers.provider.getBalance(user.address); // campaign owner balance
            await crowdFunding.connect(owner).releaseFunds(0);
            const balanceAfter = await ethers.provider.getBalance(user.address);
            // expect the campaign owner's balance to increase
            expect(balanceAfter).to.be.above(balanceBefore);
            /**
             * expect platform fees to be distributed to the Admin Contract
             * platform fee = 5%
             * fee = 5% * 1 ether = 0.05 ether = 50000000000000000 wei
             */
            const fee = ethers.parseUnits("50000000000000000", "wei");
            const feeCollected = await admin.connect(owner).feeCollected();
            expect(feeCollected).to.be.equal(fee);
        })

    })

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
            await expect(ecoSaverNFT.connect(admin1).setRewardContractAddr(ecoSaverNFTContract)).to.be.revertedWithCustomError;
            await expect(ecoSaverNFT.connect(user).setRewardContractAddr(ecoSaverNFTContract)).to.be.revertedWithCustomError;
        })

        it("Owner can add metadata for NFT Minting", async function () {
            
            const { ecoSaverNFT, owner, admin1, user } = await loadFixture(deployCrowdfundingFixture);

            // Add metadata from owner must be success
            await ecoSaverNFT.connect(owner).addMetadata("ipfs://owner", "ipfs://ownermetadata");
            const metadata = await ecoSaverNFT.connect(owner).getMetadata("ipfs://owner");
            expect(metadata).to.be.equals("ipfs://ownermetadata");

            // Add metadata from other than owner must be reverted
            await expect(ecoSaverNFT.connect(admin1).addMetadata("http://admin1.com", "http://admin1.com")).to.be.revertedWithCustomError;
            await expect(ecoSaverNFT.connect(user).addMetadata("http://google.com", "http://metadata.com")).to.be.revertedWithCustomError;
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
            await expect(reward.connect(admin1).addItem("T-shirt", "T-shirt with superhero picture", 1, 100, 99, "ipfs://image", false)).to.be.revertedWithCustomError;
            await expect(reward.connect(user).addItem("T-shirt", "T-shirt with superhero picture", 1, 100, 99, "ipfs://image", false)).to.be.revertedWithCustomError;

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
            expect(reward.connect(admin1).setCrowdFundingAddr(rewardContract)).to.be.revertedWithCustomError;
            expect(reward.connect(user).setCrowdFundingAddr(rewardContract)).to.be.revertedWithCustomError;
            expect(reward.connect(admin1).setEcoSaverNFT(rewardContract)).to.be.revertedWithCustomError;
            expect(reward.connect(user).setEcoSaverNFT(rewardContract)).to.be.revertedWithCustomError;
        })

        it("Donators can claim rewards according to the amount of their donation", async function(){
            const { crowdFunding, reward, ecoSaverNFT, owner, user, user2 } = await loadFixture(deployCrowdfundingFixture);

            // user as campaign owner create a request campaign
            await crowdFunding.connect(user).requestCampaign(user, "Menanam Pohon", "Menanam Pohon di Purwokerto", ethers.parseEther("1"), 1732258336, "ipfs://image");
            //owner approve the request from user
            await crowdFunding.connect(owner).approveRequest(0);
            // user2 donates to the campaign
            await crowdFunding.connect(user2).donateToCampaign(0, {value: ethers.parseEther("1")});

            // Add reward item for reward claim
            await reward.connect(owner).addItem("T-shirt", "T-shirt with superhero picture", 2, ethers.parseEther("1"), 99, "https://image.com", false);
            await ecoSaverNFT.connect(owner).addMetadata("ipfs://firstimage", "ipfs://firstmetadata");
            await reward.connect(owner).addItem("Ocean", "NFT ocean picture", 2, ethers.parseEther("1"), 1, "ipfs://firstimage", true);

            // user2 as donator claim NFT reward
            await reward.connect(user2).claimReward(1);
            const user2NFT = await ecoSaverNFT.balanceOf(user2.address);
            await expect(user2NFT).to.be.equal(1);

            /**
             * user2 needs to make another donation 
             * to meet the minimum amount required for the T-shirt reward
             */
            await expect(reward.connect(user2).claimReward(0)).to.be.revertedWith("The amount of your donation is insufficient.");

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
            await expect(admin.connect(admin1).addAdmin(admin1)).to.be.revertedWithCustomError;

            // Remove admin by other than owner must reverted
            await admin.connect(owner).addAdmin(admin1);
            await expect(admin.connect(admin1).removeAdmin(admin1)).to.be.revertedWithCustomError;

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
            await expect(admin.connect(admin1).setCrowdFundingAddr(adminContract)).to.be.revertedWithCustomError;
            await expect(admin.connect(user).setCrowdFundingAddr(adminContract)).to.be.revertedWithCustomError;

        })

        it("Collected fee can be distribute to all admins", async function(){
            const { crowdFunding, admin, owner, admin1, admin2, user, user2 } = await loadFixture(deployCrowdfundingFixture);

            // add some admin
            await admin.connect(owner).addAdmin(admin1);
            await admin.connect(owner).addAdmin(admin2);

            // user create a request campaign
            await crowdFunding.connect(user).requestCampaign(user, "Menanam Pohon", "Menanam Pohon di Purwokerto", ethers.parseEther("60"), 1732258336, "ipfs://image");
            // admin approve the request
            await crowdFunding.connect(owner).approveRequest(0);
            // user2 donates to the campaign for 60 ether
            await crowdFunding.connect(user2).donateToCampaign(0, {value: ethers.parseEther("60")});
            // admin releases the donation funds to the campaign owner's address
            await crowdFunding.connect(owner).releaseFunds(0);

            // distribute collected fee to all admins
            const ownerBefore = await ethers.provider.getBalance(owner.address);
            const admin1Before = await ethers.provider.getBalance(admin1.address);
            const admin2Before = await ethers.provider.getBalance(admin2.address);
            await admin.connect(owner).distributeFee();

            /**
             * expect the balance of all admins to increase
             * platform fee = 5%
             * fee for last donation = 5% of 60 ether = 3 ether
             * number of admin = 3
             * distribution = 3 ether / 3 admin = 1 ether per admin
             */
            const ownerAfter = await ethers.provider.getBalance(owner.address);
            const admin1After = await ethers.provider.getBalance(admin1.address);
            const admin2After = await ethers.provider.getBalance(admin2.address);
            expect(ownerAfter).to.be.above(ownerBefore);
            expect(admin1After).to.be.equal(admin1Before + ethers.parseEther("1"));
            expect(admin2After).to.be.equal(admin2Before + ethers.parseEther("1"));
        })

    })

})