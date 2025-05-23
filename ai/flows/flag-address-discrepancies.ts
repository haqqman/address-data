'use server';

/**
 * @fileOverview Flags address submissions that do not match Google Maps.
 *
 * - flagAddressDiscrepancies - A function that flags address discrepancies.
 * - FlagAddressDiscrepanciesInput - The input type for the flagAddressDiscrepancies function.
 * - FlagAddressDiscrepanciesOutput - The return type for the flagAddressDiscrepancies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlagAddressDiscrepanciesInputSchema = z.object({
  address: z.string().describe('The address submitted by the user.'),
  googleMapsAddress: z
    .string()
    .describe('The address retrieved from Google Maps.'),
});
export type FlagAddressDiscrepanciesInput = z.infer<
  typeof FlagAddressDiscrepanciesInputSchema
>;

const FlagAddressDiscrepanciesOutputSchema = z.object({
  isDiscrepant: z
    .boolean()
    .describe(
      'Whether the submitted address is different from the Google Maps address.'
    ),
  reason: z
    .string()
    .describe(
      'The reason why the address is flagged as potentially discrepant.'
    ),
});
export type FlagAddressDiscrepanciesOutput = z.infer<
  typeof FlagAddressDiscrepanciesOutputSchema
>;

export async function flagAddressDiscrepancies(
  input: FlagAddressDiscrepanciesInput
): Promise<FlagAddressDiscrepanciesOutput> {
  return flagAddressDiscrepanciesFlow(input);
}

const flagAddressDiscrepanciesPrompt = ai.definePrompt({
  name: 'flagAddressDiscrepanciesPrompt',
  input: {schema: FlagAddressDiscrepanciesInputSchema},
  output: {schema: FlagAddressDiscrepanciesOutputSchema},
  prompt: `You are an AI assistant that reviews user-submitted addresses and compares them to Google Maps addresses.

You must determine if the user-submitted address is potentially different from the Google Maps address.

User-submitted address: {{{address}}}
Google Maps address: {{{googleMapsAddress}}}

Output in JSON format whether the addresses are different, and the reason for your determination.`,
});

const flagAddressDiscrepanciesFlow = ai.defineFlow(
  {
    name: 'flagAddressDiscrepanciesFlow',
    inputSchema: FlagAddressDiscrepanciesInputSchema,
    outputSchema: FlagAddressDiscrepanciesOutputSchema,
  },
  async input => {
    const {output} = await flagAddressDiscrepanciesPrompt(input);
    return output!;
  }
);
