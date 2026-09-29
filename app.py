from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


@app.route("/")
def inicio():
    return jsonify({
        "mensagem": "Olá! Essa mensagem veio da API Python!"
    })
