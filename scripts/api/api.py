import time
from flask import Flask
from flask import request, jsonify
from Prover import Prover
from FieldVector import * 
import json
from ElGama import *
from web3 import Web3, HTTPProvider

w3 = Web3(HTTPProvider("https://rinkeby.infura.io/v3/5a2983b2fe824192949e7e0f80494758"))
deployedContract =  json.load(open('./../../src/artifacts/contracts/Xcontract.sol/XContract.json'))
abi = deployedContract['abi']
bytecode = deployedContract['bytecode']
# contract = w3.eth.contract(abi=abi, bytecode=bytecode)
contract_instance = w3.eth.contract(abi=abi, address=contract_address)
acc_address = '0x492dc9d2201c07617C937a193048A7be320f677A'

key = '0xb4dde0d4f2685c127ae8e7644508ac7c70472bd9d38b4a464884ae158120e162'
acct = w3.eth.account.privateKeyToAccount(key)

app = Flask(__name__)
el = ElGamal(group1)

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

@app.route('/genKey', methods=['GET'])
def genKey():
    (public_key, secret_key) = el.keygen()
    g = public_key['g']
    h = public_key['h']
    y = convert(public_key['h'])
    x = convert(secret_key['x'])
    data = {
            'g': convert(g),
            'y': y,
            'x' : x
        }
    message = {
        'status': 200,
        'message': 'OK',
        'data': data        
    }
    print("=>>>>>>> public_key: " , type(secret_key['x']))
    print(message)
    resp = jsonify(message)
    resp.status_code = 200
    print("=>>>>>>> hello: " , type(resp))
    r = group1.random(ZR)
    CR = g**r
    CR = convert(CR)
    CL = g**200*(h**r)
    CL = convert(CL)
    tx = contract_instance.functions.initElBalance(y, CL, CR).buildTransaction({'nonce': w3.eth.getTransactionCount(acc_address)})
    signed_tx = w3.eth.account.signTransaction(tx, key)
    hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print("Init EL Balance ", hash.hex())
    return resp

@app.route('/getElBalance', methods=['POST'])
def getElBalance(y):
    result = contract_instance.functions.getElBalance(y).call()
    print(" =>>>>> result ", result)
    # return resp

@app.route('/genProof', methods=['POST', 'GET'])
def genProof():
    if 'amt' in request.args:
        req = request.args.get('amt')
        print(req)

    prover = Prover()
    gama = group1.random(ZR)

    p, c = prover.prove(200, gama)
    
    c.x = convert(c.x)
    c.y = convert(c.y)
    c.z = convert(c.z)
    c.g = convert(c.g)
    c.h = convert(c.h)
    c.g_vec = convert(c.g_vec)
    c.h_vec = convert(c.h_vec)
    challenge = {'x': c.x,'y': c.y, 'z' : c.z,'g':c.g, 'h': c.h, 'g_vec':c.g_vec, 'h_vec': c.h_vec}
    
    proof =  {'taux': convert(p.taux), 'muy': convert(p.muy),
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
