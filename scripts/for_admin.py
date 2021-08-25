from web3 import Web3, HTTPProvider
import json
import asyncio
from api.SigmaVerifier import *
from api.FieldVector import *
from api.Verifier import *
from api.BulletProof import *
from api.ElGama import *

addr = json.load(open('./src/contract_address.json'))
contract_address = addr['contract_address']

deployedContract =  json.load(open('./src/artifacts/contracts/Xcontract.sol/XContract.json'))
abi = deployedContract['abi']
bytecode = deployedContract['bytecode']
# contract = w3.eth.contract(abi=abi, bytecode=bytecode)
print("contract_address  ", contract_address)
contract_address = Web3.toChecksumAddress(contract_address)
contract_instance = w3.eth.contract(abi=abi, address=contract_address)
admin_key = 'b4dde0d4f2685c127ae8e7644508ac7c70472bd9d38b4a464884ae158120e162' #rinkeby
# admin_key = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
admin_key = "4455b2b2897046e45ed0467c2cfb77be6f09d6dd0d215367470755d7982e8ceb"
acc_admin = w3.eth.account.privateKeyToAccount(admin_key)
admin_address = Web3.toChecksumAddress(acc_admin.address)
el = ElGamal(group1)

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("/Users/kzjouf/Desktop/project/scdapp/scripts/admin/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
users_ref = db.collection('users')

def check_newUser():
    docs = users_ref.stream()
    print("admin address : ",admin_address)
    args = []
    for doc in docs:
        # users_list.append(doc.to_dict())
        # print(u'{} => {}'.format(doc.id, doc.to_dict()))
        user = doc.to_dict()['address']
        user = Web3.toChecksumAddress(user)
        print(user)
        args.append(user)
        # 
    # args = [w3.utils.asciiToHex(x) for x in args]

    tx = contract_instance.functions.authorizeNewUser(args).buildTransaction({'nonce': w3.eth.getTransactionCount(admin_address), 'from': admin_address})
    signed_tx = w3.eth.account.signTransaction(tx, admin_key)
    hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    
    print("check user : ", hash.hex())
    tx = contract_instance.functions.checkAuthorizeNewUser('0xcE9286718A6d54847679A0b61ce48CfCb8c00F43').call({'from': admin_address})
    print("check user : ", tx)

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

    proof = BulletProof()
    proof.set(p['taux'], p['muy'], p['t'], p['l'], p['r'], p['A'], p['S'], p['T1'], p['T2'], p['V'], p['sigma'])
    challenge = Challenge()
    challenge.set(c['x'], c['y'], c['z'], c['g'], c['h'], c['g_vec'], c['h_vec'])
    print("Confirm x ",c['x'])
    print("Confirm y ",c['y'])
    print("Confirm z ",c['z'])
    v = Verifier()
    result = v.verify(proof, challenge)
    print(id, " VERIFIED ", result)
    tx = contract_instance.functions.confirmProof(id, result).buildTransaction({'nonce': w3.eth.getTransactionCount(admin_address)})
    signed_tx = w3.eth.account.signTransaction(tx, admin_key)
    hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print(hash.hex())

def handle_range_proof(proof):
    c = proof["challenge"]
    p = proof['proof']
    for k in c.keys():
        c[k] = reverse(c[k])
    for k in p.keys():
        p[k] = reverse(p[k])

    proof = BulletProof()
    proof.set(p['gama'], p['taux'], p['muy'], p['t'], p['l'], p['r'], p['A'], p['S'], p['T1'], p['T2'], p['V'], p['sigma'])
    challenge = Challenge()
    challenge.set(c['x'], c['y'], c['z'], c['g'], c['h'], c['g_vec'], c['h_vec'])
    v = Verifier()
    result = v.verify(proof, challenge)
    return result
    # tx = contract_instance.functions.confirmProof(id, result).buildTransaction({'nonce': w3.eth.getTransactionCount(acc_address)})
    # signed_tx = w3.eth.account.signTransaction(tx, key)
def handle_sigma_proof(proof, info):
    for i in proof.keys():
        proof[i] = reverse(proof[i])
    for i in info.keys():
        info[i] = reverse(info[i])
    
    return sigmaVerify(proof, info)

    
def homo_computation(info):
    
    y = info['y']
    yr = info['yr']
    C = info['C']
    Cr = info['Cr']
    D = info['D']
    # y = reverse(y)
    y_str = convert(y)
    yr_str = convert(yr)
    (CL, CR) = contract_instance.functions.ElBalanceOf(y_str).call()
    (CLr, CRr) = contract_instance.functions.ElBalanceOf(yr_str).call()
    
    CL = reverse(CL)
    CR = reverse(CR)
    CLr = reverse(CLr)
    CRr = reverse(CRr)

    CL_s_new = CL/C
    CR_s_new = CR/D

    CL_r_new = CLr*Cr
    CR_r_new = CRr*D
    
    CL1 = convert(CL_s_new)
    CR1 = convert(CR_s_new)

    CL2 = convert(CL_r_new)
    CR2 = convert(CR_r_new)

    tx = contract_instance.functions.updateBalance(y_str, CL1, CR1, yr_str, CL2, CR2).buildTransaction({'nonce': w3.eth.getTransactionCount(admin_address)})
    signed_tx = w3.eth.account.signTransaction(tx, admin_key)
    hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print("Server confirms proof Tx : ", hash.hex())
    # print("info " , info)

def handle_event_transfer(event):
    
    data = Web3.toJSON(event)
    # print("Event ", event)
    data = json.loads(data)
    data = data['args']
    id = data['id']
    proofForAmt = data['rangeproof1']
    proofForAmt = json.loads(proofForAmt)
    # proof1 = json.loads(proof1)

    # proofForAmt = json.loads(proofForAmt)
    print()
    proofForRemain = data['rangeproof2']
    proofForRemain = json.loads(proofForRemain)

    sigmaProof = data['sigmaProof']
    sigmaProof = json.loads(sigmaProof)

    info = data['input']
    info = json.loads(info)

    print("\n** Prove the sending amount is positive ** ")
    ok = handle_range_proof(proofForAmt)
    if (ok):
        # print("\n** Prove the remain balance is positive **")
        ok = handle_range_proof(proofForRemain)
        if (ok):
            print("\n** Sigma Protocol ** \n")
            ok = handle_sigma_proof(sigmaProof, info)
            if (ok):
                return homo_computation(info)

    print("Invalid")

    tx = contract_instance.functions.confirmProof(id, ok).buildTransaction({'nonce': w3.eth.getTransactionCount(admin_address)})
    signed_tx = w3.eth.account.signTransaction(tx, admin_key)
    hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print(hash.hex())

async def log_loop(event_filter, poll_interval):
    while True:
        for PairCreated in event_filter.get_new_entries():
            handle_event_transfer(PairCreated)
    
        await asyncio.sleep(poll_interval)



    
if __name__ == '__main__':
    
    print('Connected ', w3.isConnected())
    # initBalance()
    check_newUser()
    

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