from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# URL da API CoinCap
API_URL = "https://api.coincap.io/v2"
API_KEY = "bdac2b7b-7e0c-4758-9f45-1cc61fb7a8b8"  # Sua chave de API

# Cabeçalho para autenticação
headers = {
    "Authorization": f"Bearer {API_KEY}"
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-cryptos')
def get_cryptos():
    try:
        response = requests.get(f"{API_URL}/assets?limit=10", headers=headers)
        if response.status_code != 200:
            return jsonify({"error": "Erro ao buscar criptomoedas"}), 400

        cryptos = response.json()['data']
        return jsonify(cryptos)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/convert', methods=['POST'])
def convert():
    data = request.json
    from_currency = data['from']  # ID da criptomoeda (ex: xrp)
    to_currency = data['to']      # Código da moeda tradicional (ex: EUR)
    amount = float(data['amount'])

    print("ID da criptomoeda recebido:", from_currency)  # Log do ID

    try:
        # Obter o preço da criptomoeda em USD
        response = requests.get(f"{API_URL}/assets/{from_currency}", headers=headers)
        print("Resposta da API (Criptomoeda):", response.status_code, response.json())  # Log da resposta

        if response.status_code != 200:
            return jsonify({"error": "Criptomoeda não encontrada"}), 400

        crypto_data = response.json()
        crypto_price_usd = float(crypto_data['data']['priceUsd'])

        # Obter a taxa de câmbio da moeda tradicional (ex: EUR)
        response = requests.get(f"{API_URL}/rates/{to_currency}", headers=headers)
        print("Resposta da API (Moeda Tradicional):", response.status_code, response.json())  # Log da resposta

        if response.status_code != 200:
            return jsonify({"error": "Moeda tradicional não encontrada"}), 400

        currency_data = response.json()
        currency_rate = float(currency_data['data']['rateUsd'])

        # Converter o valor
        converted_amount = amount * crypto_price_usd / currency_rate

        return jsonify({
            "from": from_currency,
            "to": to_currency,
            "amount": amount,
            "converted_amount": converted_amount,
            "rate": crypto_price_usd / currency_rate
        })

    except Exception as e:
        print("Erro:", e)  # Log do erro
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)