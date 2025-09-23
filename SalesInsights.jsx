import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function SalesInsights({ insights }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="h-full bg-white/60 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Insights de vendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Seasonality */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Sazonalidade</p>
                <p className="text-sm text-blue-700">{insights?.seasonality}</p>
              </div>
            </div>

            {/* Opportunities */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Oportunidades:</p>
              <div className="flex flex-wrap gap-2">
                {insights?.opportunities?.map((opportunity, index) => (
                  <Badge key={index} className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    {opportunity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Risks */}
            {insights?.risks?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Riscos:</p>
                <div className="flex flex-wrap gap-2">
                  {insights.risks.map((risk, index) => (
                    <Badge key={index} className="bg-red-100 text-red-800 border-red-200">
                      {risk}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}