// This is a server-side file.
'use server';

/**
 * @fileOverview Determines whether it is safe to fish based on weather conditions.
 *
 * - generateFishingRecommendation - A function that provides a fishing recommendation.
 * - FishingRecommendationInput - The input type for the generateFishingRecommendation function.
 * - FishingRecommendationOutput - The return type for the generateFishingRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FishingRecommendationInputSchema = z.object({
  weatherConditions: z.string().describe('Current weather conditions.'),
  stormProbability: z.number().describe('Predicted storm probability (0-100).'),
  gpsCoordinates: z.string().describe('GPS coordinates of the fisherman.'),
});
export type FishingRecommendationInput = z.infer<typeof FishingRecommendationInputSchema>;

const FishingRecommendationOutputSchema = z.object({
  recommendation: z.enum(['go', 'no-go']).describe('Recommendation on whether to fish.'),
  reason: z.string().describe('Reasoning behind the recommendation.'),
});
export type FishingRecommendationOutput = z.infer<typeof FishingRecommendationOutputSchema>;

export async function generateFishingRecommendation(input: FishingRecommendationInput): Promise<FishingRecommendationOutput> {
  return generateFishingRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fishingRecommendationPrompt',
  input: {schema: FishingRecommendationInputSchema},
  output: {schema: FishingRecommendationOutputSchema},
  prompt: `You are an AI assistant that helps fishermen decide if it's safe to fish.

  Based on the current weather conditions: {{{weatherConditions}}},
  predicted storm probability: {{{stormProbability}}}%,
  and GPS coordinates: {{{gpsCoordinates}}},
  provide a recommendation on whether it's safe to fish (go or no-go) and explain your reasoning.

  Ensure that the recommendation is based on safety, and be conservative in your assessment.
  If the storm probability is high or weather conditions are unfavorable, recommend "no-go".
  The output MUST be valid JSON and parsable by Typescript.
  `,
});

const generateFishingRecommendationFlow = ai.defineFlow(
  {
    name: 'generateFishingRecommendationFlow',
    inputSchema: FishingRecommendationInputSchema,
    outputSchema: FishingRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
