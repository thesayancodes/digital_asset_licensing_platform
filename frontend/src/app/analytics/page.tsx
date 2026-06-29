'use client';

import { AppShell } from '@/components/layout/AppShell';
import { StatsCard } from '@/features/analytics/ui/StatsCard';
import { RevenueChart } from '@/features/analytics/ui/RevenueChart';
import { LicenseChart } from '@/features/analytics/ui/LicenseChart';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { Package, FileCheck, DollarSign, Users, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const { revenueData, licenseData, topAssets, stats } = useAnalytics();

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-white/40 text-sm mt-1">Platform performance and insights</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Revenue" value={`$${(stats.totalRevenue).toLocaleString()}`} trend={stats.revenueTrend} icon={<DollarSign className="w-5 h-5" />} />
          <StatsCard label="Active Licenses" value={stats.totalLicenses} trend={stats.licensesTrend} icon={<FileCheck className="w-5 h-5" />} />
          <StatsCard label="Total Assets" value={stats.totalAssets} trend={stats.assetsTrend} icon={<Package className="w-5 h-5" />} />
          <StatsCard label="Active Creators" value={stats.activeCreators} trend={stats.creatorsTrend} icon={<Users className="w-5 h-5" />} />
        </div>

        {/* Revenue Chart */}
        <RevenueChart />

        {/* Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* License Distribution */}
          <LicenseChart />

          {/* Top Assets */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-semibold mb-6">Top Assets by Revenue</h3>
            <div className="space-y-4">
              {topAssets.map((asset, i) => (
                <div key={asset.id} className="flex items-center gap-4">
                  <span className="text-white/20 text-sm font-mono w-6">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm font-medium truncate">{asset.name}</p>
                    <p className="text-white/30 text-xs">{asset.licenses} licenses</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium text-sm">${asset.revenue.toLocaleString()}</p>
                    <div className="w-20 h-1.5 rounded-full bg-white/[0.06] mt-1.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                        style={{ width: `${(asset.revenue / topAssets[0].revenue) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
