from web3 import Web3, HTTPProvider
import json


w3 = Web3(HTTPProvider("https://rinkeby.infura.io/v3/5a2983b2fe824192949e7e0f80494758"))
print('Connected ', w3.isConnected())


deployedContract =  json.load(open('frontend/src/XContract.json'))
abi = deployedContract['abi']
bytecode = deployedContract['bytecode']
contract_address = '0x8C761F41a913ca79AE22378919Db9E52c814D57a'
acc_address = '0xC5e65BF63b33B865e78A02b13f0db60713c3Ff96'

key = '0x35b2f7395b5fd9a256dc9ecc113e04a0777dcd3660bb7b6a4d7687c7ef3c7ed1'
acct = w3.eth.account.privateKeyToAccount(key)

contract = w3.eth.contract(abi=abi, bytecode=bytecode)
contract_instance = w3.eth.contract(abi=abi, address=contract_address)

# tx = contract_instance.functions.greet("Hello all  my goody people").buildTransaction({'nonce': w3.eth.getTransactionCount(acc_address)})
# signed_tx = w3.eth.account.signTransaction(tx, key)
# #tx_receipt = w3.eth.getTransactionReceipt(tx_hash)
# hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
# print(hash.hex())


from Verifier import Verifier
from Prover import Prover
from GlobalConfig import *

# if __name__ == '__main__':
# prover = Prover()
# gama = group1.random(ZR)
# p, c = prover.prove(200, gama)
# print(type(p))
# tx = contract_instance.functions.sendProof(str(p.taux), str(p.muy), str(p.t), str(p.l), str(p.r), str(p.A), str(p.S), str(p.T1), str(p.T2), str(p.V), str(p.sigma)).buildTransaction({'nonce': w3.eth.getTransactionCount(acc_address)})
# signed_tx = w3.eth.account.signTransaction(tx, key)
# #tx_receipt = w3.eth.getTransactionReceipt(tx_hash)
# hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
# print("Transaction send a proof and challenge to SC")
# print(hash.hex())

    # verifer = Verifier()
    # verifer.verify(p, c)
