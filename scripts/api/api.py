import time
from flask import Flask
from flask import request, jsonify
from Prover import Prover
from FieldVector import * 
from SigmaProtocol import *
import json
from ElGama import *
import asyncio


addr = json.load(open('./../../src/contract_address.json'))
contract_address = addr['contract_address']

deployedContract =  json.load(open('./../../src/artifacts/contracts/Xcontract.sol/XContract.json'))
abi = deployedContract['abi']
bytecode = deployedContract['bytecode']
# contract = w3.eth.contract(abi=abi, bytecode=bytecode)

contract_instance = w3.eth.contract(abi=abi, address=contract_address)
# acc_address = '0x492dc9d2201c07617C937a193048A7be320f677A'
# key = '0xb4dde0d4f2685c127ae8e7644508ac7c70472bd9d38b4a464884ae158120e162'
acc_address0 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
key0 = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

key1 = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
acct = w3.eth.account.privateKeyToAccount(key1)
acc_address1 = acct.address

# acc_address0 = "0xC5e65BF63b33B865e78A02b13f0db60713c3Ff96"
# key0 = "35b2f7395b5fd9a256dc9ecc113e04a0777dcd3660bb7b6a4d7687c7ef3c7ed1"
# acc_address1 = "0x9139a76E363d2283ED56592519fFdD876C48EB68"
# key1 = "daa521e0a25e3ee527ea9992a6aeb7b141cf25dbb88cf485ad8c1061e2cd82b3"

global y1 
y1 = 1
global y0
y0 = 0
global initB
initB = 200
# acct = w3.eth.account.privateKeyToAccount(key)

app = Flask(__name__)


def reverse(a):
    if (type(a) ==  list):
        for i in range(len(a)):
            a[i] = reverse(a[i])
        return a
    else:
        return group1.deserialize(a.encode("utf-8"))

def convert(a):
    if (type(a) ==  list):
        for i in range(len(a)):
            a[i] = convert(a[i])
        return a
    else:
        return group1.serialize(a).decode("utf-8")

@app.route('/time')
def get_current_time():
    print(time.time())
    
    return {'time': time.time()}

@app.route('/genKey', methods=['POST'])
def genKey():

    global y1, y0, initB
    if 'accId' in request.get_json():
        accId = request.get_json()['accId']
    accId = int(accId)
    print("acc ID ", accId)

    x = group1.random(ZR)
    g = group1.random(G)
    y = g**x

    
    data = {
            'g': convert(g),
            'y': convert(y),
            'x' : convert(x)
        }
    message = {
        'status': 200,
        'message': 'OK',
        'data': data        
    }
    # print("=>>>>>>> public_key: " , type(secret_key['x']))
    print(message)
    resp = jsonify(message)
    resp.status_code = 200
    print("=>>>>>>> hello: " , type(resp))
    r = group1.random(ZR)
    CR = g**r
    CR = convert(CR)
    CL = g**initB*(y**r)
    CL = convert(CL)
    if (accId == 1):
        acc_address = acc_address1
        key = key1
        y1 = convert(y)
    else:
        acc_address = acc_address0
        key = key0
        y0 = convert(y)

    print("y0 ", y0)
    print("y1 ", y1)
    print("g ", g)

    tx = contract_instance.functions.initElBalance(data['y'], CL, CR).buildTransaction({'nonce': w3.eth.getTransactionCount(acc_address)})
    signed_tx = w3.eth.account.signTransaction(tx, key)
    hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print("Init EL Balance ", hash.hex())
    return resp

@app.route('/getElBalance', methods=['POST'])
def getElBalance():
    global y1, y0
    if 'accId' in request.get_json():
        accId = request.get_json()['accId']
    accId = int(accId)
    print("y0 ", y0)
    print("y1 ", y1)

    if accId == 1:
        y = y1
    else:
        y = y0

    print("check pubkey ", type(y))
    result = contract_instance.functions.ElBalanceOf(y).call()
    print(" =>>>>> result of balance ", result)
    
    message = {
        'status': 200,
        'message': 'OK',
        'data': result
    }
    resp = jsonify(message)
    resp.status_code = 200
    return resp

