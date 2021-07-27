# from charm.toolbox.integergroup import IntegerGroup
# from charm.toolbox.pairinggroup import PairingGroup,ZR,G1,G2,GT,pair
from charm.toolbox.ecgroup import ECGroup,ZR,G
from charm.toolbox.eccurve import prime192v1, secp256k1
import numpy as np
import json
from web3 import Web3, HTTPProvider

# w3 = Web3(HTTPProvider("https://rinkeby.infura.io/v3/6c2c14ab150c43cfb4a59654a7c5bb8c"))
w3 = Web3(HTTPProvider("http://localhost:8545"))
print('Connected ', w3.isConnected())
n = 128
# global group
# group = IntegerGroup()
# group.paramgen(1024)
global group1
# group1 = PairingGroup('SS512')
group1 = ECGroup(secp256k1)

# rand = group2.random(ZR)
# print("rand ", rand)

def subtract(vec1, vec2):

    res = [vec1[i] - vec2[i] for i in range(n)]
    return res

def hadamard_product(vec1, vec2):

    had = []
    for i in range(n):
        had.append(vec1[i] * vec2[i])
    return had
    
def mul(vec, num):
    res = [vec[i] *num for i in range(n)]
    return res

def add(vec1, vec2):
    res = []
    for i in range(n):
        res.append(vec1[i] + vec2[i])
    return res

def exp_vector(x, y):
    res = (x[0]**y[0])
    # print("x = ", x)
    for i in range(1, len(x)):
        # print("x = ", x[i], " \ny= ",group1.init(ZR, y[i]))
        # print("x = ", x[i], " \ny= ", y[i], type(y[i]))
        # res = res * (x[i]**group1.init(ZR, y[i]))
        res = res* (x[i]**y[i])
    return res

def inner_product(vec1, vec2):
    product = group1.init(ZR, 0)
    # print("ccheck vec")
    # print(vec1[0])
    # print(vec2[0])
    
    for i in range(n):
        product = product + vec1[i]*vec2[i]
    
    return product


uni_vec = [group1.init(ZR, 1) for i in range(n)]

bin_vec = [group1.init(ZR, 2**i) for i in range(n)]

