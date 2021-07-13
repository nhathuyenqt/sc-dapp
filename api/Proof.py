from GlobalConfig import *
from FieldVector import *

class Proof:
    def __init__(self):
        self.t = None

    def set(self, _taux, _muy, _t, _l, _r, _A, _S, _T1, _T2, _V, _sig):
        self.taux = _taux
        self.muy = _muy
        self.t = _t
        self.l = _l
        self.r = _r
        self.A = _A
        self.S = _S
        self.T1 = _T1
        self.T2 = _T2
        self.V = _V
        self.sigma = _sig
        # print('___PROOF___')
        # print("taux ", _taux)
        # print("muy ", _muy)
        # print("t ", _t)

class Challenge:
    def __init__(self):
        self.x = 0

    def set(self, _x, _y, _z):
        self.x = _x
        self.y = _y
        self.z = _z
