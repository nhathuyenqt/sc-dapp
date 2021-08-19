from json import encoder
from os import X_OK
import time
from flask import Flask
from flask import request, jsonify
from Prover import Prover
from FieldVector import * 
from SigmaProtocol import *
import json
from ElGama import *
import asyncio
import os.path
from os import path
MAX = 20000

addr = json.load(open('./../../src/contract_address.json'))
contract_address = addr['contract_address']

deployedContract =  json.load(open('./../../src/artifacts/contracts/Xcontract.sol/XContract.json'))
abi = deployedContract['abi']
bytecode = deployedContract['bytecode']
# contract = w3.eth.contract(abi=abi, bytecode=bytecode)

contract_instance = w3.eth.contract(abi=abi, address=contract_address)
# acc_address = '0x492dc9d2201c07617C937a193048A7be320f677A'
# key = '0xb4dde0d4f2685c127ae8e7644508ac7c70472bd9d38b4a464884ae158120e162'
# acc_address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
# key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

# key1 = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
# acct = w3.eth.account.privateKeyToAccount(key1)
# acc_address1 = acct.address


initB = 200
# acct = w3.eth.account.privateKeyToAccount(key)

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    print(time.time())
    
    return {'time': time.time()}


def initBalance(y, user_account):

    y_hex = reverse(y)
    r = group1.random(ZR)
    CR = g**r
    CR = convert(CR)
    CL = g**initB*(y_hex**r)
    CL = convert(CL)

    tx = contract_instance.functions.initPocket(y, CL, CR).buildTransaction({'nonce': w3.eth.getTransactionCount(user_account.address), 'from': user_account.address})
    signed_tx = w3.eth.account.signTransaction(tx, user_account.privateKey)
    hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print("Init EL Balance ", hash.hex())
    return {
            'CL':CL,
            'CR':CR,
            'b':initB
        }      
    

def genKey(uid, user_key):
    user_account = w3.eth.account.privateKeyToAccount(user_key)
    user_address = user_account.address
    # if 'uid' in request.get_json():
    #     uid = request.get_json()['uid']
    x = group1.random(ZR)
    y = g**x
    data = {
            'y': convert(y),
            'x' : convert(x)
        }
    file_name = 'key/' + uid + '.txt'
    with open(file_name, 'w') as outfile:
        json.dump(data, outfile)
    outfile.close()

    balance = initBalance(data['y'], user_account)  

    message = {
        'status': 200,
        'message': 'OK',
        'data': data,
        'balance': balance,
        'privateKey' : user_key
    }
    print(message)
    resp = jsonify(message)
    resp.status_code = 200  
    return resp
    
@app.route('/fetchKey', methods=['POST'])
def fetchKey():
    if 'uid' in request.get_json():
        uid = request.get_json()['uid']
    if 'address' in request.get_json():
        user_address = request.get_json()['address']
    if path.exists('accounts.txt'):
        f = open('accounts.txt', 'r+')
        data = json.load(f)
        f.close()
        user_address = user_address.lower()
        print("current address ", user_address)
        user_key = data[user_address]
        user_account = w3.eth.account.privateKeyToAccount(user_key)
        user_address = user_account.address


    file_name = 'key/' + uid + '.txt'
    print("\n\n?? Found key in file ", path.exists(file_name))
    if path.exists(file_name):
        f = open(file_name, 'r+')
        data = json.load(f)
        f.close()
        x = data['x']
        y = data['y']
        print(data)
        balance = readElBalance(x, y, user_account)

        message = {
            'status': 200,
            'message': 'OK',
            'data': data,
            'balance': balance,
            'privateKey' : user_key
        }
        print(message)
        resp = jsonify(message)
        resp.status_code = 200
        return resp
    else:
        return genKey(uid, user_key)

