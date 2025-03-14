from flask import Blueprint, jsonify
from app.services.coingecko_service import get_top_cryptos

crypto_bp = Blueprint('crypto', __name__)

@crypto_bp.route('/get-top-cryptos')
def get_top_cryptos_route():
    return get_top_cryptos()