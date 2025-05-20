import { Card, CardContent } from "@/components/ui/card";
import StatusBar from "./StatusBar";

interface MemoryCardProps {
  usedPercentage: number;
  used: string;
  total: string;
}

const MemoryCard = ({ usedPercentage, used, total }: MemoryCardProps) => {
  const getValueColor = () => {
    if (usedPercentage > 80) {
      return "text-status-critical";
    } else if (usedPercentage > 60) {
      return "text-status-warning";
    } else {
      return "text-status-good";
    }
  };

  return (
    <Card className="bg-background-card shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h2 className="font-semibold text-foreground">Memory Usage</h2>
          <span className={`text-lg font-semibold ${getValueColor()}`}>
            {usedPercentage}%
          </span>
        </div>
        <StatusBar value={usedPercentage} />
        <div className="text-xs text-muted-foreground mt-3">
          <span>{used} / {total}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryCard;
