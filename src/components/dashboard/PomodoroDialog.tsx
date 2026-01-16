'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PomodoroTimer, TimerState } from './PomodoroTimer';
import { useDashboard } from './DashboardProvider';
import { Brain } from 'lucide-react';

export function PomodoroDialog() {
  const { focusedTask, setFocusedTask, updateTaskCompletion } = useDashboard();
  const [timerState, setTimerState] = useState<TimerState>({
    isActive: false,
    mode: 'focus',
  });

  const isFocusModeActive = timerState.isActive && timerState.mode === 'focus';

  const handleOpenChange = (open: boolean) => {
    if (!open && isFocusModeActive) {
      return; // Don't close if focus is active
    }
    setFocusedTask(null);
  };
  
  const handleComplete = () => {
    if (focusedTask) {
      updateTaskCompletion(focusedTask.id, true);
    }
  }

  const handleEndSession = () => {
    setFocusedTask(null);
  }

  const showCloseButton = !isFocusModeActive;
  
  useEffect(() => {
    if (timerState.mode === 'break' && timerState.isActive) {
      // If break starts, allow closing, but don't force it open
    }
  }, [timerState])

  return (
    <Dialog open={!!focusedTask} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md"
        hideCloseButton={!showCloseButton}
        onEscapeKeyDown={(e) => {
          if (isFocusModeActive) {
            e.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => {
           if (isFocusModeActive) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-headline">
            <Brain className="h-6 w-6 text-primary" />
            Focus Session
          </DialogTitle>
          <DialogDescription>
            Time to focus on one thing. You've got this!
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <p className="text-center font-bold text-lg mb-4">
            {focusedTask?.emoji} {focusedTask?.description}
          </p>
          <PomodoroTimer 
            onComplete={handleComplete}
            onStateChange={setTimerState}
            onEndSession={handleEndSession}
           />
        </div>
      </DialogContent>
    </Dialog>
  );
}
