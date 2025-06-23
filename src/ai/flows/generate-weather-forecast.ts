'use server';

/**
 * @fileOverview Generates a 72-hour storm probability forecast.
 *
 * - generateWeatherForecast - A function that provides a 72-hour forecast.
 * - WeatherForecastInput - The input type for the generateWeatherForecast function.
 * - WeatherForecastOutput - The return type for the generateWeatherForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherForecastInputSchema = z.object({
  weatherData: z.string().describe('Current weather data including temperature, wind speed, pressure, and humidity.'),
  location: z.string().describe('The GPS coordinates of the fishing area.'),
});
export type WeatherForecastInput = z.infer<typeof WeatherForecastInputSchema>;

const ForecastDataPointSchema = z.object({
    hour: z.number().describe('The forecast hour from now (e.g., 3, 6, 9).'),
    probability: z.number().describe('The storm probability at that hour (0-100).'),
});

const WeatherForecastOutputSchema = z.object({
  forecast: z
    .array(ForecastDataPointSchema)
    .describe('An array of storm probability forecasts for the next 72 hours, in 3-hour intervals.'),
});
export type WeatherForecastOutput = z.infer<typeof WeatherForecastOutputSchema>;

export async function generateWeatherForecast(input: WeatherForecastInput): Promise<WeatherForecastOutput> {
  return generateWeatherForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeatherForecastPrompt',
  input: {schema: WeatherForecastInputSchema},
  output: {schema: WeatherForecastOutputSchema},
  prompt: `You are a meteorological AI that specializes in generating storm forecasts for maritime environments.

  Based on the current weather conditions, generate a 72-hour storm probability forecast. The forecast should be provided in 3-hour intervals, starting from hour 3 up to hour 72.

  Current Weather Data: {{{weatherData}}}
  Location: {{{location}}}

  Your output must be a JSON object containing a 'forecast' array. Each element in the array should be an object with 'hour' and 'probability' fields. The probability should be a number between 0 and 100.
  Example for a single data point: { "hour": 3, "probability": 15 }
  `,
});

const generateWeatherForecastFlow = ai.defineFlow(
  {
    name: 'generateWeatherForecastFlow',
    inputSchema: WeatherForecastInputSchema,
    outputSchema: WeatherForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
