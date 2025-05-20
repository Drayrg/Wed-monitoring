import { Card, CardContent } from "@/components/ui/card";
import StatusBar from "./StatusBar";
import { Database } from "lucide-react";

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
    <Card className="bg-black border border-gray-800 shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <Database className="h-4 w-4 mr-2 text-secondary" />
            <h2 className="font-semibold text-foreground text-sm">Memory Usage</h2>
          </div>
          <span className={`text-xl font-bold ${getValueColor()}`}>
            {usedPercentage.toFixed(1)}%
          </span>
        </div>
        <StatusBar value={usedPercentage} color="secondary" />
        <div className="text-xs text-gray-500 mt-3">
          <span>{used} / {total}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryCard;
