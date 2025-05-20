import { Card, CardContent } from "@/components/ui/card";
import StatusBar from "./StatusBar";
import { Cpu } from "lucide-react";

interface CPUCardProps {
  usage: number;
  cores: number;
  threads: number;
  speed: string;
}

const CPUCard = ({ usage, cores, threads, speed }: CPUCardProps) => {
  const getValueColor = () => {
    if (usage > 80) {
      return "text-status-critical";
    } else if (usage > 60) {
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
            <Cpu className="h-4 w-4 mr-2 text-primary" />
            <h2 className="font-semibold text-foreground text-sm">CPU Usage</h2>
          </div>
          <span className={`text-xl font-bold ${getValueColor()}`}>
            {usage.toFixed(1)}%
          </span>
        </div>
        <StatusBar value={usage} />
        <div className="text-xs text-gray-500 flex justify-between mt-3">
          <span>{cores} cores / {threads} threads</span>
          <span>{speed}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CPUCard;
