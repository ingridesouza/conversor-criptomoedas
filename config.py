import os

class Config:
    COINGECKO_API_KEY = os.getenv("API_COINGECKO")
    COINGECKO_API_URL = "https://api.coingecko.com/api/v3"
    DEEPSEEK_API_KEY = os.getenv("API_DEEPSEEK")
    DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"
