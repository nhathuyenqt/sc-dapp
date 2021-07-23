from web3 import Web3, HTTPProvider

import json
import asyncio
from api.FieldVector import *
from api.Verifier import *
from api.Proof import *
from api.ElGama import *
# from ..api import *
# contract_address = '0xdADda2cfff603eE9BE63b8E427b7992906729Aeb'


# key = '0x35b2f7395b5fd9a256dc9ecc113e04a0777dcd3660bb7b6a4d7687c7ef3c7ed1'
# acct = w3.eth.account.privateKeyToAccount(key)

w3 = Web3(HTTPProvider("https://rinkeby.infura.io/v3/5a2983b2fe824192949e7e0f80494758"))
deployedContract =  json.load(open('./src/artifacts/contracts/Xcontract.sol/XContract.json'))
abi = deployedContract['abi']
bytecode = deployedContract['bytecode']
# contract = w3.eth.contract(abi=abi, bytecode=bytecode)
contract_instance = w3.eth.contract(abi=abi, address=contract_address)
acc_address = '0x492dc9d2201c07617C937a193048A7be320f677A'

key = '0xb4dde0d4f2685c127ae8e7644508ac7c70472bd9d38b4a464884ae158120e162'
acct = w3.eth.account.privateKeyToAccount(key)
el = ElGamal(group1)

def initBalance():
    # data = Web3.toJSON(event)
    # data = json.loads(data)
    # data = data['args']
    # pk = data['address']
    (public_key, secret_key) = el.keygen()
    print(public_key)
    print(type(secret_key['x']))
    pk = 0xC5e65BF63b33B865e78A02b13f0db60713c3Ff96
    sk = 0xb4dde0d4f2685c127ae8e7644508ac7c70472bd9d38b4a464884ae158120e162

    alpha = group1.init(ZR, pk)
    beta = group1.init(ZR, sk)
    print(type(pk))
    print(type(alpha))

    r = group1.random(ZR)
    msg = b"hello world!12345678"
    cipher_text = el.encrypt(pk, msg)
    decrypted_msg = el.decrypt(pk, sk, cipher_text)
    print("Check Elgama ", decrypted_msg == msg)


def reverse(a):
    if (type(a) ==  list):
        for i in range(len(a)):
            a[i] = reverse(a[i])
        return a
    else:
        return group1.deserialize(a.encode("utf-8"))

def handle_event(event):
    data = Web3.toJSON(event)
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



async def log_loop(event_filter, poll_interval):
    while True:
        for PairCreated in event_filter.get_new_entries():
            handle_event(PairCreated)
            # print("Prove")
        await asyncio.sleep(poll_interval)


if __name__ == '__main__':
    
    print('Connected ', w3.isConnected())
    initBalance()
    

    event_filter = contract_instance.events.NewRequest.createFilter(fromBlock='latest')    
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(
            asyncio.gather(
                log_loop(event_filter, 2)))
                # log_loop(block_filter, 2),
                # log_loop(tx_filter, 2)))
    finally:
        # close loop to free up system resources
        loop.close()