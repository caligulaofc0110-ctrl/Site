from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/")
def inicio():
    return jsonify({
        "mensagem": "Olá! Essa mensagem veio da API Python!"
    })


app.run(host="0.0.0.0", port=5000)