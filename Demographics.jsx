import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Demographics({ avgIncome }) {
  const demographicData = [
    { category: 'Baixa', value: avgIncome * 0.6 },
    { category: 'Média', value: avgIncome },
    { category: 'Alta', value: avgIncome * 1.8 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="h-full bg-white/60 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            Demografia e mercado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demographicData}>
                <XAxis 
                  dataKey="category" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-slate-600 mb-1">Renda média</p>
            <p className="text-2xl font-bold text-blue-600">
              R$ {avgIncome?.toLocaleString('pt-BR')}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}