import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({clientOptions: {skipRefererCheck: true}})],
  model: 'googleai/gemini-2.5-flash',
});
