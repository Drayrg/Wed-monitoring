import { Card, CardContent } from "@/components/ui/card";
import StatusBar from "./StatusBar";

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
    <Card className="bg-background-card shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h2 className="font-semibold text-foreground">CPU Usage</h2>
          <span className={`text-lg font-semibold ${getValueColor()}`}>
            {usage}%
          </span>
        </div>
        <StatusBar value={usage} />
        <div className="text-xs text-muted-foreground flex justify-between mt-3">
          <span>{cores} cores / {threads} threads</span>
          <span>{speed}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CPUCard;