def readElBalance(x, y, user_account):

    balance = contract_instance.functions.ElBalanceOf(y).call({'from': user_account.address})
    (CL, CR) = balance
    if (CL == ''):
        return initBalance(y, user_account)

    x =reverse(x)
    y = reverse(y)
    

    print("Encrypted balance stored in Smart Contract\n", (CL, CR))
    CL_hex = reverse(CL)
    CR_hex = reverse(CR)
    b = 0
    for i in range(MAX+1):
        if ((CR_hex**x * g**i) == CL_hex):
            b = i
            break

    print("Raw balance ", b)

    response = {'b':b, 'CL': CL, 'CR': CR}
    return response

@app.route('/getElBalance', methods=['POST'])
def getElBalance():
    print(request.get_json())
    if 'user_key' in request.get_json():
        user_key = request.get_json()['user_key']
    if 'y' in request.get_json():
        y = request.get_json()['y']
    if 'x' in request.get_json():
        x = request.get_json()['x']
    if 'g' in request.get_json():
        g = request.get_json()['g']

    user_account = w3.eth.account.privateKeyToAccount(user_key)
    user_address = user_account.address
    b = readElBalance(x, y, user_account)
    
    message = {
        'status': 200,
        'message': 'OK',
        'balance': b
    }

    resp = jsonify(message)
    resp.status_code = 200
    return resp


@app.route('/newPost', methods=['POST'])
def newPost():

    if 'content' in request.get_json():
        content = request.get_json()['content']
    if 'privateKey' in request.get_json():
        user_key = request.get_json()['privateKey']
    
    user_account = w3.eth.account.privateKeyToAccount(user_key)

    tx = contract_instance.functions.postTask(content).buildTransaction({'nonce': w3.eth.getTransactionCount(user_account.address), 'from': user_account.address})
    signed_tx = w3.eth.account.signTransaction(tx, user_account.privateKey)
    hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print("Tx ", hash.hex())

    message = {
        'status': 200,
        'message': 'OK',
    }

    resp = jsonify(message)
    resp.status_code = 200
    return resp

@app.route('/loadTasks', methods=['POST'])
def loadTasks():
    print(request.get_json())
    if 'user_key' in request.get_json():
        user_key = request.get_json()['user_key']

    user_account = w3.eth.account.privateKeyToAccount(user_key)
    tx = contract_instance.functions.getAllAvailableTasks().call({'from': user_account.address})
    print(tx)
    # tasks = []
    # for task in tx:
    #     t = {'id': task[0], 'des':tas}
    #     tasks.append(t)
    # print(tasks)
    message = {
        'status': 200,
        'message': 'OK',
        'data' : tx
    }
    resp = jsonify(message)
    resp.status_code = 200
    return resp

@app.route('/loadYourTasks', methods=['POST'])
def loadYourTasks():
    if 'user_key' in request.get_json():
        user_key = request.get_json()['user_key']
    user_account = w3.eth.account.privateKeyToAccount(user_key)
    tx = contract_instance.functions.getYourTasks().call({'from': user_account.address})
    message = {
        'status': 200,
        'message': 'OK',
        'data' : tx
    }
    resp = jsonify(message)
    resp.status_code = 200
    return resp

@app.route('/sendPrice', methods=['POST'])
def sendPrice():

    if 'id' in request.get_json():
        id = request.get_json()['id']
    if 'user_key' in request.get_json():
        user_key = request.get_json()['user_key']
    if 'pubkeyOfRequest' in request.get_json():
        pubkey = request.get_json()['pubkeyOfRequest']
    if 'price' in request.get_json():
        price = request.get_json()['price']
    
    price = int(price)
    print("Pubkey ", pubkey)
    y = reverse(pubkey)
    r = group1.random(ZR)
    CL_price = convert(g**price*y**r)
    CR_price = convert(g**r)
    print("raw price ", price," => {}, {}".format(CL_price, CR_price))
    user_account = w3.eth.account.privateKeyToAccount(user_key)

    tx = contract_instance.functions.raiseAPrice(id, CL_price, CR_price).buildTransaction({'nonce': w3.eth.getTransactionCount(user_account.address), 'from': user_account.address})
    signed_tx = w3.eth.account.signTransaction(tx, user_account.privateKey)
    hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print("Tx ", hash.hex())

    message = {
        'status': 200,
        'message': 'OK',
    }

    resp = jsonify(message)
    resp.status_code = 200
    return resp

