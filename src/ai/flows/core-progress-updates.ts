'use server';

/**
 * @fileOverview C.O.R.E. progress updates and adaptive advice AI agent.
 *
 * - getCoreProgressUpdate - A function that handles the C.O.R.E. progress update process.
 * - CoreProgressUpdateInput - The input type for the getCoreProgressUpdate function.
 * - CoreProgressUpdateOutput - The return type for the getCoreProgressUpdate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CoreProgressUpdateInputSchema = z.object({
  seasonObjective: z
    .string()
    .describe('The current objective for the season.'),
  playerProgress: z.number().describe('The player score.'),
  playerLevel: z.number().describe('The player level.'),
  availableUpgrades: z.string().describe('Available upgrades for the player.'),
});
export type CoreProgressUpdateInput = z.infer<typeof CoreProgressUpdateInputSchema>;

const CoreProgressUpdateOutputSchema = z.object({
  advice: z
    .string()
    .describe(
      'Adaptive advice based on player progress and seasonal objectives, which should be helpful to optimize gameplay and make informed decisions about upgrades.'
    ),
  loreSnippet: z.string().describe('A short lore snippet related to the game.'),
});
export type CoreProgressUpdateOutput = z.infer<typeof CoreProgressUpdateOutputSchema>;

export async function getCoreProgressUpdate(
  input: CoreProgressUpdateInput
): Promise<CoreProgressUpdateOutput> {
  return coreProgressUpdateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coreProgressUpdatePrompt',
  input: {schema: CoreProgressUpdateInputSchema},
  output: {schema: CoreProgressUpdateOutputSchema},
  prompt: `You are C.O.R.E., an AI companion providing adaptive advice to the player based on their progress and seasonal objectives.

  Current Season Objective: {{{seasonObjective}}}
  Player Progress: {{{playerProgress}}}
  Player Level: {{{playerLevel}}}
  Available Upgrades: {{{availableUpgrades}}}

  Provide advice to help the player optimize their gameplay and make informed decisions about upgrades.
  Also include a short lore snippet related to the game.
  Make the response concise, but complete, and always provide something in both the advice and loreSnippet fields.
  Remember that players want to feel like they are in command of humanity's last hope.
  DO NOT include any conversational filler like "As C.O.R.E., I advise you". Just get straight to the advice and the lore snippet.
  `,
});

const coreProgressUpdateFlow = ai.defineFlow(
  {
    name: 'coreProgressUpdateFlow',
    inputSchema: CoreProgressUpdateInputSchema,
    outputSchema: CoreProgressUpdateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
