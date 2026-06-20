import { Car, Zap, UtensilsCrossed, ShoppingBag } from 'lucide-react';

export const mockMonthlyTrend = [
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

export const mockCategoryData = [
  { name: 'Travel', value: 35, color: '#10b981' },
  { name: 'Electricity', value: 25, color: '#3b82f6' },
  { name: 'Food', value: 20, color: '#f59e0b' },
  { name: 'Shopping', value: 12, color: '#8b5cf6' },
  { name: 'Waste', value: 8, color: '#ef4444' },
];

export const mockRecentActivities = [
  { action: 'Logged transportation entry', time: '2 hours ago', icon: Car, amount: 12.5 },
  { action: 'Electricity usage recorded', time: '5 hours ago', icon: Zap, amount: 8.2 },
  { action: 'Meal log updated', time: '1 day ago', icon: UtensilsCrossed, amount: 4.1 },
  { action: 'Shopping emissions added', time: '2 days ago', icon: ShoppingBag, amount: 15.3 },
];

export const mockAiInsights = [
  'Your weekend travel emissions are 40% higher than weekdays. Consider carpooling.',
  'Switching to LED bulbs could reduce electricity emissions by 12% monthly.',
  'Your food carbon footprint decreased 8% this month — great progress!',
];
