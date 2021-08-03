from charm.toolbox.ecgroup import ECGroup,ZR,G
from charm.toolbox.eccurve import  secp256k1
group1 = ECGroup(secp256k1)
str_input = "hello123"
c = group1.hash(str_input, ZR)