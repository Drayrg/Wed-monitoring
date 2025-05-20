import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu, Memory, Battery } from "lucide-react";

interface HardwareTabProps {
  cpuInfo: {
    model: string;
    cores: number;
    currentUsage: number;
  };
  memoryInfo: {
    total: string;
    free: string;
    usedPercentage: number;
    usedGb: string;
    totalGb: string;
  };
  batteryInfo: {
    level: number;
    status: string;
    timeRemaining: string;
  };
}

const HardwareTab = ({ cpuInfo, memoryInfo, batteryInfo }: HardwareTabProps) => {
  return (
    <div className="space-y-6">
      {/* CPU Information */}
      <Card className="bg-card border border-border shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">CPU Information</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Model</h3>
              <p className="text-foreground">{cpuInfo.model}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Cores</h3>
              <p className="text-foreground">{cpuInfo.cores}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Clock Speed</h3>
              <p className="text-foreground">3.5 GHz</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Current Usage</h3>
              <p className="text-foreground">{cpuInfo.currentUsage}%</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-muted-foreground mb-2">Performance</h3>
            <Progress value={cpuInfo.currentUsage} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory Information */}
      <Card className="bg-card border border-border shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Memory className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-semibold text-foreground">Memory Information</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Total Memory</h3>
              <p className="text-foreground">{memoryInfo.total}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Free Memory</h3>
              <p className="text-foreground">{memoryInfo.free}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Usage Percentage</h3>
              <p className="text-foreground">{memoryInfo.usedPercentage}%</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-muted-foreground mb-2">Memory Usage</h3>
            <Progress value={memoryInfo.usedPercentage} className="h-2 bg-background-hover" />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">0 GB</span>
              <span className="text-xs text-muted-foreground">{memoryInfo.usedGb}</span>
              <span className="text-xs text-muted-foreground">{memoryInfo.totalGb}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Battery Information */}
      <Card className="bg-card border border-border shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Battery className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Battery Information</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Charge Level</h3>
              <p className="text-foreground">{batteryInfo.level}%</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Status</h3>
              <p className="text-foreground">{batteryInfo.status}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Time Until Full</h3>
              <p className="text-foreground">{batteryInfo.timeRemaining}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-muted-foreground mb-2">Battery Level</h3>
            <Progress value={batteryInfo.level} className="h-2 bg-background-hover" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HardwareTab;