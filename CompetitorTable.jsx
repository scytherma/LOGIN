import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function CompetitorTable({ competitors }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getPriceBadge = (price) => {
    if (price < 50) return { label: "Baixo", color: "bg-green-100 text-green-800" };
    if (price < 150) return { label: "Médio", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Alto", color: "bg-red-100 text-red-800" };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="h-full bg-white/60 backdrop-blur-sm border-blue-100 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            Concorrência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">Produto</TableHead>
                  <TableHead className="font-semibold text-slate-700">Preço</TableHead>
                  <TableHead className="font-semibold text-slate-700">Avaliação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitors?.map((competitor, index) => {
                  const priceBadge = getPriceBadge(competitor.price);
                  return (
                    <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-800">
                        {competitor.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-900">
                            R$ {competitor.price?.toFixed(2)}
                          </span>
                          <Badge className={`${priceBadge.color} text-xs w-fit`}>
                            {priceBadge.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {renderStars(Math.round(competitor.rating))}
                          <span className="ml-2 text-sm text-slate-600">
                            {competitor.rating?.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}