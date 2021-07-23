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