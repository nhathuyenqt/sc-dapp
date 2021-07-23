from ecdsa import SigningKey, SECP256k1, NIST256p
import base58

from eth_keys import keys
from eth_utils import decode_hex

priv_key_bytes = decode_hex('0xb4dde0d4f2685c127ae8e7644508ac7c70472bd9d38b4a464884ae158120e162')
priv_key = keys.PrivateKey(priv_key_bytes)
pub_key = priv_key.public_key
print(pub_key)
print(pub_key.to_hex())
print(pub_key.to_checksum_address())
# assert pub_key.to_hex() == '0x02234ec054aa1ae8aab20a3ee97fa813e5889ada6235138992b8c5fdb92bce3307'

from hashlib import sha256
message = b"message"
public_key = 0xb4dde0d4f2685c127ae8e7644508ac7c70472bd9d38b4a464884ae158120e162
sig = '740894121e1c7f33b174153a7349f6899d0a1d2730e9cc59f674921d8aef73532f63edb9c5dba4877074a937448a37c5c485e0d53419297967e95e9b1bef630d'

vk = SigningKey.from_string(bytes.fromhex(public_key), curve= SECP256k1, hashfunc=sha256) # the default is sha1
vk.verify(bytes.fromhex(sig), message)

sk = SigningKey.generate(curve=SECP256k1)
sk = SigningKey(0xb4dde0d4f2685c127ae8e7644508ac7c70472bd9d38b4a464884ae158120e162)
# sk = SigningKey.generate(curve=NIST256p)
# sk_string = 0xb4dde0d4f2685c127ae8e7644508ac7c70472bd9d38b4a464884ae158120e162
# sk = SigningKey.from_pem(sk_string, curve=SECP256k1)
pb = sk.get_verifying_key()
# privateKeyPkcs1PEM = sk.save_pkcs1().decode('utf8') 
print(sk)
print(pb)

sk = SigningKey.generate(curve= SECP256k1) 
pb = sk.get_verifying_key()
print(sk)
print(pb)
vk = sk.get_verifying_key()
sig = sk.sign(b"message")
vk.verify(sig, b"message")