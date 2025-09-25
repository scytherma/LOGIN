// spa.js - Sistema de Single Page Application (VERSÃO ATUALIZADA COM MARKETSENSE AI)

document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('content-container');
    const navLinks = document.querySelectorAll('.nav__item');

    // Função para carregar o conteúdo da página
    function loadPage(route) {
        let pageContent = '';

        switch (route) {
            case 'home':
                pageContent = getHomeContent();
                break;
            case 'calculadora':
                pageContent = getCalculadoraContent();
                break;
            case 'gerenciar':
                pageContent = getGerenciarContent();
                break;
            case 'fechamento':
                pageContent = getFechamentoContent();
                break;
            case 'pesquisa':
                // NOVA IMPLEMENTAÇÃO: MarketSense AI
                pageContent = getPesquisaContentNew();
                setTimeout(() => {
                    initMarketSenseAI();
                }, 100);
                break;
            case 'dre':
                pageContent = getDreContent();
                break;
            case 'conexoes':
                pageContent = getConexoesContent();
                break;
            case 'planos':
                pageContent = getPlanosContent();
                // Adicionar event listeners para os botões de plano após o carregamento do conteúdo
                setTimeout(() => {
                    const planButtons = document.querySelectorAll(".plan-btn-page");
                    planButtons.forEach(button => {
                        const planId = button.getAttribute("data-plan");
                        if (planId && typeof window.selectPlan === 'function') {
                            button.addEventListener('click', () => {
                                window.selectPlan(planId);
                            });
                        }
                    });
                }, 0);
                break;
            default:
                pageContent = getHomeContent();
        }

        contentContainer.innerHTML = pageContent;

        // Se for a página da calculadora, reinicializar os event listeners
        if (route === 'calculadora') {
            initCalculatorEvents();
            applyAccessControls();
        }
        
        // Se for a página DRE, inicializar a calculadora DRE
        if (route === 'dre') {
            setupDREPage();
        }
    }

    // Função para atualizar a classe 'active' nos links da navegação
    function updateActiveClass(route) {
        navLinks.forEach(link => {
            if (link.getAttribute('data-route') === route) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Manipulador de cliques para os links da navegação
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const currentRoute = getCurrentRoute();
            const newRoute = link.getAttribute('data-route');
            
            // Se estiver saindo da calculadora ou DRE, resetar os cálculos
            if (currentRoute === 'calculadora' && newRoute !== 'calculadora') {
                resetAllCalculators();
            }
            if (currentRoute === 'dre' && newRoute !== 'dre') {
                resetDRECalculator();
            }
            
            loadPage(newRoute);
            updateActiveClass(newRoute);
        });
    });

    // Carrega a página inicial (Home)
    loadPage('home');
    updateActiveClass('home');
});

// Função para obter a rota atual
function getCurrentRoute() {
    const activeLink = document.querySelector('.nav__item.active');
    return activeLink ? activeLink.getAttribute('data-route') : 'home';
}

// Função para resetar todas as calculadoras
function resetAllCalculators() {
    // Resetar calculadora Shopee
    if (typeof resetarCalculadoraShopee === 'function') {
        resetarCalculadoraShopee();
    }
    
    // Resetar calculadora Mercado Livre
    if (typeof resetarCalculadoraMercadoLivre === 'function') {
        resetarCalculadoraMercadoLivre();
    }
}

// Função para resetar a calculadora DRE
function resetDRECalculator() {
    if (typeof dreCalculator !== 'undefined' && dreCalculator && typeof dreCalculator.clearAll === 'function') {
        dreCalculator.clearAll();
    }
}

