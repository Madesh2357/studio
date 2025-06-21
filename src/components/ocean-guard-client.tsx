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
import { getAIData } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const initialHistoricalData = [
    { hour: -72, probability: 10 }, { hour: -69, probability: 12 }, { hour: -66, probability: 15 },
    { hour: -63, probability: 14 }, { hour: -60, probability: 18 }, { hour: -57, probability: 20 },
    { hour: -54, probability: 22 }, { hour: -51, probability: 25 }, { hour: -48, probability: 28 },
    { hour: -45, probability: 26 }, { hour: -42, probability: 30 }, { hour: -39, probability: 32 },
    { hour: -36, probability: 35 }, { hour: -33, probability: 33 }, { hour: -30, probability: 38 },
    { hour: -27, probability: 40 }, { hour: -24, probability: 42 }, { hour: -21, probability: 39 },
    { hour: -18, probability: 37 }, { hour: -15, probability: 35 }, { hour: -12, probability: 34 },
    { hour: -9, probability: 30 }, { hour: -6, probability: 28 }, { hour: -3, probability: 25 },
];

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
  const [historicalData, setHistoricalData] = useState(initialHistoricalData);
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
          setHistoricalData(prevData => {
            const lastDataPoint = prevData.slice(-1)[0];
            if (lastDataPoint) {
              const increase = result.summary!.stormProbability - lastDataPoint.probability;
              if (increase > 40) {
                setAlertOpen(true);
              }
            }
            return [...prevData.slice(1), { hour: 0, probability: result.summary!.stormProbability }];
          });
        }
        if (result.recommendation) {
          setRecommendation(result.recommendation);
        }
      } catch (error) {
        console.error("Failed to fetch AI data:", error);
        toast({
          title: "Error",
          description: "Could not fetch latest analysis. Please try again.",
          variant: "destructive",
        });
      } finally {
        if(isLoading) setIsLoading(false);
      }
    };
    
    fetchAndProcessData(); // Initial fetch
    const interval = setInterval(fetchAndProcessData, 5 * 60 * 1000); // Subsequent fetches

    return () => clearInterval(interval);
  }, [toast, isLoading]);

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
        <OfflineAnalysisCard data={historicalData} />
      </div>
      <EmergencyAlertDialog open={isAlertOpen} onOpenChange={setAlertOpen} />
    </div>
  );
}
