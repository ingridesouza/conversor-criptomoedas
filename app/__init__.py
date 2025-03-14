from flask import Flask
from flask_caching import Cache
import os

cache = Cache()

def create_app():
    app = Flask(__name__)
    
    # Configurações
    app.config['COINGECKO_API_KEY'] = os.getenv("API_COINGECKO")
    app.config['COINGECKO_API_URL'] = "https://api.coingecko.com/api/v3"
    
    # Inicializa o cache
    cache.init_app(app, config={'CACHE_TYPE': 'simple'})
    
    # Registra blueprints
    from app.routes.main_routes import main_bp
    from app.routes.crypto_routes import crypto_bp
    from app.routes.analysis_routes import analysis_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(crypto_bp)
    app.register_blueprint(analysis_bp)
    
    return app