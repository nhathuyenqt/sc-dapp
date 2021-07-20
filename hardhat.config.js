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
const PRIVATE_KEY = 'aab11e26d7467101c231249bf9967c86cde63273b295fdb1a76e183677eddf10';
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

