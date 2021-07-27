
from FieldVector import *
from SigmaVerifier import *

class SigmaProtocol:
    
    def __init__(self, sender, recipient, g):
        # self.g_vec = [group1.random(G) for i in range(n)]
        # self.h_vec = [group1.random(G) for i in range(n)]
        self.h = group1.random(G)
        self.g = g
        self.y = sender
        self.yr = recipient
       
    def prove(self, sk, amt, b_after, t_hat, tau, z, sigma):
        r = group1.random(ZR)
        print(type(amt))
        print(self.g**amt)
        print(self.y**r)
        print((self.g**amt)*(self.y**r))
        D = self.g**r
        C = (self.g**amt)*(self.y**r)
        C_ = (self.g**amt)*(self.yr**r)
        
        
        k_sk = group1.random(ZR)
        k_r = group1.random(ZR)
        k_b = group1.random(ZR)
        k_tau = group1.random(ZR)

        # z = group1.random(ZR)
        # y_vec = [self.y**i for i in range(n)]
        # i1 = inner_product(uni_vec, y_vec)
        # i2 = inner_product(uni_vec, bin_vec)
        # sigma = (z-z*z)*i1 - z*z*z*i2
        t = t_hat - sigma
        T = self.g**(t-amt*z*z - b_after*z*z*z) *(self.h**tau)

        A_y = self.g ** k_sk
        A_D = self.g ** k_r
        A_b = (self.g**k_b)*(D**(-k_sk*(z*z)))
        A_yr = (self.y/self.yr)**k_r
        A_t = (self.g**(-k_b))*(self.h**k_tau)

        c = group1.hash((A_y, A_D, A_b, A_yr, A_t), ZR)

        s_sk = k_sk + (c*sk)
        s_r = k_r + (c*r)
        s_b = c*(amt*z*z +b_after*z*z*z) + k_b
        s_tau = c*tau + k_tau
        print(self.y**c)

        print((self.g**sk)**c)
        print(self.g**c*(self.g**sk))
        print()
        
        data = {'y': self.y, 'yr': self.yr, 'C': C, 'Cr': C_, 'D':D}
        res = {'Ay' : A_y, 'AD': A_D, 'Ab': A_b, 'Ayr':A_yr, 'At':A_t, 'ssk':s_sk, 'sr':s_r, 'sb': s_b, 'stau': s_tau, 't' : t, 'g': self.g, 'h': self.h, 'T':T}
      
        return res, data


