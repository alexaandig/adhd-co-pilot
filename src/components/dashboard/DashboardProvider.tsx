'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { OnboardingData, ParsedSchedule, ScheduleTask } from '@/lib/types';
import { createScheduleAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { GenerateScheduleInput } from '@/ai/flows/ai-schedule-generator';
import { differenceInCalendarDays, startOfWeek, isSameDay } from 'date-fns';

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
  streak: number;
  weeklyWins: { count: number; lastShown: string } | null;
  dismissWeeklyWins: () => void;
  isBrainDumpForceUnlocked: boolean;
  setBrainDumpForceUnlocked: (unlocked: boolean) => void;
  resetForNextSession: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const ONBOARDING_KEY = 'adhd-copilot-onboarding-data';
const STREAK_KEY = 'adhd-copilot-streak-data';
const TASK_HISTORY_KEY = 'adhd-copilot-task-history';
const WEEKLY_WINS_KEY = 'adhd-copilot-weekly-wins';

type StreakData = {
  count: number;
  lastCompleted: string; // ISO date string
}

type TaskHistory = string[]; // Array of ISO date strings

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
  const [streak, setStreak] = useState(0);
  const [weeklyWins, setWeeklyWins] = useState<{ count: number; lastShown: string } | null>(null);
  const [isBrainDumpForceUnlocked, setBrainDumpForceUnlocked] = useState(false);


  useEffect(() => {
    try {
      const savedOnboardingData = localStorage.getItem(ONBOARDING_KEY);
      if (savedOnboardingData) {
        const data = JSON.parse(savedOnboardingData) as OnboardingData;
        setOnboardingData(data);
        setOnboardingComplete(true);
      }
      
      const savedStreakData = localStorage.getItem(STREAK_KEY);
      if (savedStreakData) {
        const data = JSON.parse(savedStreakData) as StreakData;
        const today = new Date();
        const lastDate = new Date(data.lastCompleted);
        if (differenceInCalendarDays(today, lastDate) <= 1) {
          setStreak(data.count);
        } else {
          localStorage.removeItem(STREAK_KEY);
        }
      }

      // Weekly Wins Logic
      const lastWinsData = localStorage.getItem(WEEKLY_WINS_KEY);
      const lastShownDate = lastWinsData ? new Date(JSON.parse(lastWinsData).lastShown) : new Date(0);
      const today = new Date();
      const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });

      if (today >= startOfThisWeek && lastShownDate < startOfThisWeek) {
        const taskHistory: TaskHistory = JSON.parse(localStorage.getItem(TASK_HISTORY_KEY) || '[]');
        const lastWeekStart = startOfWeek(new Date(today.setDate(today.getDate() - 7)), { weekStartsOn: 1 });
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);
        
        const winsCount = taskHistory.filter(ts => {
          const d = new Date(ts);
          return d >= lastWeekStart && d <= lastWeekEnd;
        }).length;
        
        if (winsCount > 0) {
          setWeeklyWins({ count: winsCount, lastShown: startOfThisWeek.toISOString() });
        }
      }

    } catch (error) {
      console.error('Failed to load data from localStorage', error);
    }
    setIsMounted(true);
  }, []);

  const dismissWeeklyWins = () => {
    try {
      const winsData = { lastShown: new Date().toISOString() };
      localStorage.setItem(WEEKLY_WINS_KEY, JSON.stringify(winsData));
      setWeeklyWins(null);
    } catch (error) {
       console.error('Failed to dismiss weekly wins', error);
    }
  }

  const resetForNextSession = useCallback(() => {
    setBrainDumpForceUnlocked(true);
    setTasks('');
    setSchedule(null);
  }, []);


  const updateStreak = useCallback(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    try {
       const savedStreakData = localStorage.getItem(STREAK_KEY);
       let currentStreakData: StreakData = { count: 0, lastCompleted: ''};

       if (savedStreakData) {
         currentStreakData = JSON.parse(savedStreakData);
       }
       
       const lastDate = currentStreakData.lastCompleted ? new Date(currentStreakData.lastCompleted) : new Date(0);
       const daysDifference = differenceInCalendarDays(today, lastDate);

       if (daysDifference > 1) {
         currentStreakData = { count: 1, lastCompleted: todayStr };
       } else if (daysDifference === 1) {
         currentStreakData = { count: currentStreakData.count + 1, lastCompleted: todayStr };
       } else if (!currentStreakData.lastCompleted) {
         currentStreakData = { count: 1, lastCompleted: todayStr };
       }
       
       localStorage.setItem(STREAK_KEY, JSON.stringify(currentStreakData));
       setStreak(currentStreakData.count);

    } catch (error) {
      console.error("Failed to update streak in localStorage", error);
    }
  }, []);
  
  const recordTaskCompletion = useCallback(() => {
    try {
      const history: TaskHistory = JSON.parse(localStorage.getItem(TASK_HISTORY_KEY) || '[]');
      history.push(new Date().toISOString());
      localStorage.setItem(TASK_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to record task completion", error);
    }
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
  }, [schedule, progress]);


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
    setBrainDumpForceUnlocked(false);

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
        description: 'The AI failed to generate a schedule.',
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

      if (completed && focusedTask?.id === taskId) {
        setFocusedTask(null);
      }

      return newSchedule;
    });

    if (completed) {
      triggerConfetti('rain');
      updateStreak();
      recordTaskCompletion();
    }
  }, [focusedTask, updateStreak, recordTaskCompletion]);

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
        streak,
        weeklyWins,
        dismissWeeklyWins,
        isBrainDumpForceUnlocked,
        setBrainDumpForceUnlocked,
        resetForNextSession,
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
