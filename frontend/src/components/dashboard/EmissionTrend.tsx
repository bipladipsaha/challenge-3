'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function EmissionTrend({ monthlyTrend }: { monthlyTrend: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={monthlyTrend}>
        <defs>
          <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Area
          type="monotone"
          dataKey="emissions"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#colorEmissions)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
