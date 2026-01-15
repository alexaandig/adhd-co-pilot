'use client';

import { PartyPopper, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useDashboard } from './DashboardProvider';

export function WeeklyWins() {
  const { weeklyWins, dismissWeeklyWins } = useDashboard();

  if (!weeklyWins) {
    return null;
  }

  return (
    <Alert className="relative bg-accent/50 border-primary/30">
      <PartyPopper className="h-5 w-5 text-primary" />
      <AlertTitle className="font-headline font-bold ml-7">Weekly Win!</AlertTitle>
      <AlertDescription className="ml-7">
        You crushed it last week, completing <strong>{weeklyWins.count} {weeklyWins.count === 1 ? 'task' : 'tasks'}</strong>. Keep that amazing momentum going!
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={dismissWeeklyWins}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </Alert>
  );
}
