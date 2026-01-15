export type OnboardingData = {
  peakHours: string;
  derailer: string;
  motivator: string;
  medication: string;
};

export type ScheduleTask = {
  id: string;
  emoji?: string;
  description: string;
  duration?: string;
  completed: boolean;
  why?: string;
  breakdown?: string;
};

export type ScheduleSection = {
  id: string;
  emoji?: string;
  title: string;
  tasks: ScheduleTask[];
};

export type ParsedSchedule = ScheduleSection[];
