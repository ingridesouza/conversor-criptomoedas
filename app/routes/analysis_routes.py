from flask import Blueprint, jsonify
from app.services.analysis_service import analyze_market

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/analyze-market')
def analyze_market_route():
    return analyze_market()