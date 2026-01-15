'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDashboard } from './DashboardProvider';
import { Coffee, Brain } from 'lucide-react';
import { Button } from '../ui/button';

export function TimerCompletionDialog() {
  const { showTimerCompletionDialog, timerCompletionMode, hideTimerCompletion, setFocusedTask } = useDashboard();

  const handleStartBreak = () => {
    // This logic would ideally be handled inside the timer itself,
    // but for simplicity, we can manipulate it from here.
    // We can't directly start the timer, so we just close the dialog.
    // The timer component will need to be refactored to accept commands.
    hideTimerCompletion();
    // A better approach would be to have a state machine in the provider.
    // e.g., setTimerCommand('startBreak');
  };

  const handleStartFocus = () => {
    hideTimerCompletion();
    // As above, this is a simplification.
  };

  const handleClose = () => {
    setFocusedTask(null);
    hideTimerCompletion();
  }

  const isFocusDone = timerCompletionMode === 'focus';

  return (
    <AlertDialog open={showTimerCompletionDialog} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isFocusDone ? (
              <>
                <Coffee className="h-6 w-6 text-primary" />
                Focus Complete!
              </>
            ) : (
              <>
                <Brain className="h-6 w-6 text-primary" />
                Break's Over!
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isFocusDone
              ? 'Great job! Time for a well-deserved break.'
              : "Hope you had a refreshing break! Ready for the next round?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
           <Button variant="outline" onClick={handleClose}>End Session</Button>
           {isFocusDone ? (
             <AlertDialogAction onClick={handleStartBreak}>Start 5-min Break</AlertDialogAction>
           ) : (
              <AlertDialogAction onClick={handleStartFocus}>Start Next Focus</AlertDialogAction>
           )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
