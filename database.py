# database.py
import sqlite3

def init_db():
    conn = sqlite3.connect('crypto_monitor.db')
    cursor = conn.cursor()

    
    # Tabela de usuários
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    # Tabela de criptomoedas monitoradas
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS monitored_cryptos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        crypto_id TEXT NOT NULL,
        crypto_name TEXT NOT NULL,
        last_price REAL NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );
    ''')

    conn.commit()
    conn.close()

init_db()
