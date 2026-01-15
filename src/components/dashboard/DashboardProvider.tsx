'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { OnboardingData, ParsedSchedule, ScheduleTask } from '@/lib/types';
import { createScheduleAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { GenerateScheduleInput } from '@/ai/flows/ai-schedule-generator';

type ConfettiType = 'rain' | 'shoot';

interface DashboardContextType {
  onboardingComplete: boolean;
  onboardingData: OnboardingData | null;
  tasks: string;
  setTasks: (tasks: string) => void;
  energyLevel: number;
  setEnergyLevel: (level: number) => void;
  availableTime: string;
  setAvailableTime: (time: string) => void;
  schedule: ParsedSchedule | null;
  isLoading: boolean;
  completeOnboarding: (data: OnboardingData) => void;
  generateSchedule: () => Promise<void>;
  updateTaskCompletion: (taskId: string, completed: boolean) => void;
  showConfetti: boolean;
  confettiType: ConfettiType;
  triggerConfetti: (type?: ConfettiType) => void;
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  showCompletionDialog: boolean;
  setShowCompletionDialog: (show: boolean) => void;
  focusedTask: ScheduleTask | null;
  setFocusedTask: (task: ScheduleTask | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const ONBOARDING_KEY = 'adhd-copilot-onboarding-data';

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [tasks, setTasks] = useState('');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [availableTime, setAvailableTime] = useState('3 hours');
  const [schedule, setSchedule] = useState<ParsedSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiType, setConfettiType] = useState<ConfettiType>('rain');
  const [progress, setProgress] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [focusedTask, setFocusedTask] = useState<ScheduleTask | null>(null);


  useEffect(() => {
    try {
      const savedData = localStorage.getItem(ONBOARDING_KEY);
      if (savedData) {
        const data = JSON.parse(savedData) as OnboardingData;
        setOnboardingData(data);
        setOnboardingComplete(true);
      }
    } catch (error) {
      console.error('Failed to load onboarding data from localStorage', error);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!schedule) {
      setProgress(0);
      setTasksCompleted(0);
      setTotalTasks(0);
      return;
    }
    const allTasks = schedule.flatMap(section => section.tasks);
    const completed = allTasks.filter(task => task.completed).length;
    const total = allTasks.length;
    
    setTasksCompleted(completed);
    setTotalTasks(total);

    if (total > 0) {
      const newProgress = (completed / total) * 100;
      if (newProgress > progress && newProgress === 100) {
        triggerConfetti('shoot');
        setShowCompletionDialog(true);
      }
      setProgress(newProgress);

    } else {
      setProgress(0);
    }
  }, [schedule]);


  const triggerConfetti = (type: ConfettiType = 'rain') => {
    setConfettiType(type);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const completeOnboarding = (data: OnboardingData) => {
    try {
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
      setOnboardingData(data);
      setOnboardingComplete(true);
      toast({
        title: 'Welcome Aboard!',
        description: 'Your preferences are saved. Let\'s get started.',
      });
    } catch (error) {
      console.error('Failed to save onboarding data to localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: 'Could not save your preferences. Please try again.',
      });
    }
  };

  const generateSchedule = async () => {
    if (!onboardingData) {
      toast({
        variant: 'destructive',
        title: 'Hold on!',
        description: 'Please complete onboarding first.',
      });
      return;
    }
    if (!tasks.trim()) {
      toast({
        variant: 'destructive',
        title: 'What\'s on your mind?',
        description: 'Please add some tasks to your brain dump.',
      });
      return;
    }

    setIsLoading(true);
    setSchedule(null);

    const input: GenerateScheduleInput = {
      tasks,
      energyLevel,
      availableTime,
      peakHours: onboardingData.peakHours,
    };

    const result = await createScheduleAction(input);

    setIsLoading(false);

    if (result.success && result.data) {
      setSchedule(result.data.schedule);
    } else {
      toast({
        variant: 'destructive',
        title: 'AI Hiccup',
        description: result.error || 'The AI failed to generate a schedule.',
      });
    }
  };
  
  const updateTaskCompletion = useCallback((taskId: string, completed: boolean) => {
    setSchedule(prevSchedule => {
      if (!prevSchedule) return null;
      
      const newSchedule = prevSchedule.map(section => ({
        ...section,
        tasks: section.tasks.map(task => 
          task.id === taskId ? { ...task, completed } : task
        )
      }));

      // If we just completed the focused task, close the dialog.
      if (completed && focusedTask?.id === taskId) {
        setFocusedTask(null);
      }

      return newSchedule;
    });

    if (completed) {
      triggerConfetti('rain');
    }
  }, [focusedTask]);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <DashboardContext.Provider
      value={{
        onboardingComplete,
        onboardingData,
        tasks,
        setTasks,
        energyLevel,
        setEnergyLevel,
        availableTime,
        setAvailableTime,
        schedule,
        isLoading,
        completeOnboarding,
        generateSchedule,
        updateTaskCompletion,
        showConfetti,
        confettiType,
        triggerConfetti,
        progress,
        tasksCompleted,
        totalTasks,
        showCompletionDialog,
        setShowCompletionDialog,
        focusedTask,
        setFocusedTask,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
