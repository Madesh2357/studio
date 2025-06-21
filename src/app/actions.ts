"use server";

import { summarizeWeatherData } from "@/ai/flows/summarize-weather-data";
import { generateFishingRecommendation } from "@/ai/flows/generate-fishing-recommendation";

export async function getAIData() {
  // In a real app, this data would come from APIs like OpenWeatherAPI
  const mockWeatherData = `
    Temperature: 25°C
    Wind Speed: 15 knots, gusting to 25 knots
    Barometric Pressure: 1005 hPa (falling rapidly)
    Humidity: 88%
    Swell: 2.5 meters from the SE
    Cloud cover: 8/8, Cumulonimbus clouds present
  `;
  const mockLocation = "18.5204° N, 73.8567° E";

  try {
    const summary = await summarizeWeatherData({
      weatherData: mockWeatherData,
      location: mockLocation,
    });

    const recommendation = await generateFishingRecommendation({
      weatherConditions: summary.summary,
      stormProbability: summary.stormProbability,
      gpsCoordinates: mockLocation,
    });
    
    return { summary, recommendation };
  } catch (e) {
    console.error(e);
    return { summary: null, recommendation: null, error: "Failed to get AI data." };
  }
}
