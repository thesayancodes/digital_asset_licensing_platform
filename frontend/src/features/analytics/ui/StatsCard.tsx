'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  trend: number;
  icon: React.ReactNode;
  prefix?: string;
}

export function StatsCard({ label, value, trend, icon, prefix = '' }: StatsCardProps) {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-sm
      hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 
          flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{isPositive ? '+' : ''}{trend}%</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-white">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-white/40 text-sm mt-1">{label}</p>
    </div>
  );
}
