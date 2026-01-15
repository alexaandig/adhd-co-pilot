'use server';

import {
  generateSchedule,
  GenerateScheduleInput,
  GenerateScheduleOutput,
} from '@/ai/flows/ai-schedule-generator';

import { 
  enhanceBrainDump,
  EnhanceBrainDumpInput,
  EnhanceBrainDumpOutput,
} from '@/ai/flows/enhance-braindump-flow';

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

export async function enhanceBrainDumpAction(input: EnhanceBrainDumpInput): Promise<{
  success: boolean;
  data?: EnhanceBrainDumpOutput;
  error?: string;
}> {
  try {
    const result = await enhanceBrainDump(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Detailed error in enhanceBrainDumpAction:', error);
    const errorMessage = error.message || 'An unknown error occurred.';
    return {
      success: false,
      error: `There was a problem enhancing your brain dump. Details: ${errorMessage}`,
    };
  }
}
