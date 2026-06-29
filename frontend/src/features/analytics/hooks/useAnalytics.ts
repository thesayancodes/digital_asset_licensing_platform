'use client';

import { useMemo } from 'react';
import * as AnalyticsService from '../services/analytics.service';

export function useAnalytics() {
  const revenueData = useMemo(() => AnalyticsService.getRevenueOverTime(), []);
  const licenseData = useMemo(() => AnalyticsService.getLicensesByType(), []);
  const topAssets = useMemo(() => AnalyticsService.getTopAssets(), []);
  const stats = useMemo(() => AnalyticsService.getPlatformStats(), []);

  return { revenueData, licenseData, topAssets, stats };
}
