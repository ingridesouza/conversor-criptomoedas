import requests
from flask import current_app
import logging

logger = logging.getLogger(__name__)

class DeepSeekService:
    def __init__(self):
        self.deepseek_api_key = current_app.config.get('DEEPSEEK_API_KEY')
        self.deepseek_api_url = current_app.config.get('DEEPSEEK_API_URL')
        self.coingecko_api_url = current_app.config.get('COINGECKO_API_URL')

    def get_bot_response(self, user_message):
        # Verifica se a mensagem do usuário é sobre criptomoedas
        if any(word in user_message.lower() for word in ["bitcoin", "ethereum", "criptomoeda", "preço", "valor"]):
            return self.get_crypto_data(user_message)
        else:
            return self.get_deepseek_response(user_message)

    def get_deepseek_response(self, user_message):
        headers = {
            "Authorization": f"Bearer {self.deepseek_api_key}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "Você é um especialista em investimentos. Responda apenas perguntas relacionadas a investimentos."},
                {"role": "user", "content": user_message}
            ],
            "max_tokens": 150
        }

        try:
            logger.debug("Enviando requisição para o DeepSeek...")
            response = requests.post(self.deepseek_api_url, headers=headers, json=data)
            logger.debug(f"Resposta da API do DeepSeek: {response.status_code}")

            if response.status_code == 200:
                return response.json()['choices'][0]['message']['content']
            else:
                logger.error(f"Erro na API do DeepSeek: {response.status_code} - {response.text}")
                return "Desculpe, ocorreu um erro ao processar sua mensagem."
        except Exception as e:
            logger.error(f"Erro ao conectar com o DeepSeek: {str(e)}")
            return f"Erro ao conectar com o DeepSeek: {str(e)}"

    def get_crypto_data(self, user_message):
        try:
            # Extrai o nome da criptomoeda da mensagem do usuário
            crypto_name = self.extract_crypto_name(user_message)
            if not crypto_name:
                return "Por favor, especifique o nome da criptomoeda."

            # Faz a requisição à API do CoinGecko
            url = f"{self.coingecko_api_url}/simple/price?ids={crypto_name}&vs_currencies=usd"
            response = requests.get(url)
            logger.debug(f"Resposta da API do CoinGecko: {response.status_code}")

            if response.status_code == 200:
                data = response.json()
                if crypto_name in data:
                    price = data[crypto_name]['usd']
                    return f"O preço atual do {crypto_name.capitalize()} é ${price} USD."
                else:
                    return f"Não foi possível encontrar dados para {crypto_name.capitalize()}."
            else:
                logger.error(f"Erro na API do CoinGecko: {response.status_code} - {response.text}")
                return "Desculpe, ocorreu um erro ao buscar os dados da criptomoeda."
        except Exception as e:
            logger.error(f"Erro ao conectar com o CoinGecko: {str(e)}")
            return f"Erro ao conectar com o CoinGecko: {str(e)}"

    def extract_crypto_name(self, user_message):
        # Extrai o nome da criptomoeda da mensagem do usuário
        crypto_keywords = {
            "bitcoin": "bitcoin",
            "btc": "bitcoin",
            "ethereum": "ethereum",
            "eth": "ethereum",
            "cardano": "cardano",
            "ada": "cardano",
            "solana": "solana",
            "sol": "solana",
            # Adicione mais mapeamentos conforme necessário
        }

        for keyword, crypto_id in crypto_keywords.items():
            if keyword in user_message.lower():
                return crypto_id
        return None
