
import sqlite3
from services.coingecko_service import get_crypto_data

def monitor_user_cryptos(user_id):
    conn = sqlite3.connect('crypto_monitor.db')
    cursor = conn.cursor()

    # Busca as criptomoedas monitoradas pelo usuário
    cursor.execute('SELECT crypto_id, crypto_name, last_price FROM monitored_cryptos WHERE user_id = ?', (user_id,))
    monitored_cryptos = cursor.fetchall()

    for crypto in monitored_cryptos:
        crypto_id, crypto_name, last_price = crypto
        current_data = get_crypto_data(crypto_id)
        current_price = current_data['market_data']['current_price']['usd']

        # Verifica a variação de preço
        price_change = current_price - last_price
        if abs(price_change) > 0.01 * last_price:  # 1% de variação
            message = f"Atenção! {crypto_name} {'valorizou' if price_change > 0 else 'desvalorizou'} " \
                      f"{abs(price_change):.2f} USD ({abs(price_change / last_price * 100):.2f}%). " \
                      f"Preço atual: ${current_price:.2f}."
            send_notification(user_id, message)

            # Atualiza o último preço no banco de dados
            cursor.execute('UPDATE monitored_cryptos SET last_price = ? WHERE user_id = ? AND crypto_id = ?',
                           (current_price, user_id, crypto_id))
            conn.commit()

    conn.close()

def send_notification(user_id, message):
    # Lógica para enviar notificação ao usuário (pode ser via WebSocket, email, etc.)
    print(f"Notificação para o usuário {user_id}: {message}")