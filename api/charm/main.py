from Verifier import Verifier
from Prover import Prover
from GlobalConfig import *

if __name__ == '__main__':
    prover = Prover()
    gama = group1.random(ZR)
    p, c = prover.prove(200, gama)

    verifer = Verifier()
    verifer.verify(p, c)
    
