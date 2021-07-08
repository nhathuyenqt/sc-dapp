# from charm.toolbox.integergroup import IntegerGroup
from charm.toolbox.pairinggroup import PairingGroup,ZR,G1,G2,GT,pair
from charm.toolbox.ecgroup import ECGroup,ZR,G
from charm.toolbox.eccurve import prime192v1
import numpy as np

n = 128
global group
# group = IntegerGroup()
# group.paramgen(1024)
global group1
group1 = PairingGroup('SS512')
# group1 = ECGroup(prime192v1)
g_vec = [group1.random(G) for i in range(n)]
h_vec = [group1.random(G) for i in range(n)]
h = group1.random(G)
g = group1.random(G)

# rand = group2.random(ZR)
# print("rand ", rand)