# app/routes/analysis_routes.py
from flask import Blueprint, jsonify
from app.services.analysis_service import analyze_market

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/analyze-market/<int:user_id>', methods=['GET'])
def analyze_market_route(user_id):
    """
    Rota para acionar a análise de mercado e retornar as notificações.
    """
    notifications = analyze_market(user_id)
    return jsonify({"notifications": notifications})