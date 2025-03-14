class InvestmentBot:
    def __init__(self):
        self.responses = {
            "oi": "Olá! Sou um especialista em investimentos. Como posso ajudar você hoje?",
            "como começar a investir": "Para começar a investir, siga estes passos:\n1. Defina seus objetivos financeiros.\n2. Estude sobre os tipos de investimentos (renda fixa, renda variável, fundos, etc.).\n3. Escolha uma corretora confiável.\n4. Comece com investimentos de baixo risco, como Tesouro Direto ou CDB.",
            "o que é renda fixa": "Renda fixa são investimentos onde você sabe como será a remuneração (juros) no momento da aplicação. Exemplos: Tesouro Direto, CDB, LCI, LCA.",
            "o que é renda variável": "Renda variável são investimentos onde a remuneração não é conhecida no momento da aplicação, pois depende do mercado. Exemplos: Ações, ETFs, Fundos Imobiliários.",
            "qual é o melhor investimento": "O melhor investimento depende do seu perfil e objetivos. Para quem busca segurança, renda fixa é uma boa opção. Para quem aceita riscos em busca de maiores retornos, renda variável pode ser interessante.",
            "como diversificar investimentos": "Diversificar significa distribuir seu dinheiro em diferentes tipos de investimentos para reduzir riscos. Por exemplo, você pode investir em renda fixa, ações, fundos imobiliários e criptomoedas.",
            "obrigado": "De nada! Se tiver mais dúvidas sobre investimentos, estou à disposição.",
            "default": "Desculpe, só posso ajudar com dúvidas sobre investimentos. Por favor, faça uma pergunta relacionada a investimentos."
        }

    def get_response(self, message):
        message = message.lower().strip()
        return self.responses.get(message, self.responses["default"])