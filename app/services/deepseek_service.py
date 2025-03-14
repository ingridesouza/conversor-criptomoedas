import requests
from flask import current_app
import logging

# Configuração de logs
logger = logging.getLogger(__name__)

class DeepSeekService:
    def __init__(self):
        self.api_key = current_app.config.get('DEEPSEEK_API_KEY')
        self.api_url = current_app.config.get('DEEPSEEK_API_URL')

    def get_bot_response(self, user_message):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
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
            response = requests.post(self.api_url, headers=headers, json=data)
            logger.debug(f"Resposta da API do DeepSeek: {response.status_code}")

            if response.status_code == 200:
                response_data = response.json()
                if 'choices' in response_data and len(response_data['choices']) > 0:
                    return response_data['choices'][0]['message']['content']
                else:
                    logger.error("Resposta da API do DeepSeek não contém 'choices'.")
                    return "Desculpe, ocorreu um erro ao processar sua mensagem."
            else:
                logger.error(f"Erro na API do DeepSeek: {response.status_code} - {response.text}")
                return "Desculpe, ocorreu um erro ao processar sua mensagem."
        except Exception as e:
            logger.error(f"Erro ao conectar com o DeepSeek: {str(e)}")
            return f"Erro ao conectar com o DeepSeek: {str(e)}"