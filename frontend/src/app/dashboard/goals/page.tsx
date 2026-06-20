'use client';

import { motion } from 'framer-motion';
import { Target, Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const goals = [
  {
    id: '1',
    title: 'Reduce transportation emissions by 20%',
    targetAmount: 50,
    currentAmount: 35,
    deadline: '2024-03-31',
    status: 'IN_PROGRESS' as const,
  },
  {
    id: '2',
    title: 'Switch to 100% renewable electricity',
    targetAmount: 100,
    currentAmount: 100,
    deadline: '2024-02-28',
    status: 'COMPLETED' as const,
  },
  {
    id: '3',
    title: 'Reduce food waste by 50%',
    targetAmount: 30,
    currentAmount: 18,
    deadline: '2024-04-15',
    status: 'IN_PROGRESS' as const,
  },
  {
    id: '4',
    title: 'Zero plastic shopping bags for a month',
    targetAmount: 30,
    currentAmount: 5,
    deadline: '2024-02-10',
    status: 'FAILED' as const,
  },
];

const statusConfig = {
  IN_PROGRESS: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'In Progress' },
  COMPLETED: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Completed' },
  FAILED: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Failed' },
};

export default function GoalsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-emerald-500" aria-hidden="true" />
            Sustainability Goals
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Set targets and track your progress towards a greener lifestyle
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const config = statusConfig[goal.status];
          const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-sm pr-4">{goal.title}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                  <config.icon className="h-3 w-3" aria-hidden="true" />
                  {config.label}
                </span>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      goal.status === 'COMPLETED'
                        ? 'bg-emerald-500'
                        : goal.status === 'FAILED'
                          ? 'bg-red-500'
                          : 'gradient-bg'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {goal.currentAmount} / {goal.targetAmount} kg CO₂ reduced
                </span>
                <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
