import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Gauge } from "lucide-react";

interface StormProbabilityCardProps {
  probability: number;
}

export function StormProbabilityCard({ probability }: StormProbabilityCardProps) {
  let riskLevel = "Low";
  let riskColor = "text-green-500";
  if (probability > 40) {
    riskLevel = "Moderate";
    riskColor = "text-yellow-500";
  }
  if (probability > 70) {
    riskLevel = "High";
    riskColor = "text-red-500";
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Storm Probability</CardTitle>
        <Gauge className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center gap-4">
        <div className="w-40 h-40">
          <CircularProgress value={probability} />
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">Risk Level: <span className={riskColor}>{riskLevel}</span></p>
          <p className="text-xs text-muted-foreground">
            Current calculated probability of a storm forming.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
