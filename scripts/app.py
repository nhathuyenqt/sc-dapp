from web3 import Web3, HTTPProvider
import json


w3 = Web3(HTTPProvider("https://rinkeby.infura.io/v3/5a2983b2fe824192949e7e0f80494758"))
print('Connected ', w3.isConnected())


deployedContract =  json.load(open('frontend/src/XContract.json'))
abi = deployedContract['abi']
bytecode = deployedContract['bytecode']
contract_address = '0x96eb60A8c1Cd5353d093eB7A3FE47217fCaAfC14'



contract = w3.eth.contract(abi=abi, bytecode=bytecode)
contract_instance = w3.eth.contract(abi=abi, address=contract_address)

tx = contract_instance.functions.greet("Hello all  my goody people").buildTransaction({'nonce': w3.eth.getTransactionCount(acc_address)})
signed_tx = w3.eth.account.signTransaction(tx, key)
#tx_receipt = w3.eth.getTransactionReceipt(tx_hash)
hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)
print(hash.hex())