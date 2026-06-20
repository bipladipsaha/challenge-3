'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Zap,
  UtensilsCrossed,
  ShoppingBag,
  Droplets,
  Trash2,
  Calculator,
  Save,
} from 'lucide-react';

const categories = [
  {
    id: 'TRAVEL',
    label: 'Transportation',
    icon: Car,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    unit: 'km',
    factor: 0.21,
    description: 'Distance traveled by car, bus, train, or flight',
  },
  {
    id: 'ELECTRICITY',
    label: 'Electricity',
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    unit: 'kWh',
    factor: 0.45,
    description: 'Electricity consumption at home or office',
  },
  {
    id: 'FOOD',
    label: 'Food',
    icon: UtensilsCrossed,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    unit: 'meals',
    factor: 3.3,
    description: 'Meals consumed (higher for meat-based meals)',
  },
  {
    id: 'SHOPPING',
    label: 'Shopping',
    icon: ShoppingBag,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    unit: 'items',
    factor: 5.0,
    description: 'Clothing, electronics, and general purchases',
  },
  {
    id: 'WATER',
    label: 'Water',
    icon: Droplets,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    unit: 'liters',
    factor: 0.003,
    description: 'Water usage including heating',
  },
  {
    id: 'WASTE',
    label: 'Waste',
    icon: Trash2,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    unit: 'kg',
    factor: 2.5,
    description: 'Non-recycled waste produced',
  },
];

export default function CalculatorPage() {
  const [values, setValues] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const calculateTotal = () => {
    return categories.reduce((total, cat) => {
      const amount = values[cat.id] || 0;
      return total + amount * cat.factor;
    }, 0);
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const total = calculateTotal();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6 text-emerald-500" aria-hidden="true" />
          Carbon Calculator
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Enter your consumption data to calculate your carbon footprint
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg ${cat.bgColor} flex items-center justify-center`}>
                <cat.icon className={`h-5 w-5 ${cat.color}`} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{cat.label}</h3>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.1"
                value={values[cat.id] || ''}
                onChange={(e) => handleChange(cat.id, e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-input border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                placeholder="0"
                aria-label={`${cat.label} in ${cat.unit}`}
              />
              <span className="text-sm text-muted-foreground min-w-[40px]">{cat.unit}</span>
            </div>
            {values[cat.id] > 0 && (
              <p className="text-xs text-emerald-500 mt-2">
                ≈ {(values[cat.id] * cat.factor).toFixed(1)} kg CO₂
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-6 text-center"
      >
        <h3 className="text-lg font-semibold mb-2">Estimated Carbon Footprint</h3>
        <p className="text-4xl font-extrabold gradient-text">{total.toFixed(1)} kg CO₂</p>
        <p className="text-sm text-muted-foreground mt-2">
          {total < 50
            ? '🌱 Excellent! Your footprint is very low.'
            : total < 150
              ? '👍 Good job! You are below average.'
              : total < 300
                ? '⚠️ Average. There is room for improvement.'
                : '🔴 High footprint. Consider reducing emissions.'}
        </p>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handleCalculate}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-bg text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Calculate
          </button>
          <button
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Save Entry
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
