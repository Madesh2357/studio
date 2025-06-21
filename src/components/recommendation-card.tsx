import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, ShieldCheck } from "lucide-react";

interface RecommendationCardProps {
  recommendation: 'go' | 'no-go';
  reason: string;
}

export function RecommendationCard({ recommendation, reason }: RecommendationCardProps) {
  const isGo = recommendation === 'go';

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Safety Recommendation</CardTitle>
        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center gap-4 text-center">
        {isGo ? (
          <ThumbsUp className="h-16 w-16 text-green-500" />
        ) : (
          <ThumbsDown className="h-16 w-16 text-red-500" />
        )}
        <Badge variant={isGo ? "default" : "destructive"} className={`text-2xl font-bold px-6 py-2 ${isGo ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
          {isGo ? "GO" : "NO-GO"}
        </Badge>
        <p className="text-sm text-muted-foreground px-4">
          {reason}
        </p>
      </CardContent>
    </Card>
  );
}