@app.route('/genProof', methods=['POST', 'GET'])
def genProof():
    # if accId == 1:
    #     acc_address = acc_address1
    #     key = key1
    # else:
    #     acc_address = acc_address0
    #     key = key0
    # if 'address' in request.args:
    #     add = request.args.get('address')
    #     pwd = request.args.get('pwd')

    prover = Prover()
    p, c = prover.prove(200)
    
    c.x = convert(c.x)
    c.y = convert(c.y)
    c.z = convert(c.z)
    c.g = convert(c.g)
    c.h = convert(c.h)
    c.g_vec = convert(c.g_vec)
    c.h_vec = convert(c.h_vec)
    challenge = {'x': c.x,'y': c.y, 'z' : c.z,'g':c.g, 'h': c.h, 'g_vec':c.g_vec, 'h_vec': c.h_vec}
    
    proof =  {
        'gama': convert(p.gama),
        'taux': convert(p.taux), 'muy': convert(p.muy),
        't' : convert(p.t),
        'l' : convert(p.l),
        'r' : convert(p.r),
        'A' : convert(p.A),
        'S' : convert(p.S),
        'T1' : convert(p.T1),
        'T2' : convert(p.T2),
        'V' : convert(p.V),
        'sigma' : convert(p.sigma)}
    # res_json = json.loads(json.dumps(res))

    proofsend = json.dumps(proof)
    tx = contract_instance.functions.privateTransfer(proofsend).buildTransaction({'nonce': w3.eth.getTransactionCount(acc_address0)})
    signed_tx = w3.eth.account.signTransaction(tx, key0)
    hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print("private transfer ", hash.hex())


    message = {
        'status': 200,
        'message': 'OK',
        'data': {
            'challenge':challenge,
            'proof' : proof
        }
    }
    resp = jsonify(message)
    resp.status_code = 200
    print("=>>>>>>> hello: " , type(resp))
    return resp


def convertProofToJSON(p, c):
    # for key in c.keys():
    #     c[key] = convert(c[key])
    c.x = convert(c.x)
    c.y = convert(c.y)
    c.z = convert(c.z)
    c.g = convert(c.g)
    c.h = convert(c.h)
    c.g_vec = convert(c.g_vec)
    c.h_vec = convert(c.h_vec)
    challenge = {'x': c.x,'y': c.y, 'z' : c.z,'g':c.g, 'h': c.h, 'g_vec':c.g_vec, 'h_vec': c.h_vec}
    
    proof =  {
        'gama': convert(p.gama),
        'taux': convert(p.taux), 'muy': convert(p.muy),
        't' : convert(p.t),
        'l' : convert(p.l),
        'r' : convert(p.r),
        'A' : convert(p.A),
        'S' : convert(p.S),
        'T1' : convert(p.T1),
        'T2' : convert(p.T2),
        'V' : convert(p.V),
        'sigma' : convert(p.sigma)}
    res = {
            'challenge':challenge,
            'proof' : proof
        }
    return res

@app.route('/confTransfer', methods=['POST'])
def confTransfer():
    if 'y_sender' in request.get_json():
        yS = request.get_json()['y_sender']
    if 'x_sender' in request.get_json():
        sk = request.get_json()['x_sender']
    if 'g_sender' in request.get_json():
        g = request.get_json()['g_sender']
    if 'y_recipient' in request.get_json():
        yR = request.get_json()['y_recipient']
    if 'amt' in request.get_json():
        amt = request.get_json()['amt']        
    if 'b_after' in request.get_json():
        b_after = request.get_json()['b_after']
    
    balance = contract_instance.functions.ElBalanceOf(yS).call()

    (CL, CR) = balance

    CL = reverse(CL)
    CR = reverse(CR)
    g = reverse(g)
    sk =reverse(sk)
    yS = reverse(yS)
    yR = reverse(yR)

    amt = int(amt)
    b_after = int(b_after)
    p = Prover()
    p1, c1 = p.prove(amt)
    rangeProofForAmt  = convertProofToJSON(p1, c1)
    p = Prover()
    p2, c2 = p.prove(b_after)
    sigma = p2.sigma
    z = c2.z
    rangeProofForRemainBalance = convertProofToJSON(p2, c2)

    sigmaProtocol = SigmaProtocol(yS, yR, g)
    amt = group1.init(ZR, amt)
    sigmaProof, input = sigmaProtocol.prove(sk, amt, b_after, p2.t, p2.taux, z, sigma)
    for key in sigmaProof.keys():
        sigmaProof[key] = convert(sigmaProof[key])
    for key in input.keys():
        input[key] = convert(input[key])
    # print("sigm ", sigmaProof)
    result = {'rangeProofForAmt':rangeProofForAmt, 'rangeProofForRemainBalance':rangeProofForRemainBalance, 'sigmaProtocol': sigmaProof, 'input': input}
    # print("check type ", type(json.dumps(rangeProofForAmt)))
    # result = contract_instance.functions.confTransfer(json.dumps(rangeProofForAmt), json.dumps(rangeProofForRemainBalance)).call()
    # print(" =>>>>> result of balance ", result)
 
    return result

