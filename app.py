from flask import Flask, render_template, request, jsonify, send_from_directory
import requests
import os
import sqlite3
from datetime import datetime
from flask_caching import Cache

app = Flask(__name__)

# Configuração do cache
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

# Chave da CoinGecko API (obtida da variável de ambiente)
COINGECKO_API_KEY = os.getenv("API_COINGECKO")

# URL base da CoinGecko API
COINGECKO_API_URL = "https://api.coingecko.com/api/v3"

# Chave da API da DeepSeek (obtida da variável de ambiente)
DEEPSEEK_API_KEY = os.getenv("API_DEEPSEEK")

# URL base da API da DeepSeek
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/market/analyze"  # Endpoint de análise

# Cabeçalho para autenticação
headers = {
    "x-cg-demo-api-key": COINGECKO_API_KEY
}

# Conectar ao banco de dados
def get_db_connection():
    conn = sqlite3.connect('crypto_analysis.db')
    conn.row_factory = sqlite3.Row
    return conn

# Criar tabelas no banco de dados (se não existirem)
def initialize_database():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cryptos (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analysis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crypto_id TEXT NOT NULL,
            action TEXT NOT NULL,
            reason TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (crypto_id) REFERENCES cryptos (id)
        )
    ''')
    conn.commit()
    conn.close()

# Inicializar o banco de dados
initialize_database()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-top-cryptos')
@cache.cached(timeout=60)  # Cache por 60 segundos
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

        # Armazenar os dados no banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()
        for crypto in cryptos:
            cursor.execute('''
                INSERT OR REPLACE INTO cryptos (id, name, price)
                VALUES (?, ?, ?)
            ''', (crypto["id"], crypto["name"], crypto["current_price"]))
        conn.commit()
        conn.close()

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
@cache.cached(timeout=60)  # Cache por 60 segundos
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

@app.route('/static/translations.json')
def serve_translations():
    return send_from_directory('static', 'translations.json')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/analyze-market')
def analyze_market():
    try:
        # Buscar os dados das criptomoedas do banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM cryptos ORDER BY timestamp DESC LIMIT 20')
        cryptos = cursor.fetchall()
        conn.close()

        # Preparar os dados para enviar à API da DeepSeek
        crypto_data = [{"id": crypto["id"], "name": crypto["name"], "price": crypto["price"]} for crypto in cryptos]

        # Enviar os dados para a API da DeepSeek para análise
        deepseek_response = requests.post(
            DEEPSEEK_API_URL,
            headers={
                "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                "Content-Type": "application/json"
            },
            json={"cryptos": crypto_data}
        )

        # Log da resposta da DeepSeek
        print(f"Resposta da DeepSeek: {deepseek_response.status_code} - {deepseek_response.text}")

        if deepseek_response.status_code != 200:
            return jsonify({"error": "Erro ao analisar criptomoedas", "details": deepseek_response.text}), 400

        analysis_result = deepseek_response.json()

        # Armazenar as análises no banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()
        for recommendation in analysis_result["recommendations"]:
            cursor.execute('''
                INSERT INTO analysis (crypto_id, action, reason)
                VALUES (?, ?, ?)
            ''', (recommendation["id"], recommendation["action"], recommendation["reason"]))
        conn.commit()
        conn.close()

        # Retornar as recomendações
        return jsonify(analysis_result)

    except Exception as e:
        print(f"Erro ao analisar mercado: {str(e)}")  # Log do erro
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)