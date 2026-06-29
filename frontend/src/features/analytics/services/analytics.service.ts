'use client';

// Analytics service with realistic mock data
// In production, this would query an indexer service or aggregate on-chain data

export interface TimeSeriesPoint { date: string; value: number }
export interface PieDataPoint { name: string; value: number; color: string }
export interface TopAssetData { id: number; name: string; revenue: number; licenses: number }
export interface PlatformStats {
  totalAssets: number; totalLicenses: number; totalRevenue: number; activeCreators: number;
  assetsTrend: number; licensesTrend: number; revenueTrend: number; creatorsTrend: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getRevenueOverTime(): TimeSeriesPoint[] {
  return MONTHS.map((m, i) => ({
    date: m,
    value: Math.round(2000 + Math.random() * 8000 + i * 1200),
  }));
}

export function getLicensesByType(): PieDataPoint[] {
  return [
    { name: 'Personal', value: 145, color: '#0ea5e9' },
    { name: 'Commercial', value: 98, color: '#10b981' },
    { name: 'Editorial', value: 67, color: '#f59e0b' },
    { name: 'Enterprise', value: 34, color: '#8b5cf6' },
    { name: 'Exclusive', value: 12, color: '#f43f5e' },
  ];
}

export function getTopAssets(): TopAssetData[] {
  return [
    { id: 1, name: 'Neon Cityscape Collection', revenue: 12450, licenses: 34 },
    { id: 2, name: 'Abstract Wave Series', revenue: 9800, licenses: 28 },
    { id: 3, name: 'Digital Portraits V2', revenue: 8200, licenses: 22 },
    { id: 4, name: 'Ambient Soundscapes', revenue: 6100, licenses: 19 },
    { id: 5, name: 'Code Library: ML Utils', revenue: 4500, licenses: 15 },
  ];
}

export function getPlatformStats(): PlatformStats {
  return {
    totalAssets: 1247, totalLicenses: 356, totalRevenue: 89420, activeCreators: 234,
    assetsTrend: 12.5, licensesTrend: 8.3, revenueTrend: 23.1, creatorsTrend: 5.7,
  };
}
