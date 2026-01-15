'use server';

import {
  generateSchedule,
  GenerateScheduleInput,
  GenerateScheduleOutput,
} from '@/ai/flows/ai-schedule-generator';

export async function createScheduleAction(input: GenerateScheduleInput): Promise<{
  success: boolean;
  data?: GenerateScheduleOutput;
  error?: string;
}> {
  try {
    const schedule = await generateSchedule(input);
    return { success: true, data: schedule };
  } catch (error: any) {
    console.error('Detailed error in createScheduleAction:', error);
    const errorMessage = error.message || 'An unknown error occurred.';
    return {
      success: false,
      error: `There was a problem generating your schedule. Details: ${errorMessage}`,
    };
  }
}
