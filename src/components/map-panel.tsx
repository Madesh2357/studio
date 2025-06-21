import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export function MapPanel() {
  return (
    <Card className="h-full w-full overflow-hidden">
      <CardContent className="p-0 relative h-[400px] lg:h-full">
        <Image
          src="https://placehold.co/1200x800.png"
          alt="Map of ocean with current location"
          fill
          style={{ objectFit: "cover" }}
          data-ai-hint="ocean map"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <MapPin className="h-12 w-12 text-accent animate-pulse" fill="currentColor" />
          <span className="mt-2 px-3 py-1 bg-background/80 rounded-full text-foreground font-semibold text-sm">
            Your Location
          </span>
        </div>
        <div className="absolute bottom-4 left-4 bg-background/80 p-3 rounded-lg">
            <h3 className="font-semibold text-foreground">Legend</h3>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                <span className="text-sm text-muted-foreground">Low Probability Zone</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span className="text-sm text-muted-foreground">Medium Probability Zone</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded-full bg-red-600"></div>
                <span className="text-sm text-muted-foreground">High Probability Zone</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
