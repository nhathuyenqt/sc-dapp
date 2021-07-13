from GlobalConfig import *


    
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
    for i in range(n):
        product = product + vec1[i]*vec2[i]
    return product


uni_vec = [group1.init(ZR, 1) for i in range(n)]

bin_vec = [group1.init(ZR, 2**i) for i in range(n)]

