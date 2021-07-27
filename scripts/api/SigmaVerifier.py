from charm.toolbox.ecgroup import ECGroup,ZR,G
from charm.toolbox.eccurve import secp256k1
group1 = ECGroup(secp256k1)

def sigmaVerify(data, info):
    y = info['y']
    yr = info['yr']
    D = info['D']
    C = info['C']
    Cr = info['Cr']
    T = data['T']
    t = data['t']
    g = data['g']
    h = data['h']
    Ay = data['Ay']
    AD = data['AD']
    Ab = data['Ab']
    Ayr = data['Ayr']
    At = data['At']
    c = group1.hash((Ay, AD, Ab, Ayr, At), ZR)
    ssk = data['ssk']
    sr = data ['sr']
    sb = data['sb']
    stau = data['stau']

    if (g**ssk != Ay*(y**c)):
        return False

    if (g**sr != AD*(D**c)):
        return False

    if (((y/yr))**sr != Ayr*((C/Cr)**c)):
        return False

    if (At*(T**c) != (g**(t*c-sb)*(h**stau))):
        return False

    return True