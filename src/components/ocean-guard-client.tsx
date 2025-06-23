"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { MapPanel } from "@/components/map-panel";
import { StormProbabilityCard } from "@/components/storm-probability-card";
import { WeatherMetricsCard } from "@/components/weather-metrics-card";
import { RecommendationCard } from "@/components/recommendation-card";
import { OfflineAnalysisCard } from "@/components/offline-analysis-card";
import { EmergencyAlertDialog } from "@/components/emergency-alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { SummarizeWeatherOutput } from "@/ai/flows/summarize-weather-data";
import type { FishingRecommendationOutput } from "@/ai/flows/generate-fishing-recommendation";
import type { WeatherForecastOutput } from "@/ai/flows/generate-weather-forecast";
import { getAIData } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <Header />
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Skeleton className="h-[400px] lg:h-full w-full rounded-lg" />
                </div>
                <div className="flex flex-col gap-6">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-72 w-full rounded-lg" />
                <Skeleton className="h-72 w-full rounded-lg" />
            </div>
        </div>
    )
}

export function OceanGuardClient() {
  const [summary, setSummary] = useState<SummarizeWeatherOutput | null>(null);
  const [recommendation, setRecommendation] = useState<FishingRecommendationOutput | null>(null);
  const [forecastData, setForecastData] = useState<WeatherForecastOutput['forecast']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const result = await getAIData();
        if (result.error) throw new Error(result.error);
        
        if (result.summary) {
          setSummary(result.summary);
        }
        if (result.recommendation) {
          setRecommendation(result.recommendation);
        }
        if (result.forecast?.forecast) {
          const forecastPoints = result.forecast.forecast;
          setForecastData(forecastPoints);
          
          for (let i = 1; i < forecastPoints.length; i++) {
            // Check for increase over a 3 hour period in the forecast
            if (forecastPoints[i].hour - forecastPoints[i - 1].hour <= 3) {
                const increase = forecastPoints[i].probability - forecastPoints[i - 1].probability;
                if (increase > 40) {
                    setAlertOpen(true);
                    break;
                }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch AI data:", error);
        toast({
          title: "Error",
          description: "Could not fetch latest analysis. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    const initialFetch = async () => {
        await fetchAndProcessData();
        setIsLoading(false);
    }

    initialFetch();
    const interval = setInterval(fetchAndProcessData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [toast]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
        <div className="lg:col-span-2">
          <MapPanel />
        </div>
        <div className="flex flex-col gap-6">
            {summary && <StormProbabilityCard probability={summary.stormProbability} />}
            {recommendation && <RecommendationCard recommendation={recommendation.recommendation} reason={recommendation.reason} />}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500 delay-150">
        <WeatherMetricsCard />
        <OfflineAnalysisCard data={forecastData} />
      </div>
      <EmergencyAlertDialog open={isAlertOpen} onOpenChange={setAlertOpen} />
    </div>
  );
}
