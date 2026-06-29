'use client';

// ============================================
// RevenueChart (Matches screenshot style)
// ============================================

import { useState } from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const chartData7D = [
  { date: 'Mon', revenue: 120, licenses: 2 },
  { date: 'Tue', revenue: 220, licenses: 4 },
  { date: 'Wed', revenue: 180, licenses: 3 },
  { date: 'Thu', revenue: 420, licenses: 6 },
  { date: 'Fri', revenue: 310, licenses: 5 },
  { date: 'Sat', revenue: 600, licenses: 8 },
  { date: 'Sun', revenue: 840, licenses: 14 },
];

const chartData30D = [
  { date: 'Wk 1', revenue: 400, licenses: 8 },
  { date: 'Wk 2', revenue: 900, licenses: 15 },
  { date: 'Wk 3', revenue: 1500, licenses: 28 },
  { date: 'Wk 4', revenue: 2100, licenses: 34 },
];

const chartData90D = [
  { date: 'Jan', revenue: 200, licenses: 5 },
  { date: 'Feb', revenue: 600, licenses: 12 },
  { date: 'Mar', revenue: 800, licenses: 18 },
  { date: 'Apr', revenue: 1200, licenses: 25 },
  { date: 'May', revenue: 1500, licenses: 32 },
  { date: 'Jun', revenue: 1400, licenses: 38 },
  { date: 'Jul', revenue: 1800, licenses: 42 },
  { date: 'Aug', revenue: 1700, licenses: 45 },
  { date: 'Sep', revenue: 1842, licenses: 47 },
];

export function RevenueChart() {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('90D');

  const data = timeframe === '7D' ? chartData7D : timeframe === '30D' ? chartData30D : chartData90D;

  return (
    <div className="bg-[#090d23] border border-[#141b3a] rounded-xl p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white text-sm font-bold tracking-wide">Revenue Overview</h3>
          <p className="text-white/30 text-[10px] font-bold tracking-wide mt-0.5">Monthly licensing revenue in XLM</p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex bg-[#050818] border border-[#141b3a] rounded-lg p-0.5 text-[10px] font-bold">
          {(['7D', '30D', '90D'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-md transition-all ${
                timeframe === t
                  ? 'bg-blue-600 text-white'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(20, 27, 58, 0.4)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.2)"
              fontSize={10}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              fontSize={10}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d23',
                border: '1px solid #141b3a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
              }}
              formatter={(value: any, name: string) => [
                name === 'revenue' ? `${Number(value).toLocaleString()} XLM` : `${value} licenses`,
                name === 'revenue' ? 'Revenue' : 'Licenses'
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider ml-1 mr-4">
                  {value === 'revenue' ? 'Revenue' : 'Licenses'}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              name="revenue"
            />
            <Line
              type="monotone"
              dataKey="licenses"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="licenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
