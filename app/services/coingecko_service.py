import requests
from flask import jsonify  # Adicione esta linha para importar jsonify
from app.utils.database import get_db_connection
from flask import current_app

def get_top_cryptos():
    try:
        response = requests.get(
            f"{current_app.config['COINGECKO_API_URL']}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false",
            headers={"x-cg-demo-api-key": current_app.config['COINGECKO_API_KEY']}
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