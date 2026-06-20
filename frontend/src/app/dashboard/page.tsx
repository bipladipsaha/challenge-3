'use client';

import { motion } from 'framer-motion';
import {
  TrendingDown,
  TrendingUp,
  Leaf,
  Zap,
  Car,
  UtensilsCrossed,
  ShoppingBag,
  Droplets,
  Trash2,
  ArrowUpRight,
  Brain,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const EmissionTrend = dynamic(() => import('@/components/dashboard/EmissionTrend'), {
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading chart...</div>,
});

const CategoryBreakdown = dynamic(() => import('@/components/dashboard/CategoryBreakdown'), {
  ssr: false,
  loading: () => <div className="h-[200px] flex items-center justify-center text-muted-foreground">Loading chart...</div>,
});

// Mock data for demonstration
const monthlyTrend = [
  { month: 'Jan', emissions: 245 },
  { month: 'Feb', emissions: 231 },
  { month: 'Mar', emissions: 218 },
  { month: 'Apr', emissions: 205 },
  { month: 'May', emissions: 198 },
  { month: 'Jun', emissions: 186 },
  { month: 'Jul', emissions: 174 },
  { month: 'Aug', emissions: 168 },
  { month: 'Sep', emissions: 155 },
  { month: 'Oct', emissions: 148 },
  { month: 'Nov', emissions: 142 },
  { month: 'Dec', emissions: 135 },
];

const categoryData = [
  { name: 'Travel', value: 35, color: '#10b981' },
  { name: 'Electricity', value: 25, color: '#3b82f6' },
  { name: 'Food', value: 20, color: '#f59e0b' },
  { name: 'Shopping', value: 12, color: '#8b5cf6' },
  { name: 'Waste', value: 8, color: '#ef4444' },
];

const recentActivities = [
  { action: 'Logged transportation entry', time: '2 hours ago', icon: Car, amount: 12.5 },
  { action: 'Electricity usage recorded', time: '5 hours ago', icon: Zap, amount: 8.2 },
  { action: 'Meal log updated', time: '1 day ago', icon: UtensilsCrossed, amount: 4.1 },
  { action: 'Shopping emissions added', time: '2 days ago', icon: ShoppingBag, amount: 15.3 },
];

const aiInsights = [
  'Your weekend travel emissions are 40% higher than weekdays. Consider carpooling.',
  'Switching to LED bulbs could reduce electricity emissions by 12% monthly.',
  'Your food carbon footprint decreased 8% this month — great progress!',
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function DashboardPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-6"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Emissions"
          value="2,145 kg"
          change="-12.5%"
          trending="down"
          icon={<Leaf className="h-5 w-5" />}
        />
        <StatCard
          title="Monthly Average"
          value="178 kg"
          change="-8.3%"
          trending="down"
          icon={<TrendingDown className="h-5 w-5" />}
        />
        <StatCard
          title="Eco Score"
          value="78/100"
          change="+5 pts"
          trending="up"
          icon={<Zap className="h-5 w-5" />}
        />
        <StatCard
          title="Goals Completed"
          value="12/15"
          change="80%"
          trending="up"
          icon={<ArrowUpRight className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emission Trend */}
        <motion.div variants={fadeInUp} className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Emission Trend</h3>
          <EmissionTrend monthlyTrend={monthlyTrend} />
        </motion.div>

        {/* Category Breakdown */}
        <motion.div variants={fadeInUp} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">By Category</h3>
          <CategoryBreakdown categoryData={categoryData} />
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div variants={fadeInUp} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <activity.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  {activity.amount} kg
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={fadeInUp} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-emerald-500" aria-hidden="true" />
            <h3 className="text-lg font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-sm text-muted-foreground leading-relaxed"
              >
                {insight}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({
  title,
  value,
  change,
  trending,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  trending: 'up' | 'down';
  icon: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeInUp} className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted-foreground text-sm">{title}</span>
        <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center text-white">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        {trending === 'down' ? (
          <TrendingDown className="h-4 w-4 text-emerald-500" aria-hidden="true" />
        ) : (
          <TrendingUp className="h-4 w-4 text-emerald-500" aria-hidden="true" />
        )}
        <span className="text-xs font-medium text-emerald-500">{change}</span>
        <span className="text-xs text-muted-foreground ml-1">vs last month</span>
      </div>
    </motion.div>
  );
}
