require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async () => {
//   const accounts = await ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

const INFURA_URL = 'https://rinkeby.infura.io/v3/0536889ad25f4378bd250672238fdbf0';
const PRIVATE_KEY = '4455b2b2897046e45ed0467c2cfb77be6f09d6dd0d215367470755d7982e8ceb';
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths :{
	  artifacts: './src/artifacts'
  },
  networks: {
  	rinkeby:{
  		url : INFURA_URL,
  		accounts: [`0x${PRIVATE_KEY}`]
  	},
	hardhat :{
		chainId: 1337
	} 
  }
};

