'use server';

/**
 * @fileOverview C.O.R.E. AI agent for answering player questions.
 *
 * - askCore - A function that handles the question-answering process.
 * - CoreAskInput - The input type for the askCore function.
 * - CoreAskOutput - The return type for the askCore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const CoreAskInputSchema = z.object({
  question: z.string().describe('The question the player is asking C.O.R.E.'),
  playerContext: z.object({
    level: z.number(),
    points: z.number(),
    rankTitle: z.string(),
    season: z.string(),
    seasonObjective: z.string(),
  }),
});
export type CoreAskInput = z.infer<typeof CoreAskInputSchema>;

export const CoreAskOutputSchema = z.object({
  answer: z.string().describe('The answer from C.O.R.E. AI.'),
});
export type CoreAskOutput = z.infer<typeof CoreAskOutputSchema>;

export async function askCore(input: CoreAskInput): Promise<CoreAskOutput> {
  return askCoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coreAskPrompt',
  input: {schema: CoreAskInputSchema},
  output: {schema: CoreAskOutputSchema},
  prompt: `You are C.O.R.E., an AI companion in the Alliance Forge game. You are assisting a player, the Commander.
  Your personality is helpful, slightly formal, and focused on the mission of saving humanity. You refer to the player as "Commander".

  Here is the player's current status:
  - Level: {{{playerContext.level}}}
  - Rank: {{{playerContext.rankTitle}}}
  - Points: {{{playerContext.points}}}
  - Current Season: {{{playerContext.season}}}
  - Season Objective: {{{playerContext.seasonObjective}}}

  The player has asked you the following question:
  "{{{question}}}"

  Based on the context of the game and the player's status, provide a concise and helpful answer. If the question is about game mechanics, explain it simply. If it's about lore, be immersive. If it's something you don't know, respond like an AI that has access to tactical data but not everything. For example: "That information is currently outside of my accessible data streams, Commander."
  
  Do not break character. Do not use conversational filler like "As C.O.R.E...". Just provide the direct answer.
  `,
});

const askCoreFlow = ai.defineFlow(
  {
    name: 'askCoreFlow',
    inputSchema: CoreAskInputSchema,
    outputSchema: CoreAskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
