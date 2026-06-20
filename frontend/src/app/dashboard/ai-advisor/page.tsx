'use client';

import { motion } from 'framer-motion';
import { Brain, TrendingDown, Lightbulb, Sparkles, AlertCircle } from 'lucide-react';

const insights = [
  {
    type: 'reduction',
    title: 'Transportation Optimization',
    description: 'Based on your recent travel logs, switching to public transport 3 days per week could reduce your transportation emissions by 18% this month.',
    impact: '~23 kg CO₂ saved/month',
    priority: 'high',
  },
  {
    type: 'habit',
    title: 'Weekend Emission Pattern',
    description: 'You produce 40% more emissions during weekends, primarily from vehicle usage. Consider planning group outings or using ride-sharing services.',
    impact: '~15 kg CO₂ saved/month',
    priority: 'medium',
  },
  {
    type: 'food',
    title: 'Dietary Adjustment',
    description: 'Replacing two meat-based meals per week with plant-based alternatives could significantly reduce your food-related carbon footprint.',
    impact: '~28 kg CO₂ saved/month',
    priority: 'high',
  },
  {
    type: 'energy',
    title: 'Energy Efficiency',
    description: 'Your electricity consumption is 12% above the community average. Switching to LED lighting and unplugging idle devices can help.',
    impact: '~10 kg CO₂ saved/month',
    priority: 'low',
  },
];

const priorityConfig = {
  high: { color: 'border-red-500/30 bg-red-500/5', badge: 'bg-red-500/10 text-red-500' },
  medium: { color: 'border-yellow-500/30 bg-yellow-500/5', badge: 'bg-yellow-500/10 text-yellow-500' },
  low: { color: 'border-emerald-500/30 bg-emerald-500/5', badge: 'bg-emerald-500/10 text-emerald-500' },
};

export default function AiAdvisorPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
          <Brain className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Carbon Advisor</h1>
          <p className="text-muted-foreground text-sm">
            Personalized sustainability recommendations based on your data
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="glass-card p-6 gradient-bg text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
          <h2 className="font-semibold">AI Analysis Summary</h2>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">
          Based on 3 months of data, your total potential emission reduction is approximately
          <strong className="text-white"> 76 kg CO₂/month</strong>. Implementing the top 2
          recommendations alone would reduce your footprint by 32%.
        </p>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {insights.map((insight, idx) => {
          const config = priorityConfig[insight.priority as keyof typeof priorityConfig];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card p-5 border-l-4 ${config.color}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                  <h3 className="font-semibold">{insight.title}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
                  {insight.priority} priority
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {insight.description}
              </p>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <span className="text-sm font-medium text-emerald-500">{insight.impact}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
