// MarketSense AI - JavaScript Adaptado
// Integração com Supabase e APIs existentes

// Configurações globais
const MARKET_RESEARCH_CONFIG = {
    maxSearchLength: 100,
    minSearchLength: 3,
    searchTimeout: 30000,
    cacheTimeout: 24 * 60 * 60 * 1000,
};

// Estado global da aplicação
let appState = {
    isSearching: false,
    currentQuery: '',
    lastResults: null,
    searchHistory: [],
    charts: {}
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando MarketSense AI...');
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadSearchHistory();
    checkUserAccess();
    console.log('MarketSense AI inicializado com sucesso');
}

// Configurar event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('marketSearchInput');
    const searchButton = document.getElementById('marketSearchButton');
    
    if (!searchInput || !searchButton) {
        console.error('Elementos de pesquisa não encontrados');
        return;
    }

    // Event listener para o botão de pesquisa
    searchButton.addEventListener('click', handleSearch);
    
    // Event listener para Enter no campo de pesquisa
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Event listener para validação em tempo real
    searchInput.addEventListener('input', validateSearchInput);
}

// Validar entrada de pesquisa
function validateSearchInput() {
    const searchInput = document.getElementById('marketSearchInput');
    const searchButton = document.getElementById('marketSearchButton');
    const query = searchInput.value.trim();
    
    // Validar comprimento
    if (query.length < MARKET_RESEARCH_CONFIG.minSearchLength) {
        searchButton.disabled = true;
        return false;
    }
    
    if (query.length > MARKET_RESEARCH_CONFIG.maxSearchLength) {
        searchButton.disabled = true;
        return false;
    }
    
    // Validar caracteres especiais
    const invalidChars = /[<>{}[\]\\]/;
    if (invalidChars.test(query)) {
        searchButton.disabled = true;
        return false;
    }
    
    // Input válido
    searchButton.disabled = false;
    return true;
}

// Verificar acesso do usuário
function checkUserAccess() {
    // Integração com sistema de autenticação existente
    if (typeof userSubscriptionStatus !== 'undefined' && 
        userSubscriptionStatus.status !== 'active') {
        showAccessLimitedMessage();
        return false;
    }
    return true;
}

// Mostrar mensagem de acesso limitado
function showAccessLimitedMessage() {
    const searchButton = document.getElementById('marketSearchButton');
    const searchInput = document.getElementById('marketSearchInput');
    
    if (searchButton) {
        searchButton.textContent = 'Upgrade para Pesquisar';
        searchButton.onclick = () => showUpgradeModal('Pesquisa de Mercado');
    }
    
    if (searchInput) {
        searchInput.placeholder = 'Upgrade para usar a pesquisa de mercado...';
        searchInput.disabled = true;
    }
}

// Manipular pesquisa principal
async function handleSearch() {
    console.log('Iniciando pesquisa de mercado...');
    
    if (appState.isSearching) {
        console.log('Pesquisa já em andamento');
        return;
    }
    
    if (!checkUserAccess()) {
        console.log('Acesso negado à pesquisa de mercado');
        return;
    }
    
    if (!validateSearchInput()) {
        console.log('Input inválido');
        return;
    }
    
    const searchInput = document.getElementById('marketSearchInput');
    const query = searchInput.value.trim();
    
    // Verificar cache
    const cachedResult = getCachedResult(query);
    if (cachedResult) {
        console.log('Resultado encontrado no cache');
        displayResults(cachedResult);
        return;
    }
    
    try {
        setLoadingState(true);
        appState.isSearching = true;
        appState.currentQuery = query;
        
        // Realizar pesquisa usando a função existente do sistema
        const results = await performMarketResearch(query);
        
        // Salvar no cache
        setCachedResult(query, results);
        
        // Salvar no histórico
        addToSearchHistory(query);
        
        // Mostrar resultados
        displayResults(results);
        
    } catch (error) {
        console.error('Erro na pesquisa de mercado:', error);
        showError(error.message);
    } finally {
        setLoadingState(false);
        appState.isSearching = false;
    }
}

