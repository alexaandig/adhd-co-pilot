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

/**
 * TimerCompletionDialog Component
 * 
 * A modal dialog that appears when either a focus session or break period completes.
 * Provides options to continue the Pomodoro cycle or end the session.
 * 
 * Displays different content based on completion mode:
 * - Focus complete: Shows coffee icon and option to start break
 * - Break complete: Shows brain icon and option to start next focus session
 */
export function TimerCompletionDialog() {
  // Get timer-related state and actions from dashboard context
  const { 
    showTimerCompletionDialog,  // Controls dialog visibility
    timerCompletionMode,        // 'focus' or 'break' - determines which session just completed
    hideTimerCompletion,        // Function to close the dialog
    setFocusedTask              // Function to clear the currently focused task
  } = useDashboard();

  /**
   * Handles the "Start Break" button click
   * Currently simplified - in a full implementation, this would trigger
   * the timer to start a break countdown via a state machine or command pattern
   */
  const handleStartBreak = () => {
    // Close the dialog - timer component should detect this and start break
    hideTimerCompletion();
    
    // TODO: Refactor to use proper command pattern
    // Ideally: setTimerCommand('startBreak') would be handled by timer state machine
  };

  /**
   * Handles the "Start Next Focus" button click
   * Closes dialog and signals timer to begin next focus session
   * Same simplification as handleStartBreak - needs proper state management
   */
  const handleStartFocus = () => {
    hideTimerCompletion();
    // TODO: Similar refactor needed - should send explicit command to timer
  };

  /**
   * Handles dialog closure via "End Session" or close button
   * Clears the focused task and closes the dialog, ending the Pomodoro cycle
   */
  const handleClose = () => {
    setFocusedTask(null);      // Clear any task that was being worked on
    hideTimerCompletion();      // Close the dialog
  }

  // Determine which mode we're in for conditional rendering
  const isFocusDone = timerCompletionMode === 'focus';

  return (
    // AlertDialog wrapper - controlled by showTimerCompletionDialog state
    // onOpenChange handles external close attempts (ESC key, backdrop click)
    <AlertDialog 
      open={showTimerCompletionDialog} 
      onOpenChange={(open) => !open && handleClose()}
    >
      <AlertDialogContent>
        {/* Dialog Header - Title and Description */}
        <AlertDialogHeader>
          {/* Dynamic title based on completion mode */}
          <AlertDialogTitle className="flex items-center gap-2">
            {isFocusDone ? (
              <>
                {/* Focus session complete - show coffee icon */}
                <Coffee className="h-6 w-6 text-primary" />
                Focus Complete!
              </>
            ) : (
              <>
                {/* Break complete - show brain icon */}
                <Brain className="h-6 w-6 text-primary" />
                Break's Over!
              </>
            )}
          </AlertDialogTitle>
          
          {/* Contextual message encouraging user */}
          <AlertDialogDescription>
            {isFocusDone
              ? 'Great job! Time for a well-deserved break.'
              : "Hope you had a refreshing break! Ready for the next round?"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Action buttons */}
        <AlertDialogFooter>
          {/* End Session button - always available to exit the cycle */}
          <Button variant="outline" onClick={handleClose}>
            End Session
          </Button>
          
          {/* Conditional primary action based on what just completed */}
          {isFocusDone ? (
            // Just finished focus - offer to start break
            <AlertDialogAction onClick={handleStartBreak}>
              Start 5-min Break
            </AlertDialogAction>
          ) : (
            // Just finished break - offer to start next focus session
            <AlertDialogAction onClick={handleStartFocus}>
              Start Next Focus
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}