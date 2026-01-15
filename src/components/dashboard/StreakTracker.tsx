'use client';

import { Flame } from 'lucide-react';
import { useDashboard } from './DashboardProvider';
import { cn } from '@/lib/utils';

export function StreakTracker() {
  const { streak } = useDashboard();

  if (streak === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 text-orange-500 font-bold">
      <Flame className="h-6 w-6" />
      <span className="text-lg">{streak}</span>
    </div>
  );
}
