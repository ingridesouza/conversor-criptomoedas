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

@app.route('/convert', methods=['POST'])
def convert():
    data = request.json
    from_currency = data['from']  # ID da criptomoeda (ex: bitcoin)
    to_currency = data['to']      # Código da moeda tradicional (ex: USD, BRL)
    amount = float(data['amount'])

    try:
        # Obter o preço da criptomoeda em USD
        response = requests.get(f"{API_URL}/assets/{from_currency}", headers=headers)
        if response.status_code != 200:
            return jsonify({"error": "Criptomoeda não encontrada"}), 400

        crypto_data = response.json()
        crypto_price_usd = float(crypto_data['data']['priceUsd'])

        # Se a moeda de destino for USD, retornar diretamente
        if to_currency.lower() == 'usd':
            converted_amount = amount * crypto_price_usd
            return jsonify({
                "from": from_currency,
                "to": to_currency,
                "amount": amount,
                "converted_amount": converted_amount,
                "rate": crypto_price_usd
            })

        # Obter a taxa de câmbio da moeda tradicional (ex: USD para BRL)
        response = requests.get(f"{API_URL}/rates/{to_currency}", headers=headers)
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
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)