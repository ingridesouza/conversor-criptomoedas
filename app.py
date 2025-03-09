from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# Chave da CoinGecko API
COINGECKO_API_KEY = "CG-MFhwUmeQazhPGr2GYFafttYy"

# URL base da CoinGecko API
COINGECKO_API_URL = "https://api.coingecko.com/api/v3"

# Cabeçalho para autenticação (opcional, pois a CoinGecko não requer autenticação para uso básico)
headers = {
    "x-cg-demo-api-key": COINGECKO_API_KEY
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-top-cryptos')
def get_top_cryptos():
    try:
        # Buscar as 20 principais criptomoedas
        response = requests.get(
            f"{COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false",
            headers=headers
        )
        if response.status_code != 200:
            return jsonify({"error": "Erro ao buscar criptomoedas"}), 400

        cryptos = response.json()
        return jsonify(cryptos)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/convert', methods=['POST'])
def convert():
    data = request.json
    from_currency = data['from']  # ID da criptomoeda (ex: bitcoin)
    to_currency = data['to']      # Código da moeda tradicional (ex: USD)
    amount = float(data['amount'])

    try:
        # Obter o preço da criptomoeda em USD
        response = requests.get(f"{COINGECKO_API_URL}/coins/{from_currency}", headers=headers)
        if response.status_code != 200:
            return jsonify({"error": "Criptomoeda não encontrada"}), 400

        crypto_data = response.json()
        crypto_price_usd = crypto_data['market_data']['current_price']['usd']

        # Obter a taxa de câmbio da moeda tradicional (ex: USD, BRL, EUR)
        response = requests.get(f"{COINGECKO_API_URL}/simple/price?ids={from_currency}&vs_currencies={to_currency}")
        if response.status_code != 200:
            return jsonify({"error": "Erro ao buscar taxa de câmbio"}), 400

        currency_rate = response.json()[from_currency][to_currency]

        # Converter o valor
        converted_amount = amount * crypto_price_usd * currency_rate

        return jsonify({
            "from": from_currency,
            "to": to_currency,
            "amount": amount,
            "converted_amount": converted_amount,
            "rate": crypto_price_usd * currency_rate
        })

    except Exception as e:
        print("Erro:", e)  # Log do erro
        return jsonify({"error": str(e)}), 500

@app.route('/crypto/<crypto_id>')
def crypto_details(crypto_id):
    try:
        # Buscar informações detalhadas da criptomoeda
        response = requests.get(f"{COINGECKO_API_URL}/coins/{crypto_id}", headers=headers)
        if response.status_code != 200:
            return jsonify({"error": "Criptomoeda não encontrada"}), 404

        crypto_data = response.json()
        return jsonify(crypto_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/search')
def search():
    return render_template('search.html')

if __name__ == '__main__':
    app.run(debug=True)