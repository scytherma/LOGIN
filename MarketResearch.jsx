import React, { useState } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { ProductAnalysis } from "@/entities/ProductAnalysis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import SearchSection from "../components/market/SearchSection";
import TrendChart from "../components/market/TrendChart";
import BrazilMap from "../components/market/BrazilMap";
import Demographics from "../components/market/Demographics";
import CompetitorTable from "../components/market/CompetitorTable";
import SuggestedPrice from "../components/market/SuggestedPrice";
import SalesInsights from "../components/market/SalesInsights";
import AIInsights from "../components/market/AIInsights";

export default function MarketResearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      // Gerar análise completa usando IA
      const aiResponse = await InvokeLLM({
        prompt: `Faça uma análise completa de mercado para o produto "${searchTerm}" no Brasil. Inclua:
        1. Volume de busca estimado (0-100)
        2. Dados de tendência mensal (últimos 5 meses)
        3. Interesse por regiões brasileiras (SP, RJ, MG, RS, PR, SC, BA, PE, CE, GO, etc.)
        4. Lista de 5 concorrentes com preços realistas em reais
        5. Preço sugerido baseado no mercado
        6. Renda média do público-alvo
        7. Insights de sazonalidade, oportunidades e riscos
        8. Recomendações finais de viabilidade
        
        Seja específico e realista com os dados brasileiros.`,
        response_json_schema: {
          type: "object",
          properties: {
            product_name: { type: "string" },
            search_volume: { type: "number" },
            trend_data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  month: { type: "string" },
                  value: { type: "number" }
                }
              }
            },
            regions_interest: {
              type: "object",
              additionalProperties: {
                type: "object",
                properties: {
                  level: { type: "string" },
                  value: { type: "number" }
                }
              }
            },
            competitors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  price: { type: "number" },
                  rating: { type: "number" }
                }
              }
            },
            suggested_price: { type: "number" },
            avg_income: { type: "number" },
            insights: {
              type: "object",
              properties: {
                viability: { type: "string" },
                seasonality: { type: "string" },
                opportunities: { type: "array", items: { type: "string" } },
                risks: { type: "array", items: { type: "string" } },
                recommendations: { type: "string" }
              }
            }
          }
        }
      });

      // Salvar análise
      await ProductAnalysis.create(aiResponse);
      setAnalysisData(aiResponse);
      
    } catch (error) {
      console.error("Erro na análise:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-600 bg-clip-text text-transparent mb-4">
            Pesquisa de Mercado
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Análise inteligente de produtos com dados de tendência, concorrência e insights de IA
          </p>
        </motion.div>

        {/* Search Section */}
        <SearchSection 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Results */}
        <AnimatePresence>
          {analysisData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* First Row */}
              <div className="grid lg:grid-cols-2 gap-8">
                <TrendChart data={analysisData.trend_data} />
                <BrazilMap data={analysisData.regions_interest} />
              </div>

              {/* Second Row */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Demographics avgIncome={analysisData.avg_income} />
                <CompetitorTable competitors={analysisData.competitors} />
              </div>

              {/* Third Row */}
              <div className="grid lg:grid-cols-2 gap-8">
                <SuggestedPrice price={analysisData.suggested_price} />
                <SalesInsights insights={analysisData.insights} />
              </div>

              {/* AI Insights - Full Width */}
              <AIInsights insights={analysisData.insights} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}