// NOVA FUNÇÃO: Conteúdo da página Pesquisa de Mercado com MarketSense AI
function getPesquisaContentNew() {
    return `
        <div class="marketsense-ai-container">
            <!-- Header MarketSense AI -->
            <div class="marketsense-header">
                <div class="header-content">
                    <div class="header-text">
                        <h1 class="header-title">MarketSense AI</h1>
                        <p class="header-subtitle">Análise Inteligente de Mercado para E-commerce</p>
                    </div>
                </div>
            </div>

            <!-- Container Principal -->
            <div class="marketsense-main">
                <!-- Seção de Pesquisa -->
                <div class="search-section-container">
                    <div class="search-section-inner">
                        <div class="search-background-blur"></div>
                        <div class="search-content">
                            <div class="search-input-container">
                                <div class="search-input-wrapper">
                                    <i class="fas fa-search search-icon"></i>
                                    <input 
                                        type="text" 
                                        id="marketSenseSearchInput" 
                                        placeholder="Digite o nome do produto (ex: tênis esportivo, smartphone)"
                                        class="search-input"
                                    />
                                </div>
                                <button id="marketSenseSearchButton" class="search-button">
                                    <span class="search-button-text">Pesquisar</span>
                                    <div class="search-button-loading" style="display: none;">
                                        <i class="fas fa-spinner fa-spin"></i>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Container de Resultados -->
                <div id="marketSenseResults" class="results-container" style="display: none;">
                    <!-- Primeira Linha: Gráfico de Tendências e Mapa do Brasil -->
                    <div class="results-row">
                        <div class="result-card trend-card">
                            <div class="card-header">
                                <div class="card-icon trend-icon">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                                <h3 class="card-title">Interesse ao longo do tempo</h3>
                            </div>
                            <div class="card-content">
                                <div class="chart-container">
                                    <canvas id="trendChart" width="400" height="200"></canvas>
                                </div>
                                <div class="current-month-info">
                                    <p class="current-month-label">Dezembro</p>
                                    <p class="current-month-value">65</p>
                                </div>
                            </div>
                        </div>

                        <div class="result-card map-card">
                            <div class="card-header">
                                <div class="card-icon map-icon">
                                    <i class="fas fa-map-marked-alt"></i>
                                </div>
                                <h3 class="card-title">Regiões de interesse</h3>
                            </div>
                            <div class="card-content">
                                <div class="map-container">
                                    <div id="brazilMap" class="brazil-map">
                                        <!-- Mapa SVG será inserido aqui -->
                                    </div>
                                </div>
                                <div class="map-legend">
                                    <div class="legend-item">
                                        <div class="legend-color excellent"></div>
                                        <span>Excelente</span>
                                    </div>
                                    <div class="legend-item">
                                        <div class="legend-color good"></div>
                                        <span>Bom</span>
                                    </div>
                                    <div class="legend-item">
                                        <div class="legend-color medium"></div>
                                        <span>Médio</span>
                                    </div>
                                    <div class="legend-item">
                                        <div class="legend-color low"></div>
                                        <span>Pouco</span>
                                    </div>
                                </div>
                                <div id="mapTooltip" class="map-tooltip" style="display: none;">
                                    <h4 id="tooltipStateName"></h4>
                                    <p>Interesse: <span id="tooltipStateValue"></span>%</p>
                                    <p><span id="tooltipStateLevel" class="state-level-badge"></span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Segunda Linha: Demografia e Concorrência -->
                    <div class="results-row">
                        <div class="result-card demographics-card">
                            <div class="card-header">
                                <div class="card-icon demographics-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <h3 class="card-title">Demografia e mercado</h3>
                            </div>
                            <div class="card-content">
                                <div class="chart-container">
                                    <canvas id="demographicsChart" width="400" height="150"></canvas>
                                </div>
                                <div class="avg-income-info">
                                    <p class="avg-income-label">Renda média</p>
                                    <p class="avg-income-value">R$ 3.500</p>
                                </div>
                            </div>
                        </div>

                        <div class="result-card competitors-card">
                            <div class="card-header">
                                <div class="card-icon competitors-icon">
                                    <i class="fas fa-balance-scale"></i>
                                </div>
                                <h3 class="card-title">Concorrência</h3>
                            </div>
                            <div class="card-content">
                                <div class="competitors-table-container">
                                    <table class="competitors-table">
                                        <thead>
                                            <tr>
                                                <th>Produto</th>
                                                <th>Preço</th>
                                                <th>Avaliação</th>
                                            </tr>
                                        </thead>
                                        <tbody id="competitorsTableBody">
                                            <!-- Dados serão inseridos dinamicamente -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Terceira Linha: Preço Sugerido e Insights de Vendas -->
                    <div class="results-row">
                        <div class="result-card price-card">
                            <div class="card-header">
                                <div class="card-icon price-icon">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                                <h3 class="card-title">Preço sugerido</h3>
                            </div>
                            <div class="card-content price-content">
                                <div class="suggested-price-container">
                                    <div class="suggested-price" id="suggestedPrice">R$ 349,99</div>
                                    <div class="price-rationale">
                                        <i class="fas fa-chart-line"></i>
                                        <span id="priceRationale">Baseado na análise de mercado</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="result-card sales-insights-card">
                            <div class="card-header">
                                <div class="card-icon sales-icon">
                                    <i class="fas fa-chart-bar"></i>
                                </div>
                                <h3 class="card-title">Insights de vendas</h3>
                            </div>
                            <div class="card-content">
                                <div class="seasonality-info">
                                    <div class="seasonality-item">
                                        <i class="fas fa-calendar-alt"></i>
                                        <div>
                                            <p class="seasonality-label">Sazonalidade</p>
                                            <p class="seasonality-value" id="seasonalityTrend">Maior demanda no final do ano</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="opportunities-section">
                                    <p class="opportunities-label">Oportunidades:</p>
                                    <div class="opportunities-tags" id="opportunitiesTags">
                                        <!-- Tags serão inseridas dinamicamente -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quarta Linha: Insights de IA -->
                    <div class="results-row">
                        <div class="result-card ai-insights-card full-width">
                            <div class="card-header">
                                <div class="card-icon ai-icon">
                                    <i class="fas fa-brain"></i>
                                </div>
                                <div class="ai-header-content">
                                    <h3 class="card-title">Insights e recomendações de IA</h3>
                                    <p class="ai-subtitle">Análise detalhada baseada em dados de mercado</p>
                                </div>
                            </div>
                            <div class="card-content ai-content">
                                <!-- Avaliação de Viabilidade -->
                                <div class="viability-section">
                                    <div class="viability-icon">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                    <div class="viability-content">
                                        <div class="viability-header">
                                            <h4>Viabilidade do Produto</h4>
                                            <span class="viability-badge" id="viabilityBadge">Alta</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Recomendações Detalhadas -->
                                <div class="recommendations-section">
                                    <h4 class="recommendations-title">
                                        <i class="fas fa-lightbulb"></i>
                                        Recomendações detalhadas
                                    </h4>
                                    <p class="recommendations-text" id="recommendationsText">
                                        Produto com excelente viabilidade no mercado brasileiro. Recomenda-se focar nas regiões Sul e Sudeste onde há maior interesse e poder aquisitivo.
                                    </p>
                                </div>

                                <!-- Resumo da Análise -->
                                <div class="analysis-summary">
                                    <div class="summary-item">
                                        <div class="summary-icon analysis-complete">
                                            <span>✓</span>
                                        </div>
                                        <div class="summary-content">
                                            <p class="summary-label">Análise Completa</p>
                                            <p class="summary-value">Mercado Analisado</p>
                                        </div>
                                    </div>
                                    
                                    <div class="summary-item">
                                        <div class="summary-icon ai-generated">
                                            <span>IA</span>
                                        </div>
                                        <div class="summary-content">
                                            <p class="summary-label">Inteligência Artificial</p>
                                            <p class="summary-value">Insights Gerados</p>
                                        </div>
                                    </div>
                                    
                                    <div class="summary-item">
                                        <div class="summary-icon pricing-calculated">
                                            <span>$</span>
                                        </div>
                                        <div class="summary-content">
                                            <p class="summary-label">Precificação</p>
                                            <p class="summary-value">Preço Calculado</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// FUNÇÃO ORIGINAL: Manter para compatibilidade (caso necessário)
function getPesquisaContent() {
    return `
        <div class="market-research-page">
            <!-- Header da Pesquisa de Mercado -->
            <div class="market-research-header">
                <i class="fas fa-search icon"></i>
                <h1>Pesquisa de Produto</h1>
            </div>

            <!-- Container de Pesquisa -->
            <div class="market-search-container">
                <div class="search-form">
                    <div class="search-input-group">
                        <div class="search-input-wrapper">
                            <input type="text" id="marketSearchInput" placeholder="Nome do Produto">
                            <i class="fas fa-search search-input-icon"></i>
                            <button id="clearSearchButton" title="Limpar">&times;</button>
                        </div>
                        <div id="searchInputError" class="search-input-error"></div>
                    </div>
                    <div class="search-button-group">
                        <button id="marketSearchButton">Pesquisar</button>
                    </div>
                </div>
                <div id="searchLoadingIndicator">
                    <div class="loading-spinner"></div>
                    <span>Analisando... Por favor, aguarde.</span>
                </div>
            </div>

            <!-- Container para os resultados da pesquisa -->
            <div id="marketResearchResultsContainer" class="market-research-results-container">
                <!-- Tendência de Busca e Regiões -->
                <div class="result-card trend-region-section">
                    <div class="trend-chart-container">
                        <h2><i class="fas fa-chart-line icon"></i> Tendência de Busca</h2>
                        <p>Gráfico de tendência de busca aqui</p>
                    </div>
                    <div class="region-map-container">
                        <h2><i class="fas fa-map-marked-alt icon"></i> Regiões</h2>
                        <p>Mapa do Brasil aqui</p>
                    </div>
                </div>

                <!-- Demografia & Mercado e Concorrência -->
                <div class="result-card demography-competition-section">
                    <div class="demography-chart-container">
                        <h2><i class="fas fa-users icon"></i> Demografia & Mercado</h2>
                        <p>Gráfico de demografia e mercado aqui</p>
                    </div>
                    <div class="competition-table-container">
                        <h2><i class="fas fa-balance-scale icon"></i> Concorrência</h2>
                        <p>Tabela de concorrência aqui</p>
                    </div>
                </div>

                <!-- Preço Sugerido e Insights de Vendas -->
                <div class="result-card suggested-price-insights-section">
                    <div class="suggested-price-container">
                        <h2><i class="fas fa-dollar-sign icon"></i> Preço Sugerido</h2>
                        <p>Preço sugerido aqui</p>
                    </div>
                    <div class="sales-insights-chart-container">
                        <h2><i class="fas fa-chart-bar icon"></i> Insights de Vendas</h2>
                        <p>Gráfico de insights de vendas aqui</p>
                    </div>
                </div>

                <!-- Insights e Recomendações -->
                <div class="result-card insights-recommendations-section">
                    <h2><i class="fas fa-lightbulb icon"></i> Insights e Recomendações</h2>
                    <p>Insights e recomendações aqui</p>
                </div>
            </div>

            <!-- Seção de Histórico (será mostrada dinamicamente) -->
            <div class="history-section" id="searchHistorySection">
                <h2>
                    <i class="fas fa-history"></i>
                    Pesquisas Recentes
                </h2>
                <div class="history-list" id="searchHistoryList">
                    <!-- Histórico será inserido dinamicamente -->
                </div>
            </div>
        </div>
    `;
}

// Continuar com as outras funções existentes...
// [O resto do arquivo spa.js permanece igual]
