# from Verifier import Verifier
from Prover import Prover
from FieldVector import *




if __name__ == '__main__':
    prover = Prover()
    gama = group1.random(ZR)
    p, c = prover.prove(200)
    print("p.l ", type(p.l))
    print(convert(p.l))
    verifer = Verifier()
    verifer.verify(p, c)
    
