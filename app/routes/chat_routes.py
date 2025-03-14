from flask import Blueprint, request, jsonify
from app.services.deepseek_service import DeepSeekService
import logging

# Configuração de logs
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/get-bot-response', methods=['POST'])
def get_bot_response():
    try:
        logger.debug("Recebendo mensagem do usuário...")
        user_message = request.json.get('message')
        if not user_message:
            logger.warning("Mensagem do usuário está vazia.")
            return jsonify({"response": "Por favor, envie uma mensagem válida."}), 400

        logger.debug(f"Mensagem recebida: {user_message}")
        deepseek_service = DeepSeekService()
        bot_response = deepseek_service.get_bot_response(user_message)
        logger.debug(f"Resposta do DeepSeek: {bot_response}")

        return jsonify({"response": bot_response})
    except Exception as e:
        logger.error(f"Erro ao processar a mensagem: {str(e)}")
        return jsonify({"response": "Erro ao processar sua mensagem."}), 500