from web3 import Web3, HTTPProvider

import json
import asyncio
from api.FieldVector import *
from api.Verifier import *
from api.Proof import *
from api.ElGama import *

addr = json.load(open('./../src/contract_address.json'))
contract_address = addr['contract_address']

deployedContract =  json.load(open('./../src/artifacts/contracts/Xcontract.sol/XContract.json'))
abi = deployedContract['abi']
bytecode = deployedContract['bytecode']
# contract = w3.eth.contract(abi=abi, bytecode=bytecode)
contract_instance = w3.eth.contract(abi=abi, address=contract_address)
acc_address = '0x492dc9d2201c07617C937a193048A7be320f677A'
key = '0xb4dde0d4f2685c127ae8e7644508ac7c70472bd9d38b4a464884ae158120e162'
#localhost
acc_address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
acct = w3.eth.account.privateKeyToAccount(key)
el = ElGamal(group1)

def reverse(a):
    if (type(a) ==  list):
        for i in range(len(a)):
            a[i] = reverse(a[i])
        return a
    else:
        return group1.deserialize(a.encode("utf-8"))

def handle_event1(event):

    data = Web3.toJSON(event)
    print("Event ", event)
    data = json.loads(data)
    data = data['args']
    id = data['id']
    proof = data['proof']
    proof = json.loads(proof)
    proof = json.loads(proof)
    c = proof["challenge"]
    p = proof['proof']
    for k in c.keys():
        c[k] = reverse(c[k])
    for k in p.keys():
        p[k] = reverse(p[k])

    proof = Proof()
    proof.set(p['taux'], p['muy'], p['t'], p['l'], p['r'], p['A'], p['S'], p['T1'], p['T2'], p['V'], p['sigma'])
    challenge = Challenge()
    challenge.set(c['x'], c['y'], c['z'], c['g'], c['h'], c['g_vec'], c['h_vec'])
    print("Confirm x ",c['x'])
    print("Confirm y ",c['y'])
    print("Confirm z ",c['z'])
    v = Verifier()
    result = v.verify(proof, challenge)
    print(id, " VERIFIED ", result)
    tx = contract_instance.functions.confirmProof(id, result).buildTransaction({'nonce': w3.eth.getTransactionCount(acc_address)})
    signed_tx = w3.eth.account.signTransaction(tx, key)

def handle_range_proof(proof):
    c = proof["challenge"]
    p = proof['proof']
    for k in c.keys():
        c[k] = reverse(c[k])
    for k in p.keys():
        p[k] = reverse(p[k])

    proof = Proof()
    proof.set(p['gama'], p['taux'], p['muy'], p['t'], p['l'], p['r'], p['A'], p['S'], p['T1'], p['T2'], p['V'], p['sigma'])
    challenge = Challenge()
    challenge.set(c['x'], c['y'], c['z'], c['g'], c['h'], c['g_vec'], c['h_vec'])
    print("Confirm x ",c['x'])
    print("Confirm y ",c['y'])
    print("Confirm z ",c['z'])
    v = Verifier()
    result = v.verify(proof, challenge)
    print(id, " VERIFIED ", result)
    tx = contract_instance.functions.confirmProof(id, result).buildTransaction({'nonce': w3.eth.getTransactionCount(acc_address)})
    signed_tx = w3.eth.account.signTransaction(tx, key)

def handle_event(event):
    print("Load Event")
    data = Web3.toJSON(event)
    # print("Event ", event)
    data = json.loads(data)
    data = data['args']
    proof1 = data['proof1']
    proof1 = json.loads(proof1)
    proof1 = json.loads(proof1)
    print("proof 1", proof1)
    proofForAmt = proof1["rangeProofForAmt"]
    # proofForAmt = json.loads(proofForAmt)
    print()
    print()
    print()

    # print("proofForAmt", proofForAmt)
    handle_range_proof(proofForAmt)

async def log_loop(event_filter, poll_interval):
    while True:
        for PairCreated in event_filter.get_new_entries():
            handle_event(PairCreated)
            print("Prove")
        await asyncio.sleep(poll_interval)


if __name__ == '__main__':
    
    print('Connected ', w3.isConnected())
    # initBalance()
    

    # event_filter = contract_instance.eventss.NewRequest.createFilter(fromBlock='latest') 
    event_filter = contract_instance.events.NewConfTransfer.createFilter(fromBlock='latest')    
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(
            asyncio.gather(
                
                log_loop(event_filter, 2)))

                # log_loop(event_filter, 2)))
                # log_loop(block_filter, 2),
                # log_loop(tx_filter, 2)))
    finally:
        # close loop to free up system resources
        loop.close()