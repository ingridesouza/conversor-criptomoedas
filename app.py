from flask import Flask, render_template, request, jsonify, send_from_directory
import requests
import os
import sqlite3
from datetime import datetime
from flask_caching import Cache

app = Flask(__name__)

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

COINGECKO_API_KEY = os.getenv("API_COINGECKO")

COINGECKO_API_URL = "https://api.coingecko.com/api/v3"

headers = {
    "x-cg-demo-api-key": COINGECKO_API_KEY
}

def get_db_connection():
    conn = sqlite3.connect('crypto_analysis.db')
    conn.row_factory = sqlite3.Row
    return conn

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
            action TEXT NOT NULL,  -- "buy", "sell", "hold"
            reason TEXT NOT NULL,  -- Motivo da recomendação
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (crypto_id) REFERENCES cryptos (id)
        )
    ''')
    conn.commit()
    conn.close()

initialize_database()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/search')
def search_page():
    return render_template('search.html')

@app.route('/get-top-cryptos')
@cache.cached(timeout=60)
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

@app.route('/analyze-market')
def analyze_market():
    try:
        # Buscar os dados das criptomoedas do banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM cryptos ORDER BY timestamp DESC LIMIT 20')
        cryptos = cursor.fetchall()
        conn.close()


        recommendations = []
        for crypto in cryptos:
            crypto_id = crypto["id"]
            crypto_name = crypto["name"]
            crypto_price = crypto["price"]

            if crypto_price > 50000:
                action = "sell"
                reason = "Preço muito alto"
            elif crypto_price < 30000:
                action = "buy"
                reason = "Preço muito baixo"
            else:
                action = "hold"
                reason = "Preço estável"

            recommendations.append({
                "id": crypto_id,
                "name": crypto_name,
                "price": crypto_price,
                "action": action,
                "reason": reason
            })


        conn = get_db_connection()
        cursor = conn.cursor()
        for recommendation in recommendations:
            cursor.execute('''
                INSERT INTO analysis (crypto_id, action, reason)
                VALUES (?, ?, ?)
            ''', (recommendation["id"], recommendation["action"], recommendation["reason"]))
        conn.commit()
        conn.close()

        return jsonify({"recommendations": recommendations})

    except Exception as e:
        print(f"Erro ao analisar mercado: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
