import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function BrazilMap({ data }) {
  const [selectedState, setSelectedState] = useState(null);

  const getLevelColor = (level) => {
    const colors = {
      'excelente': '#1e40af',
      'bom': '#3b82f6', 
      'medio': '#fbbf24',
      'pouco': '#ef4444'
    };
    return colors[level] || '#9ca3af';
  };

  const getLevelLabel = (level) => {
    const labels = {
      'excelente': 'Excelente',
      'bom': 'Bom',
      'medio': 'Médio', 
      'pouco': 'Pouco'
    };
    return labels[level] || 'Indefinido';
  };

  const states = [
    { name: 'SP', x: 48, y: 65, fullName: 'São Paulo' },
    { name: 'RJ', x: 56, y: 70, fullName: 'Rio de Janeiro' },
    { name: 'MG', x: 48, y: 60, fullName: 'Minas Gerais' },
    { name: 'RS', x: 40, y: 85, fullName: 'Rio Grande do Sul' },
    { name: 'PR', x: 42, y: 75, fullName: 'Paraná' },
    { name: 'SC', x: 44, y: 80, fullName: 'Santa Catarina' },
    { name: 'BA', x: 45, y: 45, fullName: 'Bahia' },
    { name: 'PE', x: 52, y: 30, fullName: 'Pernambuco' },
    { name: 'CE', x: 50, y: 20, fullName: 'Ceará' },
    { name: 'GO', x: 42, y: 55, fullName: 'Goiás' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Card className="h-full bg-white/60 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            Regiões de interesse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <svg viewBox="0 0 100 100" className="w-full h-64 mb-4">
              {/* Brazil outline simplified */}
              <path
                d="M15,30 Q20,15 35,20 L60,18 Q75,25 80,40 L78,60 Q75,75 65,80 L50,85 Q35,90 25,80 L20,65 Q15,50 15,30 Z"
                fill="#f1f5f9"
                stroke="#cbd5e1"
                strokeWidth="0.5"
              />
              
              {/* States */}
              {states.map((state) => {
                const stateData = data?.[state.name];
                const level = stateData?.level || 'medio';
                const value = stateData?.value || 0;
                
                return (
                  <g key={state.name}>
                    <circle
                      cx={state.x}
                      cy={state.y}
                      r="4"
                      fill={getLevelColor(level)}
                      stroke="white"
                      strokeWidth="1"
                      className="cursor-pointer transition-all duration-200 hover:r-5"
                      onMouseEnter={() => setSelectedState({...state, level, value})}
                      onMouseLeave={() => setSelectedState(null)}
                    />
                    <text
                      x={state.x}
                      y={state.y + 1}
                      textAnchor="middle"
                      className="text-xs font-bold fill-white pointer-events-none"
                    >
                      {state.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {['pouco', 'medio', 'bom', 'excelente'].map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getLevelColor(level) }}
                  />
                  <span className="text-sm text-slate-600">{getLevelLabel(level)}</span>
                </div>
              ))}
            </div>

            {/* State info popup */}
            {selectedState && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xl"
              >
                <h4 className="font-semibold text-slate-800 mb-1">{selectedState.fullName}</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Interesse: <span className="font-medium">{selectedState.value}%</span>
                </p>
                <p className="text-sm">
                  <span 
                    className="px-2 py-1 rounded-full text-white text-xs font-medium"
                    style={{ backgroundColor: getLevelColor(selectedState.level) }}
                  >
                    {getLevelLabel(selectedState.level)}
                  </span>
                </p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}