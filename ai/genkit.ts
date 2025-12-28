
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  // The model was changed to `gemini-1.5-flash` to fix a bug in the address submission form.
  // The previous model, `gemini-2.0-flash-exp`, was causing an error.
  model: 'googleai/gemini-1.5-flash',
});

