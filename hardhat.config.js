require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async () => {
//   const accounts = await ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

const INFURA_URL = 'https://rinkeby.infura.io/v3/5a2983b2fe824192949e7e0f80494758';
const PRIVATE_KEY = 'b4dde0d4f2685c127ae8e7644508ac7c70472bd9d38b4a464884ae158120e162';
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