// Realizar pesquisa de mercado (integração com sistema existente)
async function performMarketResearch(query) {
    console.log(`Realizando pesquisa para: "${query}"`);
    
    // Usar a função existente do sistema ou implementar nova integração
    if (typeof window.performMarketResearch === 'function') {
        return await window.performMarketResearch(query);
    }
    
    // Integração com Supabase (usando sistema existente)
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError || !session || !session.access_token) {
        throw new Error('Usuário não autenticado');
    }
    
    const accessToken = session.access_token;
    
    // Fazer requisição para Edge Function existente
    const response = await fetch(`${SUPABASE_FUNCTIONS_BASE_URL}/market-research`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: query,
            timestamp: new Date().toISOString()
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro na pesquisa: ${response.status}`);
    }
    
    const results = await response.json();
    console.log('Resultados da pesquisa:', results);
    
    return results;
}

// Definir estado de loading
function setLoadingState(isLoading) {
    const searchButton = document.getElementById('marketSearchButton');
    const searchInput = document.getElementById('marketSearchInput');
    const buttonText = document.getElementById('searchButtonText');
    const buttonLoader = document.getElementById('searchButtonLoader');
    
    if (isLoading) {
        searchButton.disabled = true;
        searchInput.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline-block';
    } else {
        searchButton.disabled = false;
        searchInput.disabled = false;
        buttonText.style.display = 'inline-block';
        buttonLoader.style.display = 'none';
    }
}

// Exibir resultados
function displayResults(results) {
    console.log('Exibindo resultados da pesquisa');
    
    if (!results || !results.success) {
        showError(results?.error || 'Não foi possível realizar a análise');
        return;
    }
    
    const data = results.data;
    
    // Mostrar container de resultados
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.classList.remove('hidden');
    
    // Atualizar cada seção
    updateTrendChart(data.trend_data);
    updateBrazilMap(data.regional_data);
    updateDemographics(data.demographics);
    updateCompetitors(data.competitors);
    updateSuggestedPrice(data.ai_insights);
    updateSalesInsights(data.ai_insights);
    updateAIInsights(data.ai_insights);
    
    // Salvar resultados atuais
    appState.lastResults = results;
    
    // Scroll suave para os resultados
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Atualizar gráfico de tendência
function updateTrendChart(trendData) {
    const canvas = document.getElementById('trendChart');
    const ctx = canvas.getContext('2d');
    
    // Destruir gráfico anterior se existir
    if (appState.charts.trendChart) {
        appState.charts.trendChart.destroy();
    }
    
    // Dados de exemplo se não houver dados reais
    const data = trendData || [
        { month: 'Jan', value: 20 },
        { month: 'Fev', value: 25 },
        { month: 'Mar', value: 45 },
        { month: 'Abr', value: 35 },
        { month: 'Mai', value: 30 },
        { month: 'Jun', value: 40 },
        { month: 'Jul', value: 50 },
        { month: 'Ago', value: 45 },
        { month: 'Set', value: 35 },
        { month: 'Out', value: 55 },
        { month: 'Nov', value: 60 },
        { month: 'Dez', value: 65 }
    ];
    
    appState.charts.trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.month),
            datasets: [{
                label: 'Interesse',
                data: data.map(d => d.value),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#3b82f6',
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#374151',
                    bodyColor: '#374151',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Interesse: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            }
        }
    });
    
    // Atualizar dados do mês atual
    const currentMonth = data[data.length - 1];
    if (currentMonth) {
        document.getElementById('currentMonth').textContent = currentMonth.month;
        document.getElementById('currentValue').textContent = currentMonth.value;
    }
}

// Atualizar mapa do Brasil
function updateBrazilMap(regionalData) {
    const mapContainer = document.getElementById('brazilMapContainer');
    
    // Dados de exemplo se não houver dados reais
    const data = regionalData || {
        'SP': { level: 'excelente', value: 85 },
        'RJ': { level: 'bom', value: 70 },
        'MG': { level: 'bom', value: 65 },
        'RS': { level: 'medio', value: 45 },
        'PR': { level: 'bom', value: 60 },
        'SC': { level: 'medio', value: 50 },
        'BA': { level: 'pouco', value: 25 },
        'PE': { level: 'medio', value: 40 },
        'CE': { level: 'pouco', value: 30 }
    };
    
    // Criar SVG do mapa do Brasil (simplificado)
    mapContainer.innerHTML = `
        <svg width="100%" height="300" viewBox="0 0 500 400">
            <!-- Estados principais do Brasil -->
            <path d="M200,200 L280,200 L280,260 L200,260 Z" 
                  class="brazil-state" 
                  data-state="SP" 
                  data-name="São Paulo"
                  fill="${getStateColor(data.SP?.level)}"
                  opacity="0.8">
            </path>
            <path d="M280,200 L320,200 L320,240 L280,240 Z" 
                  class="brazil-state" 
                  data-state="RJ" 
                  data-name="Rio de Janeiro"
                  fill="${getStateColor(data.RJ?.level)}"
                  opacity="0.8">
            </path>
            <path d="M160,160 L240,160 L240,200 L160,200 Z" 
                  class="brazil-state" 
                  data-state="MG" 
                  data-name="Minas Gerais"
                  fill="${getStateColor(data.MG?.level)}"
                  opacity="0.8">
            </path>
            <path d="M140,260 L200,260 L200,320 L140,320 Z" 
                  class="brazil-state" 
                  data-state="RS" 
                  data-name="Rio Grande do Sul"
                  fill="${getStateColor(data.RS?.level)}"
                  opacity="0.8">
            </path>
            <path d="M160,220 L200,220 L200,260 L160,260 Z" 
                  class="brazil-state" 
                  data-state="PR" 
                  data-name="Paraná"
                  fill="${getStateColor(data.PR?.level)}"
                  opacity="0.8">
            </path>
            <path d="M200,220 L240,220 L240,260 L200,260 Z" 
                  class="brazil-state" 
                  data-state="SC" 
                  data-name="Santa Catarina"
                  fill="${getStateColor(data.SC?.level)}"
                  opacity="0.8">
            </path>
            <path d="M240,100 L320,100 L320,160 L240,160 Z" 
                  class="brazil-state" 
                  data-state="BA" 
                  data-name="Bahia"
                  fill="${getStateColor(data.BA?.level)}"
                  opacity="0.8">
            </path>
            <path d="M320,80 L380,80 L380,140 L320,140 Z" 
                  class="brazil-state" 
                  data-state="PE" 
                  data-name="Pernambuco"
                  fill="${getStateColor(data.PE?.level)}"
                  opacity="0.8">
            </path>
            <path d="M320,40 L380,40 L380,80 L320,80 Z" 
                  class="brazil-state" 
                  data-state="CE" 
                  data-name="Ceará"
                  fill="${getStateColor(data.CE?.level)}"
                  opacity="0.8">
            </path>
        </svg>
    `;
    
    // Adicionar interatividade ao mapa
    setupMapInteractivity(data);
}

// Configurar interatividade do mapa
function setupMapInteractivity(data) {
    const states = document.querySelectorAll('.brazil-state');
    const tooltip = document.getElementById('stateTooltip');
    
    states.forEach(state => {
        state.addEventListener('mouseenter', function() {
            const stateCode = this.getAttribute('data-state');
            const stateName = this.getAttribute('data-name');
            const stateData = data[stateCode];
            
            if (stateData) {
                document.getElementById('tooltipStateName').textContent = stateName;
                document.getElementById('tooltipStateValue').textContent = `${stateData.value}%`;
                
                const levelBadge = document.getElementById('tooltipStateLevel');
                levelBadge.textContent = getLevelLabel(stateData.level);
                levelBadge.style.backgroundColor = getStateColor(stateData.level);
                
                tooltip.classList.remove('hidden');
            }
        });
        
        state.addEventListener('mouseleave', function() {
            tooltip.classList.add('hidden');
        });
    });
}

// Obter cor do estado baseada no nível
function getStateColor(level) {
    const colors = {
        'excelente': '#1e40af',
        'bom': '#3b82f6',
        'medio': '#fbbf24',
        'pouco': '#ef4444'
    };
    return colors[level] || '#9ca3af';
}

// Obter label do nível
function getLevelLabel(level) {
    const labels = {
        'excelente': 'Excelente',
        'bom': 'Bom',
        'medio': 'Médio',
        'pouco': 'Pouco'
    };
    return labels[level] || 'Indefinido';
}

// Atualizar demografia
function updateDemographics(demographics) {
    const canvas = document.getElementById('demographicsChart');
    const ctx = canvas.getContext('2d');
    
    // Destruir gráfico anterior se existir
    if (appState.charts.demographicsChart) {
        appState.charts.demographicsChart.destroy();
    }
    
    const avgIncome = demographics?.avg_income || 3500;
    
    const data = [
        { category: 'Baixa', value: avgIncome * 0.6 },
        { category: 'Média', value: avgIncome },
        { category: 'Alta', value: avgIncome * 1.8 }
    ];
    
    appState.charts.demographicsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.category),
            datasets: [{
                label: 'Renda',
                data: data.map(d => d.value),
                backgroundColor: '#3b82f6',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            }
        }
    });
    
    // Atualizar renda média
    document.getElementById('avgIncome').textContent = 
        'R$ ' + avgIncome.toLocaleString('pt-BR');
}

// Atualizar tabela de concorrentes
function updateCompetitors(competitors) {
    const tableBody = document.getElementById('competitorsTableBody');
    
    // Dados de exemplo se não houver dados reais
    const data = competitors || [
        { name: 'Produto Premium', price: 89.90, rating: 4.5 },
        { name: 'Produto Standard', price: 65.50, rating: 4.2 },
        { name: 'Produto Básico', price: 45.00, rating: 3.8 },
        { name: 'Produto Deluxe', price: 120.00, rating: 4.7 },
        { name: 'Produto Pro', price: 95.75, rating: 4.3 }
    ];
    
    tableBody.innerHTML = data.map(competitor => `
        <tr class="hover:bg-slate-50/50 transition-colors">
            <td class="p-3 font-medium text-slate-800">
                ${competitor.name}
            </td>
            <td class="p-3">
                <div class="flex flex-col gap-1">
                    <span class="font-semibold text-slate-900">
                        R$ ${competitor.price.toFixed(2)}
                    </span>
                    <span class="badge ${getPriceBadgeClass(competitor.price)}">
                        ${getPriceBadgeLabel(competitor.price)}
                    </span>
                </div>
            </td>
            <td class="p-3">
                <div class="flex items-center gap-1">
                    ${generateStars(competitor.rating)}
                    <span class="ml-2 text-sm text-slate-600">
                        ${competitor.rating.toFixed(1)}
                    </span>
                </div>
            </td>
        </tr>
    `).join('');
}

// Gerar estrelas de avaliação
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star star filled"></i>';
        } else {
            stars += '<i class="fas fa-star star"></i>';
        }
    }
    return stars;
}

// Obter classe do badge de preço
function getPriceBadgeClass(price) {
    if (price < 50) return 'badge-green';
    if (price < 150) return 'badge-yellow';
    return 'badge-red';
}

// Obter label do badge de preço
function getPriceBadgeLabel(price) {
    if (price < 50) return 'Baixo';
    if (price < 150) return 'Médio';
    return 'Alto';
}

// Atualizar preço sugerido
function updateSuggestedPrice(aiInsights) {
    const priceElement = document.getElementById('suggestedPrice');
    const price = aiInsights?.suggested_price || 349.99;
    
    priceElement.textContent = `R$ ${price.toFixed(2)}`;
    
    // Animação de entrada
    priceElement.style.transform = 'scale(0.5)';
    priceElement.style.opacity = '0';
    
    setTimeout(() => {
        priceElement.style.transform = 'scale(1)';
        priceElement.style.opacity = '1';
        priceElement.style.transition = 'all 0.5s ease';
    }, 500);
}

// Atualizar insights de vendas
function updateSalesInsights(aiInsights) {
    const seasonalityText = document.getElementById('seasonalityText');
    const opportunitiesContainer = document.getElementById('opportunitiesContainer');
    
    // Atualizar sazonalidade
    const seasonality = aiInsights?.seasonality?.trend || 'Maior demanda no final do ano';
    seasonalityText.textContent = seasonality;
    
    // Atualizar oportunidades
    const opportunities = aiInsights?.sales_recommendations || [
        'Black Friday',
        'Natal',
        'Volta às aulas'
    ];
    
    opportunitiesContainer.innerHTML = opportunities.map(opportunity => `
        <span class="badge badge-green">${opportunity}</span>
    `).join('');
}

// Atualizar insights de IA
function updateAIInsights(aiInsights) {
    const viabilityIcon = document.getElementById('viabilityIcon');
    const viabilityBadge = document.getElementById('viabilityBadge');
    const detailedRecommendations = document.getElementById('detailedRecommendations');
    
    // Atualizar viabilidade
    const viability = aiInsights?.market_opportunity?.level || 'alta';
    const viabilityScore = aiInsights?.market_opportunity?.score || 85;
    
    // Atualizar ícone baseado na viabilidade
    if (viability === 'alta' || viability === 'excelente') {
        viabilityIcon.className = 'fas fa-check-circle text-green-600 mt-1';
        viabilityBadge.className = 'px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800';
        viabilityBadge.textContent = 'Alta';
    } else if (viability === 'baixa') {
        viabilityIcon.className = 'fas fa-times-circle text-red-600 mt-1';
        viabilityBadge.className = 'px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800';
        viabilityBadge.textContent = 'Baixa';
    } else {
        viabilityIcon.className = 'fas fa-exclamation-circle text-yellow-600 mt-1';
        viabilityBadge.className = 'px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800';
        viabilityBadge.textContent = 'Média';
    }
    
    // Atualizar recomendações
    const recommendations = aiInsights?.market_opportunity?.reasoning || 
        'Produto com boa viabilidade no mercado brasileiro. Recomenda-se focar nas regiões Sul e Sudeste.';
    detailedRecommendations.textContent = recommendations;
}

// Mostrar erro
function showError(message) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = `
        <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
            <h3 class="text-lg font-semibold text-red-800 mb-2">Erro na Análise</h3>
            <p class="text-red-700">${message}</p>
            <p class="text-red-600 text-sm mt-2">Tente novamente em alguns instantes ou entre em contato com o suporte se o problema persistir.</p>
        </div>
    `;
    resultsContainer.classList.remove('hidden');
}

// Funções de cache (usando localStorage)
function getCachedResult(query) {
    try {
        const cacheKey = `market_research_${btoa(query)}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            const data = JSON.parse(cached);
            const now = Date.now();
            
            if (now - data.timestamp < MARKET_RESEARCH_CONFIG.cacheTimeout) {
                return data.results;
            } else {
                localStorage.removeItem(cacheKey);
            }
        }
    } catch (error) {
        console.error('Erro ao acessar cache:', error);
    }
    
    return null;
}

function setCachedResult(query, results) {
    try {
        const cacheKey = `market_research_${btoa(query)}`;
        const data = {
            timestamp: Date.now(),
            results: results
        };
        
        localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (error) {
        console.error('Erro ao salvar no cache:', error);
    }
}

// Funções de histórico
function loadSearchHistory() {
    try {
        const history = localStorage.getItem('market_research_history');
        if (history) {
            appState.searchHistory = JSON.parse(history);
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        appState.searchHistory = [];
    }
}

function addToSearchHistory(query) {
    try {
        // Remover duplicatas
        appState.searchHistory = appState.searchHistory.filter(item => item.query !== query);
        
        // Adicionar no início
        appState.searchHistory.unshift({
            query: query,
            timestamp: Date.now()
        });
        
        // Manter apenas os últimos 10
        appState.searchHistory = appState.searchHistory.slice(0, 10);
        
        // Salvar no localStorage
        localStorage.setItem('market_research_history', JSON.stringify(appState.searchHistory));
    } catch (error) {
        console.error('Erro ao salvar histórico:', error);
    }
}

// Exportar funções globais para compatibilidade
window.MarketSenseAI = {
    handleSearch,
    displayResults,
    appState
};
