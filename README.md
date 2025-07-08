# 📊 Stacked 100% Column Chart for Power BI

🇧🇷 **Português** | 🇺🇸 **English**

Um visual interativo de gráfico de colunas empilhadas 100% para Power BI | Interactive stacked 100% column chart visual for Power BI

![Power BI Visual](https://img.shields.io/badge/Power%20BI-Visual-yellow) ![Version](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-Free-green)

---

## 💝 Apoie Este Projeto | Support This Project

Este visual é **100% gratuito**, mas se está sendo útil, considere apoiar o desenvolvimento:

### 💰 Doações | Donations
- **💳 PayPal**: [Doar a partir de R$ 2,00 / Donate from $2 USD](https://www.paypal.com/donate/?hosted_button_id=YMQHLPFTXTA3U)
- **🇧🇷 PIX**: alexandre.2.lourenco@outlook.com

### 📞 Contato | Contact
- **📧 Email**: [alexandre.2.lourenco@outlook.com](mailto:alexandre.2.lourenco@outlook.com)
- **💼 LinkedIn**: [Alexandre Lourenço](https://www.linkedin.com/in/alexandre-lourencodatasciencie/)
- **💻 GitHub**: [@Alelourenco](https://github.com/Alelourenco)

---

## 🇧🇷 PORTUGUÊS

### 🚀 Download e Instalação

**📥 [Baixar Visual (.pbiviz)](./dist/stacked100ColumnChart7C94647E09DB48D2A1A65CA3F9709859.1.0.0.0.pbiviz)**

#### Como Instalar:
1. Baixe o arquivo `.pbiviz` acima
2. No Power BI Desktop: `Inserir` → `Mais visuais` → `Importar visual de arquivo`
3. Selecione o arquivo baixado
4. O visual aparecerá no painel de visualizações

### ✨ Principais Funcionalidades

- **📊 Visualização 100% Empilhada**: Cada categoria representa 100% do total, perfeito para análise de proporções
- **🎨 5 Cores Customizáveis**: Paleta personalizada para diferentes séries
- **📱 Design Responsivo**: Scroll horizontal automático para muitas categorias
- **🔄 Seleção Interativa**: Clique para destacar categorias específicas
- **📝 Rótulos Flexíveis**: Percentuais, valores, nomes de séries e totais
- **⚡ Performance Otimizada**: Código modular e eficiente

### 🔧 Como Usar

### **1. Preparação dos Dados**
Seus dados devem ter:
- **Uma coluna categórica** (ex: "Produto", "Região", "Mês")
- **Uma ou mais colunas numéricas** (ex: "Vendas Q1", "Vendas Q2", "Vendas Q3")

Exemplo de estrutura:
```
Produto    | Q1    | Q2    | Q3    | Q4
-----------|-------|-------|-------|-------
Produto A  | 1000  | 1200  | 800   | 1500
Produto B  | 800   | 900   | 1100  | 1300
Produto C  | 1200  | 1000  | 1400  | 1100
```

### **2. Configuração no Power BI**
1. Adicione o visual à sua página
2. Configure os campos:
   - **Categoria**: Arraste "Produto"
   - **Valores**: Arraste "Q1", "Q2", "Q3", "Q4"
3. O gráfico mostrará cada produto como 100%, com as proporções de cada trimestre

### **3. Personalização**
- **Cores**: Configure até 5 cores diferentes para as séries
- **Formatação**: Escolha entre mostrar percentuais, valores ou ambos
- **Layout**: Ajuste espaçamento e opacidade conforme necessário
- **Categorias**: Personalize fonte, tamanho e cor dos rótulos do eixo X

## 💡 Dicas de Uso

### 📈 **Casos de Uso Ideais**
- **Análise de Participação**: Participação de produtos em vendas por região
- **Evolução Temporal**: Mudança na composição ao longo do tempo
- **Comparação de Portfolios**: Comparar diferentes carteiras de investimento
- **Análise Demográfica**: Distribuição etária por região/cidade

### 🎯 **Boas Práticas**
- **Máximo 5-7 séries**: Para melhor legibilidade
- **Cores Contrastantes**: Use a paleta personalizada para destaque
- **Filtros**: Use filtros do Power BI para focar em dados relevantes
- **Ordenação**: Ordene categorias por total ou alfabeticamente

### ⚡ **Performance**
- **Otimizado para até 50 categorias** sem perda de performance
- **Scroll horizontal** automático para muitas categorias
- **Renderização eficiente** com D3.js otimizado

## 🔧 Otimizações Técnicas

### **Código Limpo e Documentado**
- ✅ **Arquitetura modular**: 15+ métodos específicos
- ✅ **TypeScript tipado**: Tipos customizados para segurança
- ✅ **Comentários profissionais**: Documentação completa em português
- ✅ **Performance otimizada**: Eliminação de redundâncias
- ✅ **Padrões de código**: ESLint e boas práticas

### **Funcionalidades Avançadas**
- **Cálculo Preciso**: Garante exatamente 100% por categoria
- **Interatividade Suave**: Animações e transições otimizadas
- **Acessibilidade**: Tooltips informativos e navegação por teclado
- **Responsividade**: Adapta-se a qualquer tamanho de container

### 🎯 **O que suas doações ajudam a desenvolver:**
- ✨ Mais temas visuais e animações
- 📱 Melhorias na responsividade
- 🔗 Integração com APIs externas
- 📈 Novos tipos de gráficos empilhados
- 🎨 Mais opções de personalização
- 🚀 Novas funcionalidades baseadas no feedback da comunidade

## 📋 Roadmap

### **Próximas Versões (dependem de doações)**
- [ ] **Gráfico Horizontal**: Versão com barras horizontais
- [ ] **Animações**: Transições suaves entre estados
- [ ] **Temas Predefinidos**: Paletas corporativas populares
- [ ] **Drill-through**: Navegação para relatórios detalhados
- [ ] **Exportação**: Salvar como PNG/SVG
- [ ] **Tooltips Avançados**: Mais informações no hover
- [ ] **Comparação Temporal**: Animação mostrando evolução no tempo

---

## 🇺🇸 ENGLISH

### 🚀 Download and Installation

**📥 [Download Visual (.pbiviz)](./dist/stacked100ColumnChart7C94647E09DB48D2A1A65CA3F9709859.1.0.0.0.pbiviz)**

#### How to Install:
1. Download the `.pbiviz` file above
2. In Power BI Desktop: `Insert` → `More visuals` → `Import visual from file`
3. Select the downloaded file
4. The visual will appear in the visualizations panel

### ✨ Key Features

- **📊 100% Stacked Visualization**: Each category represents 100% of total, perfect for proportion analysis
- **🎨 5 Customizable Colors**: Custom palette for different series
- **� Responsive Design**: Automatic horizontal scroll for many categories
- **🔄 Interactive Selection**: Click to highlight specific categories
- **📝 Flexible Labels**: Percentages, values, series names and totals
- **⚡ Optimized Performance**: Modular and efficient code

### 🔧 How to Use

#### 1. Data Preparation
Your data should have:
- **One categorical column** (e.g., "Product", "Region", "Month")
- **One or more numeric columns** (e.g., "Sales Q1", "Sales Q2", "Sales Q3")

Example structure:
```
Product    | Q1    | Q2    | Q3    | Q4
-----------|-------|-------|-------|-------
Product A  | 1000  | 1200  | 800   | 1500
Product B  | 800   | 900   | 1100  | 1300
Product C  | 1200  | 1000  | 1400  | 1100
```

#### 2. Power BI Configuration
1. Add the visual to your page
2. Configure fields:
   - **Category**: Drag "Product"
   - **Values**: Drag "Q1", "Q2", "Q3", "Q4"
3. The chart will show each product as 100% with quarterly proportions

#### 3. Customization
- **Colors**: Configure up to 5 different colors for series
- **Formatting**: Choose between showing percentages, values, or both
- **Layout**: Adjust spacing and opacity as needed
- **Categories**: Customize font, size and color of X-axis labels

---

## 🐛 Reportar Problemas | Report Issues

Encontrou um bug ou tem uma sugestão? | Found a bug or have a suggestion?

- **Email**: alexandre.2.lourenco@outlook.com
- **GitHub Issues**: [Criar Issue | Create Issue](https://github.com/Alelourenco/powerbi-stacked100-column-chart/issues)

---

## �️ Technical Specifications | Especificações Técnicas

### ⚙️ Configuration Options | Opções de Configuração

#### 🎨 Color Palette | Paleta de Cores
- 5 independent customizable colors | 5 cores independentes customizáveis
- Series auto-assignment | Atribuição automática por série

#### 📊 Data Formatting | Formatação de Dados
- Show percentages | Exibir percentuais ✅
- Show values | Exibir valores ✅
- Show series names | Exibir nomes das séries
- Show totals above bars | Exibir totais acima das barras ✅
- Value format: Auto/Thousands/Millions | Formato: Automático/Milhares/Milhões

#### 🎭 Category Settings | Configurações de Categoria
- Font size (8-72px) | Tamanho da fonte (8-72px)
- Font family | Família da fonte
- Bold toggle | Ativar negrito
- Custom color | Cor personalizada

#### 📐 Chart Settings | Configurações do Gráfico
- Bar opacity (0-1) | Opacidade das barras (0-1)
- Border width (0-10px) | Largura da borda (0-10px)
- Border color | Cor da borda
- Bar spacing (0-1) | Espaçamento entre barras (0-1)

### 🚀 Performance | Performance

- **Optimized for**: Up to 50 categories | Otimizado para: até 50 categorias
- **Series limit**: 5 series for best readability | Limite de séries: 5 para melhor legibilidade
- **Responsive**: Auto horizontal scroll | Responsivo: scroll horizontal automático
- **Compatibility**: Power BI Desktop & Service | Compatibilidade: Power BI Desktop e Service

---

## �📄 Licença | License

Este visual é fornecido gratuitamente para uso pessoal e comercial. | This visual is provided free for personal and commercial use.

---

## 🌟 **Avaliação | Evaluation**

Se este visual está sendo útil para você, considere: | If this visual is useful to you, consider:

- ⭐ Dar uma estrela neste repositório | Star this repository
- 📢 Compartilhar com colegas que usam Power BI | Share with colleagues who use Power BI
- 💝 Fazer uma doação para apoiar o desenvolvimento | Make a donation to support development
- 📝 Deixar feedback sobre novas funcionalidades | Leave feedback about new features

**Desenvolvido com ❤️ por [Alexandre Lourenço](https://www.linkedin.com/in/alexandre-lourencodatasciencie/)**

---

*"Transformando dados em insights visuais, uma proporção por vez!"* | *"Transforming data into visual insights, one proportion at a time!"* 📊✨
