import time
from flask import Flask
from flask import request, jsonify
from Prover import Prover
from GlobalConfig import * 
import json

app = Flask(__name__)

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
    res = {'proof' : {'taux': str(p.taux), 'muy': str(p.muy)}, 'challenge' : {'x': str(c.x),'y': str(c.y)}} 
    # res_json = json.loads(json.dumps(res))
    print(res)
    print("=>>>>>>>" , type(res))
    message = {
        'status': 200,
        'message': 'OK',
        'data': res
    }
    resp = jsonify(message)
    resp.status_code = 200
    print("=>>>>>>> hello: " , type(resp))
    return resp
