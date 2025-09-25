// Arquivo de Integração - MarketSense AI com Sistema Existente
// Este arquivo adapta o novo design para funcionar com o sistema atual

// Função para integrar com o SPA existente
function integrateWithExistingSPA() {
    // Verificar se o SPA existe
    if (typeof loadPage === 'function') {
        console.log('Integrando com SPA existente...');
        
        // Adicionar nova página ao sistema de roteamento
        if (typeof pages !== 'undefined') {
            pages['market-research-new'] = {
                title: 'Pesquisa de Mercado - MarketSense AI',
                content: loadMarketResearchNewPage,
                requiresAuth: true
            };
        }
    }
}

// Função para carregar a nova página de pesquisa de mercado
function loadMarketResearchNewPage() {
    return fetch('market-research-new.html')
        .then(response => response.text())
        .then(html => {
            // Extrair apenas o conteúdo do body
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const bodyContent = doc.body.innerHTML;
            
            // Carregar CSS se não estiver carregado
            if (!document.querySelector('link[href="market-research-new.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'market-research-new.css';
                document.head.appendChild(link);
            }
            
            return bodyContent;
        })
        .then(content => {
            // Carregar JavaScript se não estiver carregado
            if (!window.MarketSenseAI) {
                return loadScript('market-research-new.js').then(() => content);
            }
            return content;
        });
}

// Função para carregar scripts dinamicamente
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Função para substituir a página atual de pesquisa de mercado
function replaceCurrentMarketResearch() {
    // Encontrar o link da sidebar para pesquisa de mercado
    const marketResearchLink = document.querySelector('a[href*="market"], a[onclick*="market"]');
    
    if (marketResearchLink) {
        // Atualizar o link para usar a nova página
        marketResearchLink.onclick = function(e) {
            e.preventDefault();
            if (typeof loadPage === 'function') {
                loadPage('market-research-new');
            } else {
                // Fallback: carregar diretamente
                window.location.href = 'market-research-new.html';
            }
        };
        
        console.log('Link de pesquisa de mercado atualizado para nova versão');
    }
}

// Função para migrar dados existentes
function migrateExistingData() {
    // Verificar se há dados de pesquisas anteriores
    const oldData = localStorage.getItem('market_research_cache');
    if (oldData) {
        try {
            const parsedData = JSON.parse(oldData);
            // Converter formato antigo para novo se necessário
            console.log('Dados existentes encontrados, migrando...');
            // Implementar migração conforme necessário
        } catch (error) {
            console.error('Erro ao migrar dados existentes:', error);
        }
    }
}

// Função para manter compatibilidade com APIs existentes
function setupAPICompatibility() {
    // Se as funções antigas existirem, criar wrappers
    if (typeof performMarketResearch !== 'function') {
        window.performMarketResearch = async function(query) {
            // Usar a implementação existente do sistema
            if (typeof handleMarketSearch === 'function') {
                return await handleMarketSearch(query);
            }
            
            // Fallback para dados de exemplo
            return {
                success: true,
                data: {
                    trend_data: [
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
                    ],
                    regional_data: {
                        'SP': { level: 'excelente', value: 85 },
                        'RJ': { level: 'bom', value: 70 },
                        'MG': { level: 'bom', value: 65 },
                        'RS': { level: 'medio', value: 45 },
                        'PR': { level: 'bom', value: 60 }
                    },
                    demographics: {
                        avg_income: 3500
                    },
                    competitors: [
                        { name: `${query} Premium`, price: 89.90, rating: 4.5 },
                        { name: `${query} Standard`, price: 65.50, rating: 4.2 },
                        { name: `${query} Básico`, price: 45.00, rating: 3.8 }
                    ],
                    ai_insights: {
                        suggested_price: 349.99,
                        price_rationale: 'Baseado na análise de mercado',
                        seasonality: {
                            trend: 'Maior demanda no final do ano'
                        },
                        market_opportunity: {
                            level: 'alta',
                            score: 85,
                            reasoning: 'Produto com boa viabilidade no mercado brasileiro.'
                        },
                        sales_recommendations: ['Black Friday', 'Natal', 'Volta às aulas']
                    }
                }
            };
        };
    }
}

// Função para verificar dependências
function checkDependencies() {
    const dependencies = [
        { name: 'Chart.js', check: () => typeof Chart !== 'undefined' },
        { name: 'Tailwind CSS', check: () => document.querySelector('script[src*="tailwind"]') !== null },
        { name: 'Supabase', check: () => typeof supabaseClient !== 'undefined' }
    ];
    
    const missing = dependencies.filter(dep => !dep.check());
    
    if (missing.length > 0) {
        console.warn('Dependências faltando:', missing.map(dep => dep.name));
        return false;
    }
    
    console.log('Todas as dependências estão disponíveis');
    return true;
}

// Função para configurar tema baseado no sistema existente
function setupThemeCompatibility() {
    // Verificar se há sistema de tema existente
    if (typeof toggleTheme === 'function' || document.body.classList.contains('dark-theme')) {
        console.log('Sistema de tema detectado, configurando compatibilidade...');
        
        // Observar mudanças de tema
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    const isDark = document.body.classList.contains('dark-theme');
                    updateMarketResearchTheme(isDark);
                }
            });
        });
        
        observer.observe(document.body, { attributes: true });
    }
}

