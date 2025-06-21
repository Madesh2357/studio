import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wind, Thermometer, Droplets, Compass } from "lucide-react";

const weatherMetrics = [
  {
    icon: Wind,
    label: "Wind Speed",
    value: "15-25",
    unit: "knots",
    description: "Gusting from SE",
  },
  {
    icon: Thermometer,
    label: "Temperature",
    value: "25",
    unit: "°C",
    description: "Feels like 28°C",
  },
  {
    icon: Droplets,
    label: "Humidity",
    value: "88",
    unit: "%",
    description: "High humidity",
  },
  {
    icon: Compass,
    label: "Pressure",
    value: "1005",
    unit: "hPa",
    description: "Falling rapidly",
  },
];

export function WeatherMetricsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Weather Metrics</CardTitle>
        <CardDescription>Key factors influencing storm probability.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {weatherMetrics.map((metric, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg flex flex-col items-center text-center">
            <metric.icon className="h-8 w-8 text-accent mb-2" />
            <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
            <p className="text-2xl font-bold text-foreground">
              {metric.value}<span className="text-lg font-normal text-muted-foreground ml-1">{metric.unit}</span>
            </p>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
