import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HardDrive } from "lucide-react";

interface StorageDevice {
  name: string;
  type: string;
  totalSpace: string;
  usedSpace: string;
  usedPercentage: number;
}

interface StorageTabProps {
  storageDevices: StorageDevice[];
}

const StorageTab = ({ storageDevices }: StorageTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Storage Devices</h2>
          </div>
          
          <div className="space-y-8">
            {storageDevices.map((device, index) => (
              <div key={index} className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-foreground font-medium">{device.name}</h3>
                    <p className="text-sm text-muted-foreground">{device.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground font-medium">{device.usedPercentage}% Used</p>
                    <p className="text-sm text-muted-foreground">
                      {device.usedSpace} / {device.totalSpace} Total
                    </p>
                  </div>
                </div>

                <Progress value={device.usedPercentage} className="h-2 bg-background-hover" />
              </div>
            ))}
          </div>

          {/* Комментарий: В реальном приложении подключите эту информацию из API */}
          {/* 
            Пример API запроса:
            fetch('/api/system/storage')
              .then(response => response.json())
              .then(data => setStorageDevices(data));
          */}
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageTab;