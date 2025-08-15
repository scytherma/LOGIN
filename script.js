// Configurações da Shopee
const SHOPEE_CONFIG = {
    taxaComissaoPadrao: 0.14, // 14%
    taxaComissaoFreteGratis: 0.20, // 20%
    taxaTransacao: 0.00, // 0%
    taxaFixaPorItem: 4.00, // R$4,00 por item vendido
};

// Multiplicadores
let multiplicadorCustoShopee = 1;
let multiplicadorCustoML = 1;

// Sistema de Abas
document.addEventListener("DOMContentLoaded", function() {
    initializeTabs();
    initializeShopeeCalculator();
    initializeMercadoLivreCalculator();
    initializeThemeToggle(); // Inicializa a funcionalidade de tema
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", function() {
            if (this.classList.contains("disabled")) return;

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));

            // Add active class to clicked button and corresponding content
            this.classList.add("active");
            const tabId = this.getAttribute("data-tab");
            document.getElementById(tabId + "-tab").classList.add("active");
        });
    });
}

// ===== LÓGICA DE TEMA =====
function initializeThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;

    // Carregar preferência de tema do localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        body.classList.add(savedTheme);
        if (savedTheme === "dark-theme") {
            themeToggle.checked = true;
        }
    }

    // Adicionar listener para alternar tema
    if (themeToggle) {
        themeToggle.addEventListener("change", function() {
            if (this.checked) {
                body.classList.add("dark-theme");
                localStorage.setItem("theme", "dark-theme");
            } else {
                body.classList.remove("dark-theme");
                localStorage.setItem("theme", ""); // Ou 'light-theme'
            }
        });
    }
}

// ===== CALCULADORA SHOPEE =====
function initializeShopeeCalculator() {
    const elements = {
        freteGratis: document.getElementById("freteGratis"),
        custoProduto: document.getElementById("custoProduto"),
        impostos: document.getElementById("impostos"),
        despesasVariaveis: document.getElementById("despesasVariaveis"),
        margemLucro: document.getElementById("margemLucro"),
        custosExtrasContainer: document.getElementById("custosExtrasContainer"),
        addCustoExtraBtn: document.querySelector(".add-custo-extra-btn:not([data-target])"),
        limparCamposBtn: document.getElementById("limparCamposBtn"),
        
        // Resultados
        precoVenda: document.getElementById("precoVenda"),
        lucroPorVenda: document.getElementById("lucroPorVenda"),
        taxaShopee: document.getElementById("taxaShopee"),
        valorImpostos: document.getElementById("valorImpostos"),
        custoTotal: document.getElementById("custoTotal"),
        retornoProduto: document.getElementById("retornoProduto"),
        markupPercent: document.getElementById("markupPercent"),
        markupX: document.getElementById("markupX"),
        margemValue: document.getElementById("margemValue")
    };

    // Event Listeners
    if (elements.margemLucro) {
        elements.margemLucro.addEventListener("input", function() {
            atualizarMargemValue(elements.margemValue, this.value);
            atualizarCorMargem(this, this.value);
            calcularPrecoVendaShopee();
        });
    }
    
    // Botões do multiplicador
    const arrowUp = document.querySelector(".arrow-up:not([data-target])");
    const arrowDown = document.querySelector(".arrow-down:not([data-target])");
    
    if (arrowUp) {
        arrowUp.addEventListener("click", () => {
            multiplicadorCustoShopee = Math.max(1, multiplicadorCustoShopee + 1);
            document.querySelector(".multiplier:not([id])").textContent = `${multiplicadorCustoShopee}x`;
            calcularPrecoVendaShopee();
        });
    }
    
    if (arrowDown) {
        arrowDown.addEventListener("click", () => {
            multiplicadorCustoShopee = Math.max(1, multiplicadorCustoShopee - 1);
            document.querySelector(".multiplier:not([id])").textContent = `${multiplicadorCustoShopee}x`;
            calcularPrecoVendaShopee();
        });
    }
    
    // Validação de inputs numéricos
    [elements.custoProduto, elements.despesasVariaveis].forEach(element => {
        if (element) {
            element.addEventListener("input", function() {
                validarEntradaNumerica(this);
                calcularPrecoVendaShopee();
            });
            
            element.addEventListener("blur", function() {
                formatarCampo(this);
                calcularPrecoVendaShopee();
            });
        }
    });
    
    // Validação especial para impostos
    if (elements.impostos) {
        elements.impostos.addEventListener("input", function() {
            validarEntradaNumerica(this);
            calcularPrecoVendaShopee();
        });

        elements.impostos.addEventListener("blur", function() {
            let valorString = this.value.replace(",", ".");
            let valor = parseFloat(valorString);
            
            if (isNaN(valor) || valor < 0) {
                this.value = "0,00";
            } else if (valor > 100) {
                this.value = "100,00";
            } else {
                this.value = valor.toFixed(2).replace(".", ",");
            }
            calcularPrecoVendaShopee();
        });
    }

    // Toggle frete grátis
    if (elements.freteGratis) {
        elements.freteGratis.addEventListener("change", calcularPrecoVendaShopee);
    }

    // Botão adicionar custo extra
    if (elements.addCustoExtraBtn) {
        elements.addCustoExtraBtn.addEventListener("click", () => adicionarCustoExtra(""));
    }

    // Botão limpar campos
    if (elements.limparCamposBtn) {
        elements.limparCamposBtn.addEventListener("click", resetarCalculadoraShopee);
    }

    // Cálculo inicial
    atualizarMargemValue(elements.margemValue, 0);
    calcularPrecoVendaShopee();
}

function calcularPrecoVendaShopee() {
    const custoProdutoValue = document.getElementById("custoProduto").value || "0";
    const custoProdutoBase = parseFloat(custoProdutoValue.replace(",", ".")) || 0;
    const custoProduto = custoProdutoBase * multiplicadorCustoShopee;
    
    const impostosValue = document.getElementById("impostos").value || "0";
    const impostosPercent = parseFloat(impostosValue.replace(",", ".")) || 0;
    
    const despesasValue = document.getElementById("despesasVariaveis").value || "0";
    const despesasVariaveis = parseFloat(despesasValue.replace(",", ".")) || 0;
    
    const margemDesejada = parseFloat(document.getElementById("margemLucro").value) || 0;
    const temFreteGratis = document.getElementById("freteGratis").checked;

    // Separar custos extras em valores reais e percentuais
    let custosExtrasReais = 0;
    let custosExtrasPercentuais = 0;
    
    document.querySelectorAll("#custosExtrasContainer .custo-extra-item").forEach(item => {
        const valueInput = item.querySelector(".custo-extra-value");
        const typeSelector = item.querySelector(".custo-extra-type-selector");

        const valor = parseFloat(valueInput.value.replace(",", ".")) || 0;
        const tipo = typeSelector.value;

        if (tipo === "real") {
            custosExtrasReais += valor;
        } else if (tipo === "percent") {
            custosExtrasPercentuais += (valor / 100);
        }
    });
    
    const custoTotalProduto = custoProduto + custosExtrasReais;
    const taxaComissaoAplicada = temFreteGratis ? SHOPEE_CONFIG.taxaComissaoFreteGratis : SHOPEE_CONFIG.taxaComissaoPadrao;
    
    const denominador = (1 - taxaComissaoAplicada - (margemDesejada / 100) - (impostosPercent / 100) - custosExtrasPercentuais);
    let precoVenda = 0;
    if (denominador > 0) {
        precoVenda = (custoTotalProduto + despesasVariaveis + SHOPEE_CONFIG.taxaFixaPorItem) / denominador;
    }

    const valorImpostos = precoVenda * (impostosPercent / 100);
    const valorCustosExtrasPercentuais = precoVenda * custosExtrasPercentuais;
    const taxaShopeeComissao = precoVenda * taxaComissaoAplicada;
    const taxaShopeeValorTotal = taxaShopeeComissao + SHOPEE_CONFIG.taxaFixaPorItem;
    
    const lucroLiquido = precoVenda - custoTotalProduto - despesasVariaveis - taxaShopeeValorTotal - valorImpostos - valorCustosExtrasPercentuais;
    
    const retornoProduto = custoTotalProduto > 0 ? (lucroLiquido / custoTotalProduto) * 100 : 0;
    const markupPercent = custoTotalProduto > 0 ? ((precoVenda - custoTotalProduto) / custoTotalProduto) * 100 : 0;
    const markupX = custoTotalProduto > 0 ? precoVenda / custoTotalProduto : 0;
    
    // Atualizar interface
    atualizarResultadosShopee({
        precoVenda,
        lucroLiquido,
        taxaShopeeValor: taxaShopeeValorTotal,
        valorImpostos,
        custoTotalProduto,
        retornoProduto,
        markupPercent,
        markupX
    });
}

function atualizarResultadosShopee(resultados) {
    document.getElementById("precoVenda").textContent = formatarReal(resultados.precoVenda);
    document.getElementById("lucroPorVenda").textContent = formatarReal(resultados.lucroLiquido);
    document.getElementById("taxaShopee").textContent = formatarReal(resultados.taxaShopeeValor);
    document.getElementById("valorImpostos").textContent = formatarReal(resultados.valorImpostos);
    document.getElementById("custoTotal").textContent = formatarReal(resultados.custoTotalProduto);
    document.getElementById("retornoProduto").textContent = formatarPercentual(resultados.retornoProduto);
    document.getElementById("markupPercent").textContent = formatarPercentual(resultados.markupPercent);
    document.getElementById("markupX").textContent = `${resultados.markupX.toFixed(2)}X`;
    
    // Atualizar cor do lucro
    const lucroPorVendaElement = document.getElementById("lucroPorVenda");
    if (resultados.lucroLiquido > 0) {
        lucroPorVendaElement.style.color = "var(--accent-success)";
    } else if (resultados.lucroLiquido < 0) {
        lucroPorVendaElement.style.color = "var(--accent-danger)";
    } else {
        lucroPorVendaElement.style.color = "var(--accent-primary)";
    }
}

function resetarCalculadoraShopee() {
    document.getElementById("custoProduto").value = "";
    document.getElementById("impostos").value = "";
    document.getElementById("despesasVariaveis").value = "";
    document.getElementById("margemLucro").value = 0;
    document.getElementById("freteGratis").checked = true;
    multiplicadorCustoShopee = 1;
    document.querySelector(".multiplier:not([id])").textContent = "1x";
    
    document.getElementById("custosExtrasContainer").innerHTML = "";
    
    atualizarMargemValue(document.getElementById("margemValue"), 0);
    calcularPrecoVendaShopee();
}

// ===== CALCULADORA MERCADO LIVRE =====
function initializeMercadoLivreCalculator() {
    const elements = {
        custoProduto: document.getElementById("custoProdutoML"),
        impostos: document.getElementById("impostosML"),
        despesasVariaveis: document.getElementById("despesasVariaveisML"),
        taxaMercadoLivreSelect: document.getElementById("taxaMercadoLivreSelect"),
        taxaFreteSelect: document.getElementById("taxaFreteSelect"),
        margemLucro: document.getElementById("margemLucroML"),
        custosExtrasContainer: document.getElementById("custosExtrasContainerML"),
        addCustoExtraBtn: document.querySelector(".add-custo-extra-btn[data-target=\'ML\']"),
        limparCamposBtn: document.getElementById("limparCamposBtnML"),
        
        // Resultados
        precoVenda: document.getElementById("precoVendaML"),
        lucroPorVenda: document.getElementById("lucroPorVendaML"),
        taxaMercadoLivre: document.getElementById("taxaMercadoLivre"),
        valorImpostos: document.getElementById("valorImpostosML"),
        custoTotal: document.getElementById("custoTotalML"),
        retornoProduto: document.getElementById("retornoProdutoML"),
        markupPercent: document.getElementById("markupPercentML"),
        markupX: document.getElementById("markupXML"),
        margemValue: document.getElementById("margemValueML")
    };

    // Event Listeners
    if (elements.margemLucro) {
        elements.margemLucro.addEventListener("input", function() {
            atualizarMargemValue(elements.margemValue, this.value);
            atualizarCorMargem(this, this.value);
            calcularPrecoVendaML();
        });
    }
    
    // Botões do multiplicador
    const arrowUpML = document.querySelector(".arrow-up[data-target=\'ML\']");
    const arrowDownML = document.querySelector(".arrow-down[data-target=\'ML\']");
    
    if (arrowUpML) {
        arrowUpML.addEventListener("click", () => {
            multiplicadorCustoML = Math.max(1, multiplicadorCustoML + 1);
            document.getElementById("multiplierML").textContent = `${multiplicadorCustoML}x`;
            calcularPrecoVendaML();
        });
    }
    
    if (arrowDownML) {
        arrowDownML.addEventListener("click", () => {
            multiplicadorCustoML = Math.max(1, multiplicadorCustoML - 1);
            document.getElementById("multiplierML").textContent = `${multiplicadorCustoML}x`;
            calcularPrecoVendaML();
        });
    }
    
    // Validação de inputs numéricos
    [elements.custoProduto, elements.despesasVariaveis].forEach(element => {
        if (element) {
            element.addEventListener("input", function() {
                validarEntradaNumerica(this);
                calcularPrecoVendaML();
            });
            
            element.addEventListener("blur", function() {
                formatarCampo(this);
                calcularPrecoVendaML();
            });
        }
    });
    
    // Validação especial para impostos
    if (elements.impostos) {
        elements.impostos.addEventListener("input", function() {
            validarEntradaNumerica(this);
            calcularPrecoVendaML();
        });

        elements.impostos.addEventListener("blur", function() {
            let valorString = this.value.replace(",", ".");
            let valor = parseFloat(valorString);
            
            if (isNaN(valor) || valor < 0) {
                this.value = "0,00";
            } else if (valor > 100) {
                this.value = "100,00";
            } else {
                this.value = valor.toFixed(2).replace(".", ",");
            }
            calcularPrecoVendaML();
        });
    }

    // Selects
    if (elements.taxaMercadoLivreSelect) {
        elements.taxaMercadoLivreSelect.addEventListener("change", calcularPrecoVendaML);
    }
    
    if (elements.taxaFreteSelect) {
        elements.taxaFreteSelect.addEventListener("change", calcularPrecoVendaML);
    }

    // Botão adicionar custo extra
    if (elements.addCustoExtraBtn) {
        elements.addCustoExtraBtn.addEventListener("click", () => adicionarCustoExtra("ML"));
    }

    // Botão limpar campos
    if (elements.limparCamposBtn) {
        elements.limparCamposBtn.addEventListener("click", resetarCalculadoraML);
    }

    // Cálculo inicial
    atualizarMargemValue(elements.margemValue, 0);
    calcularPrecoVendaML();
}

function calcularPrecoVendaML() {
    const custoProdutoValue = document.getElementById("custoProdutoML").value || "0";
    const custoProdutoBase = parseFloat(custoProdutoValue.replace(",", ".")) || 0;
    const custoProduto = custoProdutoBase * multiplicadorCustoML;
    
    const impostosValue = document.getElementById("impostosML").value || "0";
    const impostosPercent = parseFloat(impostosValue.replace(",", ".")) || 0;
    
    const despesasValue = document.getElementById("despesasVariaveisML").value || "0";
    const despesasVariaveis = parseFloat(despesasValue.replace(",", ".")) || 0;
    
    const margemDesejada = parseFloat(document.getElementById("margemLucroML").value) || 0;
    
    const taxaMercadoLivre = parseFloat(document.getElementById("taxaMercadoLivreSelect").value) || 0;
    const taxaFrete = parseFloat(document.getElementById("taxaFreteSelect").value) || 0;

    // Separar custos extras em valores reais e percentuais
    let custosExtrasReais = 0;
    let custosExtrasPercentuais = 0;
    
    document.querySelectorAll("#custosExtrasContainerML .custo-extra-item").forEach(item => {
        const valueInput = item.querySelector(".custo-extra-value");
        const typeSelector = item.querySelector(".custo-extra-type-selector");

        const valor = parseFloat(valueInput.value.replace(",", ".")) || 0;
        const tipo = typeSelector.value;

        if (tipo === "real") {
            custosExtrasReais += valor;
        } else if (tipo === "percent") {
            custosExtrasPercentuais += (valor / 100);
        }
    });

    const custoTotalProduto = custoProduto + custosExtrasReais;
    
    const denominador = (1 - (taxaMercadoLivre / 100) - (taxaFrete / 100) - (margemDesejada / 100) - (impostosPercent / 100) - custosExtrasPercentuais);
    let precoVenda = 0;
    if (denominador > 0) {
        precoVenda = (custoTotalProduto + despesasVariaveis) / denominador;
    }

    const valorImpostos = precoVenda * (impostosPercent / 100);
    const valorCustosExtrasPercentuais = precoVenda * custosExtrasPercentuais;
    const taxaMercadoLivreValor = precoVenda * (taxaMercadoLivre / 100);
    
    const lucroLiquido = precoVenda - custoTotalProduto - despesasVariaveis - taxaMercadoLivreValor - taxaFrete - valorImpostos - valorCustosExtrasPercentuais;
    
    const retornoProduto = custoTotalProduto > 0 ? (lucroLiquido / custoTotalProduto) * 100 : 0;
    const markupPercent = custoTotalProduto > 0 ? ((precoVenda - custoTotalProduto) / custoTotalProduto) * 100 : 0;
    const markupX = custoTotalProduto > 0 ? precoVenda / custoTotalProduto : 0;
    
    // Atualizar interface
    atualizarResultadosML({
        precoVenda,
        lucroLiquido,
        taxaMercadoLivreValor,
        valorImpostos,
        custoTotalProduto,
        retornoProduto,
        markupPercent,
        markupX
    });
}

function atualizarResultadosML(resultados) {
    document.getElementById("precoVendaML").textContent = formatarReal(resultados.precoVenda);
    document.getElementById("lucroPorVendaML").textContent = formatarReal(resultados.lucroLiquido);
    document.getElementById("taxaMercadoLivre").textContent = formatarReal(resultados.taxaMercadoLivreValor);
    document.getElementById("valorImpostosML").textContent = formatarReal(resultados.valorImpostos);
    document.getElementById("custoTotalML").textContent = formatarReal(resultados.custoTotalProduto);
    document.getElementById("retornoProdutoML").textContent = formatarPercentual(resultados.retornoProduto);
    document.getElementById("markupPercentML").textContent = formatarPercentual(resultados.markupPercent);
    document.getElementById("markupXML").textContent = `${resultados.markupX.toFixed(2)}X`;
    
    // Atualizar cor do lucro
    const lucroPorVendaElement = document.getElementById("lucroPorVendaML");
    if (resultados.lucroLiquido > 0) {
        lucroPorVendaElement.style.color = "var(--accent-success)";
    } else if (resultados.lucroLiquido < 0) {
        lucroPorVendaElement.style.color = "var(--accent-danger)";
    } else {
        lucroPorVendaElement.style.color = "var(--accent-primary)";
    }
}

function resetarCalculadoraML() {
    document.getElementById("custoProdutoML").value = "";
    document.getElementById("impostosML").value = "";
    document.getElementById("despesasVariaveisML").value = "";
    document.getElementById("taxaMercadoLivreSelect").value = "0";
    document.getElementById("taxaFreteSelect").value = "0";
    document.getElementById("margemLucroML").value = 0;
    multiplicadorCustoML = 1;
    document.getElementById("multiplierML").textContent = "1x";
    
    document.getElementById("custosExtrasContainerML").innerHTML = "";
    
    atualizarMargemValue(document.getElementById("margemValueML"), 0);
    calcularPrecoVendaML();
}

// Funções Auxiliares
function formatarReal(valor) {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

function formatarPercentual(valor) {
    return `${valor.toFixed(2).replace(".", ",")}%`;
}

function validarEntradaNumerica(input) {
    let valor = input.value.replace(",", ".");
    valor = valor.replace(/[^0-9.]/g, ""); // Remove tudo exceto números e ponto
    
    // Garante que só há um ponto decimal
    const parts = valor.split(".");
    if (parts.length > 2) {
        valor = parts[0] + "." + parts.slice(1).join("");
    }
    input.value = valor.replace(".", ",");
}

function formatarCampo(input) {
    let valor = parseFloat(input.value.replace(",", ".")) || 0;
    input.value = valor.toFixed(2).replace(".", ",");
}

function adicionarCustoExtra(calculatorType) {
    const containerId = calculatorType === "ML" ? "custosExtrasContainerML" : "custosExtrasContainer";
    const container = document.getElementById(containerId);

    const custoExtraDiv = document.createElement("div");
    custoExtraDiv.classList.add("custo-extra-wrapper");
    custoExtraDiv.innerHTML = `
        <div class="custo-extra-item">
            <select class="custo-extra-type-selector">
                <option value="real">R$</option>
                <option value="percent">%</option>
            </select>
            <input type="text" class="custo-extra-value" placeholder="0,00">
        </div>
        <button type="button" class="remove-custo-extra-btn">X</button>
    `;
    container.appendChild(custoExtraDiv);

    const removeBtn = custoExtraDiv.querySelector(".remove-custo-extra-btn");
    removeBtn.addEventListener("click", () => {
        custoExtraDiv.remove();
        if (calculatorType === "ML") {
            calcularPrecoVendaML();
        } else {
            calcularPrecoVendaShopee();
        }
    });

    const valueInput = custoExtraDiv.querySelector(".custo-extra-value");
    valueInput.addEventListener("input", function() {
        validarEntradaNumerica(this);
        if (calculatorType === "ML") {
            calcularPrecoVendaML();
        } else {
            calcularPrecoVendaShopee();
        }
    });
    valueInput.addEventListener("blur", function() {
        formatarCampo(this);
        if (calculatorType === "ML") {
            calcularPrecoVendaML();
        } else {
            calcularPrecoVendaShopee();
        }
    });

    const typeSelector = custoExtraDiv.querySelector(".custo-extra-type-selector");
    typeSelector.addEventListener("change", function() {
        if (calculatorType === "ML") {
            calcularPrecoVendaML();
        } else {
            calcularPrecoVendaShopee();
        }
    });

    // Foca no novo input
    valueInput.focus();
}

// Lógica do Dropdown do Usuário
document.addEventListener("DOMContentLoaded", function() {
    const userIcon = document.getElementById("userIcon");
    const userDropdownMenu = document.getElementById("userDropdownMenu");

    if (userIcon && userDropdownMenu) {
        userIcon.addEventListener("click", function(event) {
            event.stopPropagation(); // Impede que o clique se propague para o documento
            userDropdownMenu.classList.toggle("show");
        });

        // Fechar o dropdown se clicar fora dele
        document.addEventListener("click", function(event) {
            if (!userDropdownMenu.contains(event.target) && !userIcon.contains(event.target)) {
                userDropdownMenu.classList.remove("show");
            }
        });
    }
});

function atualizarMargemValue(element, value) {
    element.textContent = `${value}%`;
}

function atualizarCorMargem(slider, value) {
    const percent = parseFloat(value);
    let colorClass = "";

    if (percent <= 10) {
        colorClass = "margem-vermelho";
    } else if (percent <= 20) {
        colorClass = "margem-laranja";
    } else if (percent <= 30) {
        colorClass = "margem-amarelo";
    } else if (percent <= 40) {
        colorClass = "margem-verde-lima";
    } else if (percent <= 50) {
        colorClass = "margem-verde-claro";
    } else if (percent <= 60) {
        colorClass = "margem-azul-ciano";
    } else {
        colorClass = "margem-azul-escuro";
    }
    slider.className = "margin-slider " + colorClass;
    slider.style.setProperty("--track-fill", `${value}%`);
}
