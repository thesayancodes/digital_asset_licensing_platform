'use client';

// ============================================
// Dashboard Page (Matches screenshot style)
// ============================================

import { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { 
  Package, 
  FileCheck, 
  DollarSign, 
  Clock, 
  Plus, 
  RefreshCw, 
  Palette, 
  Music, 
  Camera, 
  Film,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RevenueChart } from '@/features/analytics/ui/RevenueChart';
import { LicenseChart } from '@/features/analytics/ui/LicenseChart';

const recentAssets = [
  { id: 1, name: 'Abstract Series #01', subtext: 'QmXF9...8kLp • 2.4 MB', type: 'Digital Art', typeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Palette, iconColor: 'text-pink-400 bg-pink-500/10', licenses: 14, revenue: '840 XLM', status: 'Active', statusColor: 'bg-emerald-500/10 text-emerald-400' },
  { id: 2, name: 'Midnight Lofi Track', subtext: 'QmRt2...3mNk • 8.1 MB', type: 'Audio', typeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', icon: Music, iconColor: 'text-emerald-400 bg-emerald-500/10', licenses: 8, revenue: '320 XLM', status: 'Active', statusColor: 'bg-emerald-500/10 text-emerald-400' },
  { id: 3, name: 'City Nights Photography', subtext: 'QmV7...1pQs • 12.8 MB', type: 'Photo', typeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', icon: Camera, iconColor: 'text-purple-400 bg-purple-500/10', licenses: 21, revenue: '2,100 XLM', status: 'Active', statusColor: 'bg-emerald-500/10 text-emerald-400' },
  { id: 4, name: 'Brand Motion Pack', subtext: 'QmBn5...9xYp • 45.2 MB', type: 'Video', typeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20', icon: Film, iconColor: 'text-amber-400 bg-amber-500/10', licenses: 4, revenue: '1,160 XLM', status: 'Pending ↻', statusColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/25' },
];

const liveActivity = [
  { id: 1, type: 'purchase', title: 'License Purchased', desc: 'Abstract #01 • Personal', subtext: '+50 XLM • 2s ago', bulletColor: 'bg-emerald-400' },
  { id: 2, type: 'register', title: 'Asset Registered', desc: 'Brand Motion Pack', subtext: '0x7f3a...b2e1 • 28s ago', bulletColor: 'bg-blue-400' },
  { id: 3, type: 'royalty', title: 'Royalty Distributed', desc: 'City Nights Photo • Commercial', subtext: '+100 XLM • 1m ago', bulletColor: 'bg-purple-400' },
  { id: 4, type: 'revoke', title: 'License Revoked', desc: 'Midnight Lofi • Editorial', subtext: 'Admin action • 3m ago', bulletColor: 'bg-amber-400' },
];

export default function DashboardPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessRoyalties = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Assets */}
          <div className="bg-[#090d23] border border-[#141b3a] rounded-xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-white/40 tracking-wider uppercase">
                Total Assets
              </span>
              <p className="text-3xl font-black text-white leading-none">12</p>
              <span className="inline-block text-[10px] font-bold text-emerald-400 mt-1">
                +3 ↑ <span className="text-white/30 font-semibold ml-0.5">this month</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Package className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Active Licenses */}
          <div className="bg-[#090d23] border border-[#141b3a] rounded-xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-white/40 tracking-wider uppercase">
                Active Licenses
              </span>
              <p className="text-3xl font-black text-white leading-none">47</p>
              <span className="inline-block text-[10px] font-bold text-emerald-400 mt-1">
                +12 ↑ <span className="text-white/30 font-semibold ml-0.5">this month</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Total Revenue */}
          <div className="bg-[#090d23] border border-[#141b3a] rounded-xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-white/40 tracking-wider uppercase">
                Total Revenue
              </span>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-black text-white leading-none">8,420</p>
                <span className="text-[10px] font-bold text-blue-400">XLM</span>
              </div>
              <p className="text-[10px] font-bold text-white/30">≈ $994.76 USD</p>
              <span className="inline-block text-[10px] font-bold text-emerald-400 mt-1">
                +34.2% ↑
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Pending Royalties */}
          <div className="bg-[#090d23] border border-[#141b3a] rounded-xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-white/40 tracking-wider uppercase">
                Pending Royalties
              </span>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-black text-white leading-none">342</p>
                <span className="text-[10px] font-bold text-blue-400">XLM</span>
              </div>
              <p className="text-[10px] font-bold text-white/30">≈ $40.41 USD • 3 pending</p>
              <button
                onClick={handleProcessRoyalties}
                disabled={isProcessing}
                className="mt-1.5 flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded text-[9px] hover:bg-amber-500/20 transition-all"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-2.5 h-2.5" />
                    Process Royalties
                  </>
                )}
              </button>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div className="lg:col-span-1">
            <LicenseChart />
          </div>
        </div>

        {/* Table & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Assets Table */}
          <div className="lg:col-span-2 bg-[#090d23] border border-[#141b3a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-sm font-bold tracking-wide">Recent Assets</h3>
              <Link
                href="/assets"
                prefetch={true}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition-all"
              >
                <Plus className="w-3 h-3" />
                Register Asset
              </Link>
            </div>

            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#141b3a] text-white/30 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Asset</th>
                    <th className="pb-3 hidden md:table-cell">Type</th>
                    <th className="pb-3 hidden sm:table-cell text-center">Licenses</th>
                    <th className="pb-3 text-right">Revenue</th>
                    <th className="pb-3 hidden sm:table-cell text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141b3a]/30 font-bold">
                  {recentAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-white/[0.01] transition-all">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", asset.iconColor)}>
                            <asset.icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-bold text-xs truncate">{asset.name}</p>
                            <p className="text-white/30 text-[10px] font-mono mt-0.5 truncate">{asset.subtext}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 hidden md:table-cell">
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold border", asset.typeColor)}>
                          {asset.type}
                        </span>
                      </td>
                      <td className="py-3 hidden sm:table-cell text-center text-white/80">{asset.licenses}</td>
                      <td className="py-3 text-right text-white/90">{asset.revenue}</td>
                      <td className="py-3 hidden sm:table-cell text-center">
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", asset.statusColor)}>
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="bg-[#090d23] border border-[#141b3a] rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white text-sm font-bold tracking-wide">Live Activity</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-bold">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live</span>
                </div>
              </div>

              <div className="space-y-4">
                {liveActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", activity.bulletColor)} />
                    <div className="space-y-0.5">
                      <p className="text-white font-bold text-xs leading-none">{activity.title}</p>
                      <p className="text-white/60 text-[11px] font-semibold">{activity.desc}</p>
                      <p className="text-white/30 text-[9px] font-bold">{activity.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </AppShell>
  );
}
