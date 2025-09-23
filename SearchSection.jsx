import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchSection({ searchTerm, setSearchTerm, onSearch, isLoading }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto mb-12"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl blur-xl opacity-30" />
        <div className="relative bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 shadow-xl">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite o nome do produto (ex: tênis esportivo, smartphone)"
                className="pl-12 h-14 text-lg border-0 bg-slate-50/50 rounded-xl focus:bg-white transition-all duration-200"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={onSearch}
              disabled={isLoading || !searchTerm.trim()}
              className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Pesquisar"
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}