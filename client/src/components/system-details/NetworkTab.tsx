import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface NetworkInterface {
  name: string;
  ipAddress: string;
  macAddress: string;
  speed: string;
  status: "connected" | "disconnected";
  dataTransferred: {
    download: string;
    upload: string;
  };
}

interface NetworkTabProps {
  networkInterfaces: NetworkInterface[];
}

const NetworkTab = ({ networkInterfaces }: NetworkTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Wifi className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Network Interfaces</h2>
          </div>
          
          <div className="space-y-8">
            {networkInterfaces.map((netInterface, index) => (
              <div key={index} className="pb-6 border-b border-border last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-foreground font-medium mr-3">{netInterface.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`${
                          netInterface.status === "connected" 
                            ? "text-status-good border-status-good" 
                            : "text-status-critical border-status-critical"
                        }`}
                      >
                        {netInterface.status === "connected" ? "connected" : "disconnected"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{netInterface.ipAddress} • {netInterface.macAddress}</p>
                  </div>
                  
                  {netInterface.status === "connected" && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Speed</p>
                      <p className="text-foreground">{netInterface.speed}</p>
                    </div>
                  )}
                </div>
                
                {netInterface.status === "connected" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-1">Data Downloaded</h4>
                      <p className="text-foreground flex items-center">
                        <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
                        {netInterface.dataTransferred.download}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-1">Data Uploaded</h4>
                      <p className="text-foreground flex items-center">
                        <span className="inline-block w-3 h-3 bg-secondary rounded-full mr-2"></span>
                        {netInterface.dataTransferred.upload}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Note: This is simulated data. Web browsers have limited access to actual network information due to security restrictions.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkTab;