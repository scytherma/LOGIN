import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AIInsights({ insights }) {
  const getViabilityIcon = (viability) => {
    if (viability?.toLowerCase().includes('alta') || viability?.toLowerCase().includes('boa')) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (viability?.toLowerCase().includes('baixa')) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    return <AlertCircle className="w-5 h-5 text-yellow-600" />;
  };

  const getViabilityColor = (viability) => {
    if (viability?.toLowerCase().includes('alta') || viability?.toLowerCase().includes('boa')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (viability?.toLowerCase().includes('baixa')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200 shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-slate-800">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl">Insights e recomendações de IA</h3>
              <p className="text-sm font-normal text-slate-600 mt-1">
                Análise detalhada baseada em dados de mercado
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Viability Assessment */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/70 border border-indigo-100">
            {getViabilityIcon(insights?.viability)}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-slate-800">Viabilidade do Produto</h4>
                <Badge className={getViabilityColor(insights?.viability)}>
                  {insights?.viability}
                </Badge>
              </div>
            </div>
          </div>

          {/* Detailed Recommendations */}
          <div className="p-6 rounded-xl bg-white/70 border border-indigo-100">
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              Recomendações detalhadas
            </h4>
            <p className="text-slate-700 leading-relaxed">
              {insights?.recommendations}
            </p>
          </div>

          {/* Market Analysis Summary */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/50 border border-indigo-100 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                Análise Completa
              </p>
              <p className="text-sm text-slate-800 font-medium">Mercado Analisado</p>
            </div>
            
            <div className="p-4 rounded-xl bg-white/50 border border-indigo-100 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IA</span>
              </div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                Inteligência Artificial
              </p>
              <p className="text-sm text-slate-800 font-medium">Insights Gerados</p>
            </div>
            
            <div className="p-4 rounded-xl bg-white/50 border border-indigo-100 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">$</span>
              </div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                Precificação
              </p>
              <p className="text-sm text-slate-800 font-medium">Preço Calculado</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}