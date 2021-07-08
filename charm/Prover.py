from Proof import Challenge, Proof
from GlobalConfig import *
from FieldVector import *

class Prover:
    def __init__(self):
        self.v = 0
        # self.g = group1.random(G1)
        # self.h = group1.random(G1)
        # self.g_vec = [group1.random(G1) for i in range(n)]
        
        
        # self.g = group.randomGen()
        # self.h = group.randomGen()
        # self.g_vec = [group.randomGen() for i in range(n)]
        # self.h_vec = [group.randomGen() for i in range(n)]
        

    def cal_a_vector(self):
        vec = np.binary_repr(self.v)
        a_L = [int(vec[len(vec) - i -1]) for i in range(len(vec))]
        # print(vec)
        # print(a_L)
        self.a_L = np.pad(a_L, (0, n-len(a_L)), 'constant')
        self.a_L = [int(x) for x in self.a_L]
        

    def commitment_for_vector(self, x0, x1, x2): 
        # P = h^x0*gvec^x1*hvec^x2
        c = (h**x0)* exp_vector(g_vec,x1)*exp_vector(h_vec,x2)
        # c = c[0]*c[1]
        
        return c
    
    # def fiat_shamir_transformation(self, i, x, c):
    #     return group1.hash(i-1, c, a[i])


    def prove(self, _v, gama):
        self.v = _v
        self.cal_a_vector()
        self.a_L = [group1.init(ZR, x) for x in self.a_L]
        self.a_R = [x-1 for x in self.a_L]
        # print("------------- aL & aR --------\n")
        # print(self.a_L)
        # print(self.a_R)
        
        alpha = group1.random(ZR)
        # print('alpha = ', alpha, type(alpha))
        #(h**alpha)* exp_vector(g_vec,self.a_L)*exp_vector(h_vec,self.a_R)
        self.A = self.commitment_for_vector(alpha, self.a_L, self.a_R) 
    
        s_L = [group1.random(ZR) for i in range(n)]
        s_R = [group1.random(ZR) for i in range(n)]
        phi = group1.random(ZR)
        self.S = self.commitment_for_vector(phi, s_L, s_R)
        # self.S = (h**phi)* exp_vector(g_vec, s_L)*exp_vector(h_vec, s_R)
        
        #Sent 1: A, S to Prover // add A, S to Proof

        #Challenge 1: Points y, z
        y = group1.hash((h, self.A), ZR)
        z = group1.hash((y, self.S), ZR)

        y_vec = [y**i for i in range(n)]

        tau1 = group1.random(ZR)

        tau2 = group1.random(ZR)

        z1 = mul(uni_vec, z)
        l0 = subtract(self.a_L, z1)
        l1 = s_L
        
        r0 = add( hadamard_product(y_vec, add(self.a_R, z1)), mul(bin_vec, z*z))
        r1 = hadamard_product(y_vec, s_R)

        v = inner_product(self.a_L, bin_vec)
        self.V = (h**gama)*(g**v)
        # print("------------- check dk vao --------\n 1 . v =  ",v, "  self.v ",self.v)
        # print(inner_product(self.a_L, hadamard_product(self.a_R, y_vec))) 
        # print(inner_product(subtract(subtract(self.a_L, uni_vec), self.a_R),y_vec))    
        i1 = inner_product(uni_vec, y_vec)
        i2 = inner_product(uni_vec, bin_vec)
        sig = (z-z*z)*i1 - z*z*z*i2
        # print("sigma ", sig)
        # t0 = z*z*v + sig
        # print("\nt0-1")
        # print(t0)
        
        # print("\nt0-2")
        # print(t0)     
        # t3 = inner_product(subtract(self.a_L, z1), add(hadamard_product(y_vec, add(self.a_R, z1)), mul(bin_vec, z*z))) 
        # print("t0-3")
        # print(t3)
        # print("-------------\n")
        t0 = inner_product(l0, r0)
        t2 = inner_product(l1, r1)
        #t1 = <l0 + l1, r0 + r1> - t0 - t2
        t1 = inner_product(add(l0,l1), add(r0,r1)) - t0 - t2
        T1 = (g**t1)*(h**tau1)
        T2 = (g**t2)*(h**tau2)
        print('commitment T1 = ', T1)
        print('commitment T2 = ', T2)
        
        #Challenge 3: Point x step 56
        x = group1.hash((z, T1, T2), ZR)

        # T11 = g**(t1*x)*h**(tau1*x)
        # T12 = T1**x
        # print("check T11 and T12\n", T11,"\n", T12)

        # T21 = g**(t2*x*x)*h**(tau2*x*x)
        # T22 = T2**x*x
        # print("check T21 and T22\n", T21,"\n", T22)

        Vexp = self.V**z*z
        Vexp2 = h**(gama*z*z) * g**(v*z*z)
        print("check Vexp and Vexp\n", Vexp,"\n", Vexp2, "\n")

        l  = add(l0, mul(l1, x))
        r = add(r0, mul(r1, x))
        
        #Send to V
        t = inner_product(l, r)
        taux = tau2*x*x + tau1*x + z*z*gama
        muy =  alpha + phi*x

        challenge  = Challenge()
        challenge.set(x, y, z)

        
        proof = Proof()
        proof.set(taux, muy, t, l, r, self.A, self.S, T1, T2, self.V, sig)

        # print("check t(x)")
        # tx = t0 + t1*x + t2*x*x
        # print(tx)
        # print(proof.t)
        # print("-------------")
        # print("check gh\n")
        # gh = (g**proof.t) * (h**proof.taux)
        # print(gh, "\n")
        
        # gh2 = (proof.V**(z*z)) * (g**proof.sigma) * (proof.T1 ** x) * (proof.T2 **(x*x))
        # print(gh2, "\n")
        # gh2 = (self.V**(z*z)) * (g**sig) * (T1 ** x) * (T2 **x**2)
        # print(gh2, "\n")
        # print("check t(x)")
        # g1 = exp_vector(g_vec, proof.l)
        # g2 = exp_vector(g_vec, self.a_L) * exp_vector(g_vec,mul(s_L,x)) *exp_vector(g_vec,mul(uni_vec, -z))
        # print(g1, "\n")
        # print(g2, "\n")
        # hh_vec = [h_vec[i]**((y **(-1))**i) for i in range(n)]
        # h_ary = exp_vector(hh_vec, hadamard_product(self.a_R, y_vec))
        # h_a = exp_vector(h_vec, self.a_R)
        # print("check h' vector")
        # print(h_a, "\n")
        # print(h_ary, "\n")
        return proof, challenge


