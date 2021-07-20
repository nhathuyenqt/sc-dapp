const fs = require('fs')
const solc = require('solc');

async function main(){
	// const [deployer] = await ethers.getSigners()
	// console.log(`Deploying contracts with the account: ${deployer.address}`);

	// const balance = await deployer.getBalance();
	// console.log(`Account balance: ${balance.toString()}`);

	const XContract = await ethers.getContractFactory('XContract');
	const xc = await XContract.deploy();
	console.log(`Contract address: ${xc.address}`);

	// const input = fs.readFileSync('XContract.sol');
	// const output = solc.compile(input.toString(), 1);
	const bytecode = XContract.bytecode;
	// console.log(`Bytecode: ${bytecode}`);

	// const data = {
	// 	address: xc.address,
	// 	abi: JSON.parse(xc.interface.format('json'))
	// 	,bytecode : XContract.bytecode
	// };
	// fs.writeFileSync('frontend/src/XContract.json', JSON.stringify(data));

}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1)
	})