'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { useDashboard } from './DashboardProvider';
import type { ScheduleTask } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Lightbulb, ChevronsRight, Timer, Lock } from 'lucide-react';
import { Button } from "../ui/button";

export function ScheduleItem({ task, isLocked }: { task: ScheduleTask, isLocked: boolean }) {
  const { updateTaskCompletion, setFocusedTask, focusedTask } = useDashboard();
  
  const isTimerOpen = focusedTask?.id === task.id;

  const handleCheckedChange = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      updateTaskCompletion(task.id, checked);
    }
  };

  return (
    <div className={cn(
        "bg-card border rounded-lg transition-all relative overflow-hidden p-4", 
        task.completed && "bg-accent/50 border-primary/30",
        isLocked && "bg-muted/50 border-dashed opacity-70 blur-sm"
    )}>
      <div className="flex items-start space-x-4">
        <Checkbox
          id={task.id}
          checked={task.completed}
          onCheckedChange={handleCheckedChange}
          className="mt-1 h-5 w-5"
          disabled={isTimerOpen || isLocked}
        />
        <div className="flex-1 space-y-2">
          <label
            htmlFor={task.id}
            className={cn(
              "font-medium text-lg leading-none peer-disabled:cursor-not-allowed",
              task.completed && "line-through text-muted-foreground",
              isTimerOpen && "text-primary font-bold",
              isLocked ? "text-muted-foreground peer-disabled:opacity-100" : "peer-disabled:opacity-70"
            )}
          >
            {isLocked && <Lock className="inline-block h-4 w-4 mr-2" />}
            {task.emoji} {task.description} {task.duration && `(${task.duration})`}
          </label>
          
          {task.why && (
            <p className="text-sm text-muted-foreground flex items-start gap-2 p-2 bg-accent/30 rounded-md">
              <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-yellow-500" />
              <span><span className="font-semibold">Why first:</span> {task.why}</span>
            </p>
          )}

          {task.breakdown && (
            <p className="text-sm text-muted-foreground flex items-start gap-2 p-2 bg-primary/10 rounded-md">
              <ChevronsRight className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <span><span className="font-semibold">Break it down:</span> {task.breakdown}</span>
            </p>
          )}

        </div>
          {!task.completed && (
              <Button variant="outline" size="sm" onClick={() => setFocusedTask(task)} disabled={isLocked}>
                  <Timer className="h-4 w-4 mr-2" />
                  Focus
              </Button>
          )}
      </div>
    </div>
  );
}
