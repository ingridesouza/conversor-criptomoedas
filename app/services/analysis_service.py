from app.utils.database import get_db_connection
from flask import jsonify

def analyze_market():
    try:
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