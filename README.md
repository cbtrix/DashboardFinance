# 💰 DashboardFinance — Painel Financeiro

Dashboard de finanças pessoais com controle de gastos, receitas e dívidas — feito com HTML, CSS e JavaScript puro.

## ✨ Funcionalidades

### Dashboard
- Cards de resumo: receita do mês, total de gastos, saldo e dívidas em aberto
- Gráfico de barras por categoria (desenhado em Canvas puro)
- Lista dos últimos lançamentos do mês
- Seletor de mês de referência (últimos 12 meses)

### Lançamentos
- Cadastro de gastos e receitas com descrição, valor, categoria, data e observação
- Tabela com filtro por categoria em tempo real
- Botão para deletar lançamentos individuais

### Dívidas & Parcelas
- Cadastro de dívidas com valor total, número de parcelas e vencimento mensal
- Barra de progresso de parcelas pagas
- Botão "Pagar parcela" com cálculo automático do valor restante
- Indicador visual quando a dívida está quitada

## 🛠️ Tecnologias

- **HTML5** — estrutura semântica, layout com sidebar
- **CSS3** — variáveis CSS, grid, tema dark, animações
- **JavaScript** — Canvas API, localStorage, lógica financeira, filtros dinâmicos

## 📁 Estrutura

```
fintrack/
├── index.html   # Estrutura, sidebar e modal
├── style.css    # Tema dark estilo fintech
└── script.js    # Lógica completa e gráficos
```

## 🚀 Como usar

1. Clone ou baixe os arquivos
2. Abra o `index.html` no navegador
3. Use o botão **+ Adicionar** para cadastrar gastos ou dívidas
4. Navegue entre as abas pela sidebar

> Não requer servidor. Todos os dados ficam no `localStorage`.

## 📊 Categorias disponíveis

`Alimentação` · `Transporte` · `Saúde` · `Lazer` · `Moradia` · `Outros`

## 📱 Responsivo

Em telas menores a sidebar se comprime exibindo apenas os ícones. Cards e formulários reorganizam em colunas únicas.

## 🎨 Design

Tema dark com paleta fintech — verde para positivo, vermelho para gastos, amarelo para alertas. Tipografia: **Syne** (display) + **JetBrains Mono** (números).

---

Feito com 💚 — projeto de portfólio frontend
