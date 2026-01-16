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
  const { focusedTask, setFocusedTask, updateTaskCompletion, timerCommand, setTimerCommand } = useDashboard();
  const [timerState, setTimerState] = useState<TimerState>({
    isActive: false,
    mode: 'focus',
  });

  const isSessionActive = timerState.isActive;

  const handleOpenChange = (open: boolean) => {
    if (!open && isSessionActive) {
      return; // Don't close if a session is active
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

  const showCloseButton = !isSessionActive;

  return (
    <Dialog open={!!focusedTask} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md"
        hideCloseButton={!showCloseButton}
        onEscapeKeyDown={(e) => {
          if (isSessionActive) {
            e.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => {
           if (isSessionActive) {
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
            timerCommand={timerCommand}
            onCommandConsumed={() => setTimerCommand(null)}
           />
        </div>
      </DialogContent>
    </Dialog>
  );
}
