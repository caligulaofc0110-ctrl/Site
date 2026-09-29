from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import random
import platform
import time

app = Flask(__name__)
CORS(app)

inicio_servidor = time.time()
contador = 0


# =========================
# ROTA PRINCIPAL
# =========================

@app.route("/")
def inicio():
    return jsonify({
        "mensagem": "Olá! A API está funcionando!",
        "status": "online"
    })


# =========================
# STATUS DA API
# =========================

@app.route("/api/status")
def status():
    global contador

    contador += 1

    tempo_online = int(time.time() - inicio_servidor)

    return jsonify({
        "status": "online",
        "sistema": platform.system(),
        "python": platform.python_version(),
        "contador_requisicoes": contador,
        "tempo_online_segundos": tempo_online
    })


# =========================
# MENSAGEM
# =========================

@app.route("/api/mensagem")
def mensagem():
    mensagens = [
        "Olá! 👋",
        "A API Python respondeu!",
        "Netlify + Render + Flask funcionando!",
        "Você conseguiu fazer sua primeira API!",
        "Backend online 🚀"
    ]

    return jsonify({
        "mensagem": random.choice(mensagens)
    })


# =========================
# HORA DO SERVIDOR
# =========================

@app.route("/api/hora")
def hora():

    agora = datetime.now()

    return jsonify({
        "data": agora.strftime("%d/%m/%Y"),
        "hora": agora.strftime("%H:%M:%S"),
        "timestamp": agora.timestamp()
    })


# =========================
# NÚMERO ALEATÓRIO
# =========================

@app.route("/api/random")
def numero_random():

    numero = random.randint(1, 1000)

    return jsonify({
        "numero": numero
    })


# =========================
# CALCULADORA
# =========================

@app.route("/api/calcular", methods=["POST"])
def calcular():

    dados = request.get_json()

    numero1 = dados.get("numero1")
    numero2 = dados.get("numero2")
    operacao = dados.get("operacao")

    if numero1 is None or numero2 is None:
        return jsonify({
            "erro": "Envie numero1 e numero2"
        }), 400

    try:
        numero1 = float(numero1)
        numero2 = float(numero2)
    except:
        return jsonify({
            "erro": "Os números precisam ser válidos"
        }), 400

    if operacao == "somar":
        resultado = numero1 + numero2

    elif operacao == "subtrair":
        resultado = numero1 - numero2

    elif operacao == "multiplicar":
        resultado = numero1 * numero2

    elif operacao == "dividir":

        if numero2 == 0:
            return jsonify({
                "erro": "Não é possível dividir por zero"
            }), 400

        resultado = numero1 / numero2

    else:
        return jsonify({
            "erro": "Operação inválida"
        }), 400

    return jsonify({
        "numero1": numero1,
        "numero2": numero2,
        "operacao": operacao,
        "resultado": resultado
    })


# =========================
# ECO
# =========================

@app.route("/api/echo", methods=["POST"])
def echo():

    dados = request.get_json()

    texto = dados.get("texto", "")

    return jsonify({
        "recebido": texto,
        "mensagem": f"A API recebeu: {texto}"
    })


# =========================
# LISTA DE COISAS
# =========================

@app.route("/api/lista")
def lista():

    itens = [
        "Python",
        "Flask",
        "JavaScript",
        "HTML",
        "CSS",
        "API",
        "Render",
        "Netlify"
    ]

    return jsonify({
        "quantidade": len(itens),
        "itens": itens
    })


# =========================
# USUÁRIO FAKE
# =========================

@app.route("/api/usuario")
def usuario():

    return jsonify({
        "id": 1,
        "nome": "Usuário Teste",
        "nivel": "Desenvolvedor iniciante",
        "linguagens": [
            "Python",
            "JavaScript",
            "HTML",
            "CSS"
        ]
    })


# =========================
# PIADA
# =========================

@app.route("/api/piada")
def piada():

    piadas = [
        "Por que o programador foi ao médico? Porque estava cheio de bugs. 😂",
        "HTML entrou no bar e pediu uma div. 🍺",
        "Programador não dorme. Ele entra em modo sleep. 😴",
        "O código funcionou de primeira. Claramente algo está errado. 💀"
    ]

    return jsonify({
        "piada": random.choice(piadas)
    })


# =========================
# INFORMAÇÕES DO SERVIDOR
# =========================

@app.route("/api/info")
def info():

    return jsonify({
        "servidor": "Flask",
        "linguagem": "Python",
        "hospedagem": "Render",
        "frontend": "Netlify",
        "sistema": platform.system(),
        "arquitetura": platform.machine(),
        "python": platform.python_version()
    })


# =========================
# INICIAR
# =========================

if __name__ == "__main__":
    app.run()
