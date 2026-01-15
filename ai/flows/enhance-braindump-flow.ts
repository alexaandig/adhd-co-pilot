'use server';

/**
 * @fileOverview An AI agent to enhance a user's brain dump.
 *
 * - enhanceBrainDump - A function that refines a raw list of tasks.
 * - EnhanceBrainDumpInput - The input type for the enhanceBrainDump function.
 * - EnhanceBrainDumpOutput - The return type for the enhanceBrainDump function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EnhanceBrainDumpInputSchema = z.object({
  rawTasks: z.string().describe('A raw, comma-separated, or unstructured list of tasks from the user.'),
});
export type EnhanceBrainDumpInput = z.infer<typeof EnhanceBrainDumpInputSchema>;

const EnhanceBrainDumpOutputSchema = z.object({
  enhancedTasks: z
    .string()
    .describe('A clean, comma-separated list of actionable tasks derived from the raw input.'),
});
export type EnhanceBrainDumpOutput = z.infer<typeof EnhanceBrainDumpOutputSchema>;

export async function enhanceBrainDump(input: EnhanceBrainDumpInput): Promise<EnhanceBrainDumpOutput> {
  return enhanceBrainDumpFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceBrainDumpPrompt',
  input: { schema: EnhanceBrainDumpInputSchema },
  output: { schema: EnhanceBrainDumpOutputSchema },
  prompt: `You are an assistant that helps users with ADHD clarify their thoughts. A user will provide a raw "brain dump" of tasks. Your job is to process this raw text and convert it into a clean, comma-separated list of actionable tasks.

RULES:
1.  **Clarify Ambiguity**: If a task is vague (e.g., "handle project"), break it into a few distinct, concrete tasks (e.g., "Outline project report, Email team for project updates, Schedule project meeting").
2.  **Extract Tasks**: Identify all potential tasks from the raw text.
3.  **Format as Comma-Separated**: The final output MUST be a single string of tasks separated by commas. Do not use bullet points or newlines.
4.  **Keep it Action-Oriented**: Each item in the list should be a clear action.

EXAMPLE:
-   **Input**: "I need to sort out the laundry situation, also the car is making a weird noise, and I should probably think about what to do for dinner tonight and also email that client back about the proposal."
-   **Output**: "Wash and fold laundry, Schedule car maintenance appointment, Plan dinner menu, Go grocery shopping, Draft email response to client about proposal"

RAW USER TASKS:
{{{rawTasks}}}

Process the tasks above and return a clean, comma-separated string.
`,
});

const enhanceBrainDumpFlow = ai.defineFlow(
  {
    name: 'enhanceBrainDumpFlow',
    inputSchema: EnhanceBrainDumpInputSchema,
    outputSchema: EnhanceBrainDumpOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
