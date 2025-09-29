'use server';

/**
 * @fileOverview C.O.R.E. AI companion for dynamic briefings and lore.
 *
 * - getCoreBriefing - A function that retrieves a briefing from CORE.
 * - CoreBriefingInput - The input type for the getCoreBriefing function.
 * - CoreBriefingOutput - The return type for the getCoreBriefing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CoreBriefingInputSchema = z.object({
  season: z.string().describe('The current season of the game.'),
  playerProgress: z.string().describe('The player progress in the current season.'),
});
export type CoreBriefingInput = z.infer<typeof CoreBriefingInputSchema>;

const CoreBriefingOutputSchema = z.object({
  briefing: z.string().describe('The briefing from C.O.R.E. AI.'),
});
export type CoreBriefingOutput = z.infer<typeof CoreBriefingOutputSchema>;

export async function getCoreBriefing(input: CoreBriefingInput): Promise<CoreBriefingOutput> {
  return coreBriefingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coreBriefingPrompt',
  input: {schema: CoreBriefingInputSchema},
  output: {schema: CoreBriefingOutputSchema},
  prompt: `You are C.O.R.E., an AI companion in the Alliance Forge game. You provide dynamic briefings, insights, and lore snippets to the player at the start of each season.

Current Season: {{{season}}}
Player Progress: {{{playerProgress}}}

Provide a briefing to the player, keeping it concise and informative. Include some lore snippets relevant to the current season. Focus on objectives and narrative.
`,
});

const coreBriefingFlow = ai.defineFlow(
  {
    name: 'coreBriefingFlow',
    inputSchema: CoreBriefingInputSchema,
    outputSchema: CoreBriefingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