def loadOffers(id, user_key, x):
    id = int(id)
    user_account = w3.eth.account.privateKeyToAccount(user_key)
    tx = contract_instance.functions.loadOffers(id).call({'from': user_account.address})
    print(tx)
    x = reverse(x)
    min_deal = 0
    min_price = MAX+1
    for offer in tx:
        (CL, CR) = offer[1]
        CL_hex = reverse(CL)
        CR_hex = reverse(CR)
        b = 0
        for i in range(MAX+1):
            if ((CR_hex**x * g**i) == CL_hex):
                b = i
                break
        if (b<min_price):
            min_price = b
        min_deal = offer
    if min_deal == 0:
        min_deal = None
    message = {
        'deal': min_deal,
        'raw_price': min_price
    }

    return message

@app.route('/loadMinOffer', methods=['POST'])
def loadMinOffer():

    if 'id' in request.get_json():
        id = request.get_json()['id']
    if 'user_key' in request.get_json():
        user_key = request.get_json()['user_key']
    if 'x' in request.get_json():
        x = request.get_json()['x']
    print("id ", id, " ", type(id))
    min_offer = loadOffers(id, user_key, x)
    

    message = {
        'status': 200,
        'message': 'OK',
        'min_offer' : min_offer
    }

    resp = jsonify(message)
    resp.status_code = 200
    return resp

@app.route('/acceptDeal', methods=['POST'])
def acceptDeal():
    if 'requestId' in request.get_json():
        requestId = request.get_json()['requestId']
    if 'user_key' in request.get_json():
        user_key = request.get_json()['user_key']
    if 'dealId' in request.get_json():
        dealId = request.get_json()['dealId']
    print("Accept Deal ", requestId, "  + ", dealId)
    requestId_str = str(requestId)

    user_account = w3.eth.account.privateKeyToAccount(user_key)

    # tx = contract_instance.functions.acceptDeal(requestId, dealId, requestId_str).call({'from': user_account.address})
    tx = contract_instance.functions.acceptDeal(requestId, dealId, requestId_str).buildTransaction({'nonce': w3.eth.getTransactionCount(user_account.address), 'from': user_account.address})
    signed_tx = w3.eth.account.signTransaction(tx, user_account.privateKey)
    hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    

    message = {
        'status': 200,
        'message': 'OK',
    }

    resp = jsonify(message)
    resp.status_code = 200
    return resp

@app.route('/getMessages', methods=['POST'])
def getMessages():

    if 'user_key' in request.get_json():
        user_key = request.get_json()['user_key']
    user_account = w3.eth.account.privateKeyToAccount(user_key)

    user_account = w3.eth.account.privateKeyToAccount(user_key)

    # tx = contract_instance.functions.acceptDeal(requestId, dealId, requestId_str).call({'from': user_account.address})
    tx = contract_instance.functions.getMessages().call({'from': user_account.address})

    print("Tx ", tx)

    message = {
        'status': 200,
        'message': tx
    }

    resp = jsonify(message)
    resp.status_code = 200
    return resp

# @app.route('/genProof', methods=['POST', 'GET'])
# def genProof():
#     # if accId == 1:
#     #     acc_address = acc_address1
#     #     key = key1
#     # else:
#     #     acc_address = acc_address0
#     #     key = key0
#     # if 'address' in request.args:
#     #     add = request.args.get('address')
#     #     pwd = request.args.get('pwd')

#     prover = Prover()
#     p, c = prover.prove(200)
    
#     c.x = convert(c.x)
#     c.y = convert(c.y)
#     c.z = convert(c.z)
#     c.g = convert(c.g)
#     c.h = convert(c.h)
#     c.g_vec = convert(c.g_vec)
#     c.h_vec = convert(c.h_vec)
#     challenge = {'x': c.x,'y': c.y, 'z' : c.z,'g':c.g, 'h': c.h, 'g_vec':c.g_vec, 'h_vec': c.h_vec}
    
