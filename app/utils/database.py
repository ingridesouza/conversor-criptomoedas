import sqlite3

def get_db_connection():
    conn = sqlite3.connect('crypto_analysis.db')
    conn.row_factory = sqlite3.Row
    return conn

def initialize_database():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cryptos (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analysis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crypto_id TEXT NOT NULL,
            action TEXT NOT NULL,  -- "buy", "sell", "hold"
            reason TEXT NOT NULL,  -- Motivo da recomendação
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (crypto_id) REFERENCES cryptos (id)
        )
    ''')
    conn.commit()
    conn.close()