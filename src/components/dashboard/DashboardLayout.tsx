'use client';

import { useDashboard } from './DashboardProvider';
import { DashboardHeader } from './DashboardHeader';
import { TaskInputForm } from './TaskInputForm';
import { ScheduleDisplay } from './ScheduleDisplay';
import { WeeklyWins } from './WeeklyWins';

export function DashboardLayout() {
  const { onboardingData } = useDashboard();

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <WeeklyWins />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <TaskInputForm />
        </div>
        <div>
          <ScheduleDisplay />
        </div>
      </div>
    </div>
  );
}
