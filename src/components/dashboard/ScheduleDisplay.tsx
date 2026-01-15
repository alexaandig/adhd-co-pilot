'use client';

import { useDashboard } from './DashboardProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScheduleItem } from './ScheduleItem';
import { BrainCircuit, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '@/components/ui/progress';

function LoadingSkeleton() {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>
         <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>
      </div>
    );
}

const progressMessages = [
  { progress: 0, message: "Let's get this bread! 🍞" },
  { progress: 25, message: "You're on a roll! 🔥" },
  { progress: 50, message: "Halfway there! Keep it up! 🚀" },
  { progress: 75, message: "Almost done! You've got this! 💪" },
  { progress: 100, message: "All done! Time to relax! 🎉" },
];

const getProgressMessage = (progress: number) => {
  const applicableMessages = progressMessages.filter(m => progress >= m.progress);
  return applicableMessages[applicableMessages.length - 1].message;
};

export function ScheduleDisplay() {
  const { schedule, isLoading, progress, tasksCompleted, totalTasks } = useDashboard();
  const progressMessage = getProgressMessage(progress);

  return (
    <Card className="min-h-[400px]">
      <CardHeader>
        <CardTitle className="font-headline">2. Your Focus Plan</CardTitle>
        <CardDescription>Here's your plan, tailored for your brain. Just start with the first one.</CardDescription>
        {schedule && totalTasks > 0 && (
          <div className="pt-4 space-y-2">
            <div className='flex justify-between items-center'>
              <span className="text-sm font-medium text-muted-foreground">{progressMessage}</span>
              <span className="text-sm font-medium text-muted-foreground">{tasksCompleted} / {totalTasks} done</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingSkeleton />}
        {!isLoading && !schedule && (
          <div className="text-center py-12">
            <BrainCircuit className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Your plan will appear here</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill out the brain dump and click generate!
            </p>
          </div>
        )}
        {!isLoading && schedule && (
          <div className="space-y-6">
            {schedule.map((section) => (
              <div key={section.id}>
                <h3 className="text-xl font-bold font-headline mb-3">
                  {section.emoji} {section.title}
                </h3>
                <div className="space-y-4">
                  {section.tasks.map((task) => (
                    <ScheduleItem key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
             <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Not feeling it? No problem. You can always hit "Generate My Schedule" again for a fresh plan.</span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