#     proof =  {
#         'gama': convert(p.gama),
#         'taux': convert(p.taux), 'muy': convert(p.muy),
#         't' : convert(p.t),
#         'l' : convert(p.l),
#         'r' : convert(p.r),
#         'A' : convert(p.A),
#         'S' : convert(p.S),
#         'T1' : convert(p.T1),
#         'T2' : convert(p.T2),
#         'V' : convert(p.V),
#         'sigma' : convert(p.sigma)}
#     # res_json = json.loads(json.dumps(res))

#     proofsend = json.dumps(proof)
#     tx = contract_instance.functions.privateTransfer(proofsend).buildTransaction({'nonce': w3.eth.getTransactionCount(acc_address0)})
#     signed_tx = w3.eth.account.signTransaction(tx, key0)
#     hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)
#     print("private transfer ", hash.hex())


#     message = {
#         'status': 200,
#         'message': 'OK',
#         'data': {
#             'challenge':challenge,
#             'proof' : proof
#         }
#     }
#     resp = jsonify(message)
#     resp.status_code = 200
#     print("=>>>>>>> hello: " , type(resp))
#     return resp


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

@app.route('/genConfProof', methods=['POST'])
def genConfProof():
    if 'user_address' in request.get_json():
        user_address = request.get_json()['user_address']
    if 'privateKey' in request.get_json():
        user_key = request.get_json()['privateKey']
    if 'y_sender' in request.get_json():
        yS = request.get_json()['y_sender']
    if 'x_sender' in request.get_json():
        sk = request.get_json()['x_sender']
    if 'y_recipient' in request.get_json():
        yR = request.get_json()['y_recipient']
    if 'amt' in request.get_json():
        amt = request.get_json()['amt']        
    if 'b_after' in request.get_json():
        b_after = request.get_json()['b_after']
    print("api key ", user_key)
    user_account = w3.eth.account.privateKeyToAccount(user_key)
    print("Transfer from ", yS, "to", yR)
    res = readElBalance(sk, yS, user_account)

    amt = int(amt)

    b = res['b']
    if (b < amt):
        err = 'Insufficient balance'
        resp = {'code': -1, 'err':err}
        return resp

    CL = res['CL']
    CR = res['CR']
    # balance = contract_instance.functions.ElBalanceOf(yS).call()

    # (CL, CR) = balance

    # CL = reverse(CL)
    # CR = reverse(CR)
    sk =reverse(sk)
    yS = reverse(yS)
    yR = reverse(yR)
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
    result = {'code':200, 'rangeProofForAmt':rangeProofForAmt, 'rangeProofForRemainBalance':rangeProofForRemainBalance, 'sigmaProtocol': sigmaProof, 'input': input}
    # print("check type ", type(json.dumps(rangeProofForAmt)))
    # result = contract_instance.functions.confTransfer(json.dumps(rangeProofForAmt), json.dumps(rangeProofForRemainBalance)).call()
    # print(" =>>>>> result of balance ", result)
    pr1  = json.dumps(rangeProofForAmt)
    pr2 = json.dumps(rangeProofForRemainBalance)
    pr3 = json.dumps(sigmaProof)
    input = json.dumps(input) 
    print("contract address ", contract_address)
    print("sender ", user_account.address)
    gas = contract_instance.functions.confTransfer(pr1, pr2, pr3, input).estimateGas({'from': user_account.address})
    
    tx = contract_instance.functions.confTransfer(pr1, pr2, pr3, input).buildTransaction({'nonce': w3.eth.getTransactionCount(user_account.address),  'from': user_account.address})
    signed_tx = w3.eth.account.signTransaction(tx, user_key)
    hash= w3.eth.sendRawTransaction(signed_tx.rawTransaction)

    return result

