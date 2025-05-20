import { Card, CardContent } from "@/components/ui/card";
import StatusBar from "./StatusBar";
import { Battery } from "lucide-react";

interface BatteryCardProps {
  level: number;
  status: string;
  timeRemaining: string;
}

const BatteryCard = ({ level, status, timeRemaining }: BatteryCardProps) => {
  return (
    <Card className="bg-black border border-gray-800 shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <Battery className="h-4 w-4 mr-2 text-accent" />
            <h2 className="font-semibold text-foreground text-sm">Battery</h2>
          </div>
          <span className="text-xl font-bold text-status-good">
            {level.toFixed(1)}%
          </span>
        </div>
        <StatusBar value={level} color="accent" />
        <div className="text-xs text-gray-500 flex justify-between mt-3">
          <span>{status}</span>
          <span>{timeRemaining}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatteryCard;
