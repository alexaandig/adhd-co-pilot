'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDashboard } from "./DashboardProvider";

export function CompletionDialog() {
  const { showCompletionDialog, setShowCompletionDialog } = useDashboard();

  return (
    <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>🎉 You did it! 🎉</AlertDialogTitle>
          <AlertDialogDescription>
            You've completed all your tasks for this session. That's amazing!
            Take a moment to celebrate this win. You've earned it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
