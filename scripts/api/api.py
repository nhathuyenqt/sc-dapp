import time
from flask import Flask
from flask import request, jsonify
from Prover import Prover
from FieldVector import * 
import json

app = Flask(__name__)


def convert(a):
    if (type(a) ==  list):
        for i in range(len(a)):
            a[i] = convert(a[i])
        return a
    else:
        return group1.serialize(a).decode("utf-8")
@app.route('/time')
def get_current_time():
    print(time.time())
    return {'time': time.time()}

@app.route('/genProof', methods=['POST', 'GET'])
def genProof():
    if 'amt' in request.args:
        req = request.args.get('amt')
        print(req)

    prover = Prover()
    gama = group1.random(ZR)

    p, c = prover.prove(200, gama)
    
    c.x = convert(c.x)
    c.y = convert(c.y)
    c.z = convert(c.z)
    c.g = convert(c.g)
    c.h = convert(c.h)
    c.g_vec = convert(c.g_vec)
    c.h_vec = convert(c.h_vec)
    challenge = {'x': c.x,'y': c.y, 'z' : c.z,'g':c.g, 'h': c.h, 'g_vec':c.g_vec, 'h_vec': c.h_vec}
    
    proof =  {'taux': convert(p.taux), 'muy': convert(p.muy),
        't' : convert(p.t),
        'l' : convert(p.l),
        'r' : convert(p.r),
        'A' : convert(p.A),
        'S' : convert(p.S),
        'T1' : convert(p.T1),
        'T2' : convert(p.T2),
        'V' : convert(p.V),
        'sigma' : convert(p.sigma)}
    # res_json = json.loads(json.dumps(res))

    message = {
        'status': 200,
        'message': 'OK',
        'data': {
            'challenge':challenge,
            'proof' : proof
        }
    }
    resp = jsonify(message)
    resp.status_code = 200
    print("=>>>>>>> hello: " , type(resp))
    return resp