// Função para atualizar tema da pesquisa de mercado
function updateMarketResearchTheme(isDark) {
    const marketResearchContainer = document.querySelector('.market-research-container');
    if (marketResearchContainer) {
        if (isDark) {
            marketResearchContainer.classList.add('dark-mode');
        } else {
            marketResearchContainer.classList.remove('dark-mode');
        }
    }
}

// Função para configurar autenticação
function setupAuthIntegration() {
    // Verificar se há sistema de autenticação existente
    if (typeof userSubscriptionStatus !== 'undefined') {
        console.log('Sistema de autenticação detectado');
        
        // Configurar verificação de acesso
        window.checkMarketResearchAccess = function() {
            return userSubscriptionStatus.status === 'active';
        };
    } else {
        // Fallback: sempre permitir acesso para desenvolvimento
        window.checkMarketResearchAccess = function() {
            return true;
        };
    }
}

// Função principal de inicialização da integração
function initializeIntegration() {
    console.log('Inicializando integração MarketSense AI...');
    
    // Verificar dependências
    if (!checkDependencies()) {
        console.error('Dependências faltando. A integração pode não funcionar corretamente.');
    }
    
    // Configurar integrações
    setupAPICompatibility();
    setupAuthIntegration();
    setupThemeCompatibility();
    
    // Migrar dados existentes
    migrateExistingData();
    
    // Integrar com SPA se disponível
    integrateWithExistingSPA();
    
    // Substituir página atual se solicitado
    if (window.location.search.includes('replace=true')) {
        replaceCurrentMarketResearch();
    }
    
    console.log('Integração MarketSense AI concluída');
}

// Função para atualizar a sidebar existente
function updateSidebarLink() {
    // Encontrar o link de pesquisa de mercado na sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar a, nav a, .menu a');
    
    sidebarLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        if (text.includes('pesquisa') && text.includes('mercado')) {
            // Atualizar o link para usar a nova página
            link.href = 'market-research-new.html';
            link.onclick = function(e) {
                e.preventDefault();
                
                // Se estiver usando SPA, carregar via SPA
                if (typeof loadPage === 'function') {
                    loadPage('market-research-new');
                } else {
                    // Carregar diretamente
                    window.location.href = 'market-research-new.html';
                }
            };
            
            console.log('Link da sidebar atualizado para MarketSense AI');
        }
    });
}

// Função para criar botão de teste/preview
function createPreviewButton() {
    const button = document.createElement('button');
    button.textContent = '🚀 Testar Nova Pesquisa de Mercado';
    button.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50';
    button.onclick = function() {
        if (typeof loadPage === 'function') {
            loadPage('market-research-new');
        } else {
            window.open('market-research-new.html', '_blank');
        }
    };
    
    document.body.appendChild(button);
    
    // Remover o botão após 10 segundos
    setTimeout(() => {
        button.remove();
    }, 10000);
}

// Executar integração quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeIntegration);
} else {
    initializeIntegration();
}

// Criar botão de preview para teste
if (window.location.search.includes('preview=true')) {
    createPreviewButton();
}

// Exportar funções para uso global
window.MarketSenseIntegration = {
    initializeIntegration,
    updateSidebarLink,
    replaceCurrentMarketResearch,
    checkDependencies
};
