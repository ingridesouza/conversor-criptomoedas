import sqlite3

# Conectar ao banco de dados (ou criar se não existir)
conn = sqlite3.connect('crypto_analysis.db')
cursor = conn.cursor()

# Criar tabela para armazenar os dados das criptomoedas
cursor.execute('''
CREATE TABLE IF NOT EXISTS cryptos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')

# Criar tabela para armazenar as análises
cursor.execute('''
CREATE TABLE IF NOT EXISTS analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crypto_id TEXT NOT NULL,
    action TEXT NOT NULL, 
    reason TEXT NOT NULL, 
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crypto_id) REFERENCES cryptos (id)
)
''')

conn.commit()