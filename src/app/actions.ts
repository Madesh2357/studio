"use server";

import { summarizeWeatherData } from "@/ai/flows/summarize-weather-data";
import { generateFishingRecommendation } from "@/ai/flows/generate-fishing-recommendation";
import { generateWeatherForecast } from "@/ai/flows/generate-weather-forecast";

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
    const summaryPromise = summarizeWeatherData({
      weatherData: mockWeatherData,
      location: mockLocation,
    });
    
    const forecastPromise = generateWeatherForecast({
        weatherData: mockWeatherData,
        location: mockLocation,
    });
    
    // Await summary and forecast in parallel
    const [summary, forecast] = await Promise.all([summaryPromise, forecastPromise]);

    // Recommendation depends on the summary, so it's called after
    const recommendation = await generateFishingRecommendation({
      weatherConditions: summary.summary,
      stormProbability: summary.stormProbability,
      gpsCoordinates: mockLocation,
    });
    
    return { summary, recommendation, forecast };
  } catch (e) {
    console.error(e);
    return { summary: null, recommendation: null, forecast: null, error: "Failed to get AI data." };
  }
}
