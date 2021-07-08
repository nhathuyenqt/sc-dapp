from web3 import Web3, HTTPProvider
import json


w3 = Web3(HTTPProvider("https://rinkeby.infura.io/v3/5a2983b2fe824192949e7e0f80494758"))
print('Connected ', w3.isConnected())


deployedContract =  json.load(open('frontend/src/XContract.json'))
abi = deployedContract['abi']
bytecode = deployedContract['bytecode']
contract_address = '0x939Dd53cCAB6517bf5f2a293B3057252c5fB37A2'
acc_address = '0xC5e65BF63b33B865e78A02b13f0db60713c3Ff96'

key = '0x35b2f7395b5fd9a256dc9ecc113e04a0777dcd3660bb7b6a4d7687c7ef3c7ed1'
acct = w3.eth.account.privateKeyToAccount(key)

contract = w3.eth.contract(abi=abi, bytecode=bytecode)
contract_instance = w3.eth.contract(abi=abi, address=contract_address)

tx = contract_instance.functions.greet("Hello all  my goody people").buildTransaction({'nonce': w3.eth.getTransactionCount(acc_address)})
signed_tx = w3.eth.account.signTransaction(tx, key)
#tx_receipt = w3.eth.getTransactionReceipt(tx_hash)
hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)
print(hash.hex())