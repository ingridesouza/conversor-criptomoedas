# app/services/analysis_service.py
import sqlite3
from .coingecko_service import get_crypto_data

def analyze_market(user_id):
    """
    Analisa o mercado de criptomoedas com base nos valores anteriores e decide se deve enviar notificações.
    """
    conn = sqlite3.connect('crypto_monitor.db')
    cursor = conn.cursor()

    try:
        # Busca as criptomoedas monitoradas pelo usuário
        cursor.execute('SELECT crypto_id, crypto_name, last_price FROM monitored_cryptos WHERE user_id = ?', (user_id,))
        monitored_cryptos = cursor.fetchall()

        notifications = []

        for crypto in monitored_cryptos:
            crypto_id, crypto_name, last_price = crypto
            current_data = get_crypto_data(crypto_id)
            current_price = current_data['market_data']['current_price']['usd']

            # Calcula a variação de preço
            price_change = current_price - last_price
            price_change_percentage = (price_change / last_price) * 100

            # Lógica de análise
            if abs(price_change_percentage) > 5:  # Notificar se a variação for maior que 5%
                if price_change_percentage > 0:
                    message = f"📈 {crypto_name} está em alta! Valorizou {price_change_percentage:.2f}% (de ${last_price:.2f} para ${current_price:.2f})."
                else:
                    message = f"📉 {crypto_name} está em queda! Desvalorizou {abs(price_change_percentage):.2f}% (de ${last_price:.2f} para ${current_price:.2f})."

                notifications.append(message)

                # Atualiza o último preço no banco de dados
                cursor.execute('UPDATE monitored_cryptos SET last_price = ? WHERE user_id = ? AND crypto_id = ?',
                               (current_price, user_id, crypto_id))
                conn.commit()

        return notifications
    except Exception as e:
        return [f"Erro ao analisar o mercado: {str(e)}"]
    finally:
        conn.close()

def send_notification(user_id, message):
    """
    Envia uma notificação ao usuário.
    """
    # Lógica para enviar notificação ao usuário (pode ser via WebSocket, email, etc.)
    print(f"Notificação para o usuário {user_id}: {message}")

def monitor_user_cryptos(user_id):
    """
    Monitora as criptomoedas do usuário e envia notificações se houver variações significativas.
    """
    notifications = analyze_market(user_id)
    for notification in notifications:
        send_notification(user_id, notification)