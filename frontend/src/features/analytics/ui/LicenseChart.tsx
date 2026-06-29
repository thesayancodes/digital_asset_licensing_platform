'use client';

// ============================================
// LicenseChart (Matches screenshot style)
// ============================================

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Commercial', value: 18, color: '#2563eb', percent: '38%' },
  { name: 'Personal', value: 17, color: '#10b981', percent: '36%' },
  { name: 'Enterprise', value: 8, color: '#8b5cf6', percent: '17%' },
  { name: 'Editorial', value: 4, color: '#f59e0b', percent: '9%' },
];

export function LicenseChart() {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-[#090d23] border border-[#141b3a] rounded-xl p-6 relative">
      <h3 className="text-white text-sm font-bold tracking-wide mb-6">License Distribution</h3>
      
      <div className="h-[200px] relative mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d23',
                border: '1px solid #141b3a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
          style={{ marginTop: '-4px' }}>
          <p className="text-2xl font-black text-white leading-none">{total}</p>
          <p className="text-white/40 text-[9px] font-bold tracking-wider uppercase mt-1">licenses</p>
        </div>
      </div>

      {/* Legend list matching layout */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-[10px] font-bold">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-white/60">{item.name}</span>
            </div>
            <span className="text-white/40 ml-2">{item.percent}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
