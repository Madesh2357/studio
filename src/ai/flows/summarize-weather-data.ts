// 'use server';

/**
 * @fileOverview Summarizes weather data to provide fishermen with key factors influencing storm probability.
 *
 * - summarizeWeatherData - A function that summarizes weather data for storm risk assessment.
 * - SummarizeWeatherInput - The input type for the summarizeWeatherData function.
 * - SummarizeWeatherOutput - The return type for the summarizeWeatherData function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeWeatherInputSchema = z.object({
  weatherData: z.string().describe('Weather data including temperature, wind speed, pressure, and humidity.'),
  location: z.string().describe('The GPS coordinates of the fishing area.'),
});
export type SummarizeWeatherInput = z.infer<typeof SummarizeWeatherInputSchema>;

const SummarizeWeatherOutputSchema = z.object({
  summary: z.string().describe('A summary of the weather data, highlighting key factors influencing storm probability.'),
  stormProbability: z.number().describe('The probability of a storm occurring in the fishing area (0-100).'),
  recommendation: z.string().describe('A recommendation on whether or not it is safe to fish.'),
});
export type SummarizeWeatherOutput = z.infer<typeof SummarizeWeatherOutputSchema>;

export async function summarizeWeatherData(input: SummarizeWeatherInput): Promise<SummarizeWeatherOutput> {
  return summarizeWeatherDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeWeatherPrompt',
  input: {schema: SummarizeWeatherInputSchema},
  output: {schema: SummarizeWeatherOutputSchema},
  prompt: `You are a weather expert specializing in assessing storm risks for fishermen.

  Analyze the provided weather data and location to determine the storm probability and provide a fishing recommendation.

  Weather Data: {{{weatherData}}}
  Location: {{{location}}}

  Based on this data, provide a summary of the key factors influencing storm probability, the storm probability (0-100), and a recommendation on whether it is safe to fish.

  Ensure the summary is concise and easy to understand, focusing on the most important information for fishermen.
`,
});

const summarizeWeatherDataFlow = ai.defineFlow(
  {
    name: 'summarizeWeatherDataFlow',
    inputSchema: SummarizeWeatherInputSchema,
    outputSchema: SummarizeWeatherOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
