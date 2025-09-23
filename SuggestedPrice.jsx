import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function SuggestedPrice({ price }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="h-full bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 border-emerald-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            Preço sugerido
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center h-32">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2"
            >
              R$ {price?.toFixed(2)}
            </motion.div>
            <div className="flex items-center justify-center gap-1 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Baseado na análise de mercado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}