import { Card, CardContent } from "@/components/ui/card";
import { MonitorSmartphone } from "lucide-react";

interface OSTabProps {
  osInfo: {
    name: string;
    version: string;
    architecture: string;
    kernel: string;
    hostname: string;
    uptime: string;
    lastBoot: string;
  };
}

const OSTab = ({ osInfo }: OSTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <MonitorSmartphone className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Operating System Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">OS Name</h3>
              <p className="text-foreground">{osInfo.name}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">OS Version</h3>
              <p className="text-foreground">{osInfo.version}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Architecture</h3>
              <p className="text-foreground">{osInfo.architecture}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Kernel</h3>
              <p className="text-foreground">{osInfo.kernel}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Hostname</h3>
              <p className="text-foreground">{osInfo.hostname}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">System Uptime</h3>
              <p className="text-foreground">{osInfo.uptime}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Last Boot</h3>
              <p className="text-foreground">{osInfo.lastBoot}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OSTab;