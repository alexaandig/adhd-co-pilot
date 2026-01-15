'use server';

/**
 * @fileOverview A schedule generator AI agent for ADHD users.
 *
 * - generateSchedule - A function that generates a schedule for ADHD users.
 * - GenerateScheduleInput - The input type for the generateSchedule function.
 * - GenerateScheduleOutput - The return type for the generateSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateScheduleInputSchema = z.object({
  tasks: z.string().describe('A comma-separated list of tasks.'),
  energyLevel: z.number().min(1).max(10).describe('The current energy level (1-10).'),
  availableTime: z.string().describe('The available time (e.g., \"3 hours\" or \"full day\").'),
  peakHours: z.string().describe('The user\'s peak hours (e.g., \"9am-11am\").'),
});
export type GenerateScheduleInput = z.infer<typeof GenerateScheduleInputSchema>;

const GenerateScheduleOutputSchema = z.object({
  schedule: z.array(z.object({
    id: z.string().describe("A unique ID for the section, like 'section-1'"),
    emoji: z.string().optional().describe('An emoji for the section.'),
    title: z.string().describe('The title of the section, e.g., "Morning Session".'),
    tasks: z.array(z.object({
      id: z.string().describe("A unique ID for the task, like 'task-1'"),
      emoji: z.string().optional().describe('An emoji for the task.'),
      description: z.string().describe('The task description.'),
      duration: z.string().optional().describe('An estimated duration, e.g., "25 min". MUST be 25 min or less.'),
      completed: z.boolean().default(false),
      why: z.string().optional().describe("A brief, gentle, and encouraging explanation of why this task is important or a good first step."),
      breakdown: z.string().optional().describe("A tiny, concrete micro-step to make the task incredibly easy to start. This should be a physical action under 2 minutes."),
    })),
  })),
});

export type GenerateScheduleOutput = z.infer<typeof GenerateScheduleOutputSchema>;

export async function generateSchedule(input: GenerateScheduleInput): Promise<GenerateScheduleOutput> {
  return generateScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSchedulePrompt',
  input: {schema: GenerateScheduleInputSchema},
  output: {schema: GenerateScheduleOutputSchema},
  prompt: `You are an ADHD coach helping someone plan their day into a structured JSON format.

ADHD PRINCIPLES:
- **Task Initiation is Hard**: The first step must be laughably small. The 'breakdown' field is for a 2-minute physical action.
- **Context Switching is Costly**: Batch similar tasks (e.g., all emails) into one section.
- **Energy is Precious**: Respect the user's energy level. Low energy = easier, shorter tasks. High energy = one (and only one) challenging task.
- **Time is Abstract**: Provide short, concrete durations. No task should be longer than 25 minutes. Use "Pomodoro" style timings.

SCHEDULING RULES:
1.  **Break It Down**: If a user provides a large task like "work on project," you MUST break it into smaller, concrete sub-tasks (e.g., "open project file," "outline section 1," "find one reference image").
2.  **Tiny First Step**: For every task, provide a 'breakdown' field with a tiny, physical first action (e.g., "Open your email tab," "Put on your shoes," "Get a glass of water").
3.  **Gentle Framing**: For every task, provide a 'why' field. Frame it as a gentle, encouraging suggestion. E.g., "This helps clear your mind," or "Getting this done first makes the next step easier."
4.  **Strict Timeboxing**: No task duration can exceed 25 minutes. If a task would take longer, break it into multiple 25-minute tasks.
5.  **Less is More**: Generate 3-5 tasks total for the day. Prioritize ruthlessly.

INPUT:
Tasks: {{{tasks}}}
Energy Level: {{{energyLevel}}}
Available Time: {{{availableTime}}}
Peak Hours: {{{peakHours}}}

Create today's schedule following all principles and rules. Your output MUST be a valid JSON object matching the output schema.
- Generate unique string IDs for each section and task.
- Ensure 'completed' is always set to false.
`,
});

const generateScheduleFlow = ai.defineFlow(
  {
    name: 'generateScheduleFlow',
    inputSchema: GenerateScheduleInputSchema,
    outputSchema: GenerateScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
