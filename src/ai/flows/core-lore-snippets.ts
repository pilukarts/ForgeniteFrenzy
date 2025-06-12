'use server';

/**
 * @fileOverview Provides short lore snippets or "mission reports" when players return to the game,
 * detailing passive progress made while offline.
 *
 * - getCoreLoreSnippet - A function that generates a lore snippet.
 * - CoreLoreSnippetInput - The input type for the getCoreLoreSnippet function.
 * - CoreLoreSnippetOutput - The return type for the getCoreLoreSnippet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CoreLoreSnippetInputSchema = z.object({
  timeAway: z
    .number()
    .describe(
      'The amount of time the player was away from the game, in minutes.'
    ),
  resourcesGained: z
    .number()
    .describe(
      'The amount of resources passively gained while the player was away.'
    ),
});
export type CoreLoreSnippetInput = z.infer<typeof CoreLoreSnippetInputSchema>;

const CoreLoreSnippetOutputSchema = z.object({
  snippet: z
    .string()
    .describe(
      'A short lore snippet or mission report detailing passive progress.'
    ),
});
export type CoreLoreSnippetOutput = z.infer<typeof CoreLoreSnippetOutputSchema>;

export async function getCoreLoreSnippet(
  input: CoreLoreSnippetInput
): Promise<CoreLoreSnippetOutput> {
  return coreLoreSnippetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coreLoreSnippetPrompt',
  input: {schema: CoreLoreSnippetInputSchema},
  output: {schema: CoreLoreSnippetOutputSchema},
  prompt: `You are C.O.R.E., an AI companion providing mission reports to players in the Alliance Forge game.

  Generate a short lore snippet (1-2 sentences) to update the player on what happened while they were away.

  Time away: {{timeAway}} minutes
  Resources gained: {{resourcesGained}}

  Use the following tone:
  * Immersive
  * Brief
  * Informative
  `,
});

const coreLoreSnippetFlow = ai.defineFlow(
  {
    name: 'coreLoreSnippetFlow',
    inputSchema: CoreLoreSnippetInputSchema,
    outputSchema: CoreLoreSnippetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
