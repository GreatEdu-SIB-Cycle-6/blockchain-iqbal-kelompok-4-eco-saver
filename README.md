<br/>
<p align="center">
  <a href="https://github.com/GreatEdu-SIB-Cycle-6/blockchain-iqbal-kelompok-4-eco-saver">
    <img src="https://ecosaver.netlify.app/assets/favicon.8fd7cbe1.ico" alt="Logo" width="300" height="300">
  </a>

  <h3 align="center">EcoSaver</h3>

  <p align="center">
    Decentralized Crowdfunding Platform for a Better Environment
    <br/>
    <br/>
    <a href="https://ecosaver.netlify.app" target="_blank">View Demo</a> 🚀
  </p>
</p>



## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Testing](#testing)
  * [Deployment & Integrations](#deployment--integrations)
  * [Contract Address](#contract-address)
  * [Run Locally](#run-locally)
* [Authors](#authors)

## About The Project

![Screen Shot](https://bafybeicid7weme7e2dbr7tgj2ae6ixv5gbnehxos6mxt2r36kzxhlmy3pu.ipfs.nftstorage.link/)

The EcoSaver project aims to encourage and incentivize communities that contribute to environmental conservation. There are rewards for donors to motivate and reciprocate their participation in environmental conservation efforts.

Here're some of the project's best features:

* Create crowdfunding campaign and collect funds from donors.
* Campaign approval and funds release by admin.
* Platform fee: 5%.
* Rewards for donors.


## Built With

Technologies used in the project:

* [Solidity](https://soliditylang.org/)
* [Hardhat](https://hardhat.org/)
* [Openzeppelin Contracts](https://www.openzeppelin.com/contracts)
* [Vite](https://vitejs.dev/)
* [React](https://react.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Node.js](https://nodejs.org/en)
* [thirdweb](https://thirdweb.com/)

## Getting Started

### Prerequisites

* You need to have the currently maintained [Node.js](https://nodejs.org/en) LTS version installed.  

### Installation

1. Clone the repo:
   
    ```sh
    git clone https://github.com/GreatEdu-SIB-Cycle-6/blockchain-iqbal-kelompok-4-eco-saver.git
    ```
2. Install all NPM packages in the `app` and `contract` directories. Run each of the following commands from the project's directory:
   
    ```sh
    cd app && npm install
    ```
    ```sh
    cd contract && npm install
    ```

### Testing

1. From project's root directory, go to contract directory:  
    ``` sh
    cd contract
    ```  
2. Run Hardhat test command. This will run `test/test.js`:  
    ``` sh
    npx hardhat test
    ```

### Deployment & Integrations
1. From project's root directory, go to contract directory:  
    ``` sh
    cd contract
    ```
2. Run this command in terminal:  
    ``` sh
    npx thirdweb@latest deploy
    ```
3. Choose all contracts then press `Enter`. Follow the next steps on the web.
4. After all contracts are deployed, integration between contracts needs to be done. Run the following functions on the smart contract:
   * **CrowdFunding**
       * setAdmin = _`<Your Admin contract address>`_.  
       * setReward = _`<Your Reward contract address>`_.
   * **Reward**
       * setCrowdFundingAddr = _`<Your CrowdFunding contract address>`_.
       * setEcoSaverNFT = _`<Your EcoSaverNFT contract address>`_.
   * **EcoSaverNFT**
       * setRewardContractAddr = _`<Your Reward contract address>`_.
   * **Admin**
       * setCrowdFundingAddr = _`<Your CrowdFunding contract address>`_.

### Contract Address  
Here are the addresses of our deployed contracts (BSC Testnet):  
1. **Crowdfunding** : 0x36f9fAC2268f7Debe5D6D22dB00936545CBa23b6
2. **Admin** : 0xE4715aBADB71EeB176aAcd03501961fb26b98Dfd
3. **Reward** : 0x29DF0c1BB7710Ef0fBCab73315ee8FdDa73250B4
4. **EcoSaverNFT** : 0xD246E22cdE2621C3c10FB12E13a647B30B735De1

### Run Locally
You can run this project locally to try it out.
1. Change directory to `app`:
   ```sh
   cd app
   ```
2. In the `app` directory, open `src/context/index.jsx` then modify the following line:
   ![Screen Shot](https://bafkreic63n7bcqcxsac6nbukh2cauixqgsd55y52ub2k3ugiksf5c6phji.ipfs.nftstorage.link/)
3. In the `app` directory, open `src/main.jsx` then modify the following attributes in the `ThirdwebProvider` tag:
   * `activeChain` = You can refer [here](https://portal.thirdweb.com/react/react.thirdwebsdkprovider#default-chains).
   * `desiredChainId` = You can refer [here](https://portal.thirdweb.com/typescript/sdk.chain_id#return-value).
   * `clientId` = Your [thirdweb API Key](https://thirdweb.com/dashboard/settings/api-keys).

4. Run the Tailwind CSS compiler.
   ```sh
   npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
   ```
5. Start the vite local development server.
   ```sh
   npm run dev
   ```
6. Open `http://localhost:5173`.

## Authors
[harundarat](https://github.com/harundarat/) || [Bimajadivaaa](https://github.com/Bimajadivaaa) || [dinarosaa](https://github.com/dinarosaa) || [HarryBachtiar](https://github.com/HarryBachtiar)
