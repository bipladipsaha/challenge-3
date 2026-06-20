'use client';

import { motion } from 'framer-motion';
import { BarChart3, Plus, Filter, Car, Zap, UtensilsCrossed, ShoppingBag, Trash2, Droplets } from 'lucide-react';

const entries = [
  { id: '1', category: 'TRAVEL', amount: 12.5, description: 'Commute to office', date: '2024-01-15', icon: Car },
  { id: '2', category: 'ELECTRICITY', amount: 8.2, description: 'Home electricity usage', date: '2024-01-15', icon: Zap },
  { id: '3', category: 'FOOD', amount: 4.1, description: 'Lunch — chicken meal', date: '2024-01-14', icon: UtensilsCrossed },
  { id: '4', category: 'SHOPPING', amount: 15.3, description: 'New jacket purchase', date: '2024-01-13', icon: ShoppingBag },
  { id: '5', category: 'WASTE', amount: 3.2, description: 'Weekly garbage', date: '2024-01-12', icon: Trash2 },
  { id: '6', category: 'WATER', amount: 0.8, description: 'Daily water usage', date: '2024-01-12', icon: Droplets },
  { id: '7', category: 'TRAVEL', amount: 25.0, description: 'Weekend trip', date: '2024-01-11', icon: Car },
  { id: '8', category: 'ELECTRICITY', amount: 9.5, description: 'Air conditioning', date: '2024-01-10', icon: Zap },
];

const categoryColors: Record<string, string> = {
  TRAVEL: 'bg-blue-500/10 text-blue-500',
  ELECTRICITY: 'bg-yellow-500/10 text-yellow-500',
  FOOD: 'bg-orange-500/10 text-orange-500',
  SHOPPING: 'bg-purple-500/10 text-purple-500',
  WATER: 'bg-cyan-500/10 text-cyan-500',
  WASTE: 'bg-red-500/10 text-red-500',
};

export default function EntriesPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-500" aria-hidden="true" />
            Carbon Log
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Your emission entries history</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
            <Filter className="h-4 w-4" aria-hidden="true" /> Filter
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" aria-hidden="true" /> New Entry
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Category</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Description</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${categoryColors[entry.category]}`}>
                        <entry.icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-medium">{entry.category}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{entry.description}</td>
                  <td className="px-5 py-3 text-sm font-semibold">{entry.amount} kg CO₂</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
