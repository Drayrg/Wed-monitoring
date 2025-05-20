import { Card, CardContent } from "@/components/ui/card";
import StatusBar from "./StatusBar";

interface BatteryCardProps {
  level: number;
  status: string;
  timeRemaining: string;
}

const BatteryCard = ({ level, status, timeRemaining }: BatteryCardProps) => {
  return (
    <Card className="bg-background-card shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h2 className="font-semibold text-foreground">Battery</h2>
          <span className="text-lg font-semibold text-status-good">
            {level}%
          </span>
        </div>
        <StatusBar value={level} colorVariant="good" />
        <div className="text-xs text-muted-foreground flex justify-between mt-3">
          <span>{status}</span>
          <span>{timeRemaining}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatteryCard;
