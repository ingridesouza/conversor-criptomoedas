# Crypto Market Analysis Dashboard 🚧 *Em Construção* 🚧  

*Estou aprimorando este projeto ativamente! Novas funcionalidades e melhorias estão sendo implementadas.*  

---

## 📌 Descrição do Projeto  

Este projeto é um dashboard de análise de criptomoedas que utiliza a API da CoinGecko para obter dados de mercado e fornecer recomendações básicas de compra/venda. O sistema armazena os dados em um banco de dados SQLite e inclui funcionalidades de cache para melhor desempenho.  

*(Em breve: Mais análises técnicas, gráficos interativos e suporte a mais exchanges!)*  

---  

## 🚀 Funcionalidades Principais  

✅ **Visualização das 20 principais criptomoedas** por capitalização de mercado  
✅ **Análise automatizada** com recomendações de compra/venda/hold  
✅ **Armazenamento em banco de dados** para histórico de preços e análises  
✅ **Cache de requisições** para melhor desempenho  
✅ **Dashboard interativo** para visualização dos dados  

🔜 **Em breve:**  
- Alertas personalizados  
- Comparativo entre criptomoedas  
- Integração com Telegram/Email  

---  

## 🛠️ Tecnologias Utilizadas  

- Python 3  
- Flask (framework web)  
- SQLite (banco de dados)  
- CoinGecko API (dados de criptomoedas)  
- Flask-Caching (gerenciamento de cache)  
- HTML/CSS/JavaScript (frontend)  

*(Futuras implementações podem incluir React.js e Pandas para análise de dados.)*  

---  

## ⚙️ Configuração do Ambiente  

### Pré-requisitos  

- Python 3.8 ou superior  
- pip (gerenciador de pacotes Python)  
- Conta na [CoinGecko](https://www.coingecko.com/) para obter chave API  

### Instalação  

1. Clone o repositório:  
   ```bash  
   git clone [URL_DO_REPOSITORIO]  
   cd [NOME_DO_DIRETORIO]  
   ```  

2. Crie um ambiente virtual (recomendado):  
   ```bash  
   python -m venv venv  
   source venv/bin/activate  # No Linux/MacOS  
   # ou  
   venv\Scripts\activate  # No Windows  
   ```  

3. Instale as dependências:  
   ```bash  
   pip install -r requirements.txt  
   ```  

4. Configure a variável de ambiente com sua chave da CoinGecko:  
   ```bash  
   export API_COINGECKO="sua_chave_aqui"  # No Linux/MacOS  
   # ou  
   set API_COINGECKO="sua_chave_aqui"  # No Windows  
   ```  

5. Inicie o aplicativo:  
   ```bash  
   python app.py  
   ```  

6. Acesse o dashboard no navegador:  
   ```  
   http://localhost:5000  
   ```  

---  

## 📂 Estrutura do Projeto  

```  
.  
├── app.py                # Aplicação principal Flask  
├── crypto_analysis.db    # Banco de dados SQLite (criado automaticamente)  
├── templates/            # Templates HTML  
│   ├── index.html        # Página inicial  
│   ├── dashboard.html    # Dashboard de análise  
│   └── search.html       # Página de busca  
├── static/               # Arquivos estáticos (CSS, JS, imagens)  
└── README.md             # Este arquivo  
```  

*(Estrutura sujeita a mudanças conforme o projeto evolui.)*  

---  

## 🌐 Rotas da API  

- `/` - Página inicial  
- `/dashboard` - Dashboard de análise  
- `/search` - Página de busca  
- `/get-top-cryptos` - Retorna as 20 principais criptomoedas (cacheado por 60s)  
- `/analyze-market` - Realiza análise de mercado e retorna recomendações  

---  

## 💾 Banco de Dados  

O projeto utiliza um banco de dados SQLite com duas tabelas principais:  

1. **`cryptos`** - Armazena informações básicas sobre as criptomoedas  
   - `id`: Identificador único (ex: "bitcoin")  
   - `name`: Nome da criptomoeda (ex: "Bitcoin")  
   - `price`: Preço atual em USD  
   - `timestamp`: Data/hora da última atualização  

2. **`analysis`** - Armazena as análises e recomendações  
   - `id`: Chave primária autoincrementada  
   - `crypto_id`: Referência à criptomoeda  
   - `action`: Recomendação ("buy", "sell", "hold")  
   - `reason`: Motivo da recomendação  
   - `timestamp`: Data/hora da análise  

---  

## 🤝 Contribuição  

Contribuições são bem-vindas! Siga estes passos:  

1. Faça um fork do projeto  
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)  
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)  
4. Push para a branch (`git push origin feature/AmazingFeature`)  
5. Abra um Pull Request  

*(Estou especialmente aberto a sugestões para melhorar a análise de mercado!)*  

---  

## 📜 Licença  

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.  

---  

Feito com ❤️ por Ingride Souza Dev 

*Última atualização: 03/2025*  

---  

🔨 **Aviso:** Este projeto está em desenvolvimento ativo. Interfaces e funcionalidades podem mudar sem aviso prévio!**
