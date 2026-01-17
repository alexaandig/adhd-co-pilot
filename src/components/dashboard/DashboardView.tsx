'use client';

import { useDashboard } from './DashboardProvider';
import { Onboarding } from './Onboarding';
import { DashboardLayout } from './DashboardLayout';
import { FullScreenConfetti } from './FullScreenConfetti';
import { CompletionDialog } from './CompletionDialog';
import { PomodoroDialog } from './PomodoroDialog';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BreakDialog } from './BreakDialog';

export function DashboardView() {
  const { onboardingComplete } = useDashboard();

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <TooltipProvider>
        <FullScreenConfetti />
        {onboardingComplete ? <DashboardLayout /> : <Onboarding />}
        <CompletionDialog />
        <PomodoroDialog />
        <BreakDialog />
      </TooltipProvider>
    </main>
  );
}
