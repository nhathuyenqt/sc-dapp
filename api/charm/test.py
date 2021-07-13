# from charm.toolbox.pgroup import IntegerGroup

# group1 = IntegerGroup()
# group1.paramgen(1024)

# g = group1.randomGen()

from charm.toolbox.pairinggroup import PairingGroup,ZR,G1,G2,GT,pair

group2 = PairingGroup('SS512')

g = group2.random(G1)
g = group2.random(G2)
print(g)