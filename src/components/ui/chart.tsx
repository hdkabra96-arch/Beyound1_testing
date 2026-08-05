import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  TooltipProps,
} from 'recharts';
import { useTheme } from '../../design-system/theme-context';

export interface ProgressDataPoint {
  month: string;
  score: number;
  worksheets: number;
}

export const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 rounded-2xl shadow-xl border border-indigo-500/20 text-xs space-y-1">
        <p className="font-bold text-slate-900 dark:text-slate-100">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full bg-current" />
            <span className="font-medium capitalize">{entry.name}:</span>
            <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const MathProgressChart: React.FC<{ data: ProgressDataPoint[]; height?: number }> = ({
  data,
  height = 300,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="worksheetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#334155' : '#e2e8f0'}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={12}
            tickLine={false}
          />
          <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            name="Math Accuracy %"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#scoreGradient)"
          />
          <Area
            type="monotone"
            dataKey="worksheets"
            name="Completed Solved Sets"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#worksheetGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export interface GradeDistributionPoint {
  grade: string;
  students: number;
}

export const GradeDistributionBarChart: React.FC<{
  data: GradeDistributionPoint[];
  height?: number;
}> = ({ data, height = 300 }) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#334155' : '#e2e8f0'}
            vertical={false}
          />
          <XAxis
            dataKey="grade"
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={12}
            tickLine={false}
          />
          <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="students"
            name="Active Students"
            fill="#4f46e5"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export interface PieDataPoint {
  name: string;
  value: number;
  color: string;
}

export const SubscriptionDonutChart: React.FC<{ data: PieDataPoint[]; height?: number }> = ({
  data,
  height = 280,
}) => {
  return (
    <div style={{ width: '100%', height }} className="flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
