from app.services.coingecko_service import get_top_cryptos
# routes/crypto_routes.py
from flask import Blueprint, request, jsonify
import sqlite3

crypto_bp = Blueprint('crypto', __name__)

def get_db_connection():
    conn = sqlite3.connect('crypto_monitor.db')
    conn.row_factory = sqlite3.Row
    return conn

@crypto_bp.route('/add-monitored-crypto', methods=['POST'])
def add_monitored_crypto():
    data = request.json
    user_id = data.get('user_id')
    crypto_id = data.get('crypto_id')
    crypto_name = data.get('crypto_name')
    last_price = data.get('last_price')

    if not user_id or not crypto_id or not crypto_name or not last_price:
        return jsonify({'error': 'Dados incompletos'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('''
            INSERT INTO monitored_cryptos (user_id, crypto_id, crypto_name, last_price)
            VALUES (?, ?, ?, ?)
        ''', (user_id, crypto_id, crypto_name, last_price))
        conn.commit()
        return jsonify({'message': 'Criptomoeda adicionada ao monitoramento!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Criptomoeda já monitorada pelo usuário'}), 400
    finally:
        conn.close()

@crypto_bp.route('/get-monitored-cryptos/<int:user_id>', methods=['GET'])
def get_monitored_cryptos(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT crypto_id, crypto_name, last_price FROM monitored_cryptos WHERE user_id = ?', (user_id,))
    cryptos = cursor.fetchall()

    conn.close()
    return jsonify([dict(crypto) for crypto in cryptos])

@crypto_bp.route('/remove-monitored-crypto', methods=['POST'])
def remove_monitored_crypto():
    data = request.json
    user_id = data.get('user_id')
    crypto_id = data.get('crypto_id')

    if not user_id or not crypto_id:
        return jsonify({'error': 'Dados incompletos'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('DELETE FROM monitored_cryptos WHERE user_id = ? AND crypto_id = ?', (user_id, crypto_id))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Criptomoeda removida do monitoramento!'})


@crypto_bp.route('/get-top-cryptos')
def get_top_cryptos_route():
    return get_top_cryptos()