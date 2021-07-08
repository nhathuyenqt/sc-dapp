from Prover import exp_vector
from GlobalConfig import *
from FieldVector import *
from Proof import *

class Verifier:
    def __init__(self):
        self.proof = None


    def verify(self, proof, challenge):
        x = challenge.x
        y = challenge.y
        z = challenge.z
        y_vector = [y**i for i in range(n)]

        res = True
        #compute commitment l(x) r(x) 

        minus_z = mul(uni_vec, -z)

        print("-------------")
        print("Condition : Check t_hat ==? t(x) :")
        gthx = (g**proof.t) * (h**proof.taux)
        gthxV = (proof.V**z*z) * (g**proof.sigma) * proof.T1**x * (proof.T2**(x*x))
        # print("gthx = ", gthx)
        # print("gthxV = ", gthxV)
        if (gthx == gthxV):
            print("True")
        else:
            print("False")
            res = False

        print("-------------")
        print("Condition : Check l and r ")
        second_exp = add(mul(y_vector, z), mul(bin_vec, z*z))
        hh_vec = [h_vec[i]**((y **(-1))**i) for i in range(n)]
        P = proof.A*(proof.S**x) *exp_vector(g_vec, minus_z)*exp_vector(hh_vec, second_exp)
        # print("P = ", P)
        P_right = (h**proof.muy)*exp_vector(g_vec, proof.l)*exp_vector(hh_vec, proof.r) 
        # print("PR = ", P_right)
        if (P == P_right):
            print("True")
        else:
            print("False")
            res = False
        print("-------------")
        print("Condition : Check t ? ")
        if (proof.t == inner_product(proof.l, proof.r)):
            print("True")
        else:
            print("False")
            res = False
        print("\n-------------> Final Verify? ", str(res))
        