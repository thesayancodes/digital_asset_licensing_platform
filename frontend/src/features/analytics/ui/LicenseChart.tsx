'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { PieDataPoint } from '../services/analytics.service';

interface LicenseChartProps {
  data: PieDataPoint[];
}

export function LicenseChart({ data }: LicenseChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-white font-semibold mb-6">Licenses by Type</h3>
      <div className="h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => <span className="text-white/60 text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
          style={{ marginTop: '-15px' }}>
          <p className="text-2xl font-bold text-white">{total}</p>
          <p className="text-white/40 text-xs">Total</p>
        </div>
      </div>
    </div>
  );
}
