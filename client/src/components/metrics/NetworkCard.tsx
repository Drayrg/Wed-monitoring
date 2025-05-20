import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi } from "lucide-react";

interface NetworkCardProps {
  status: "Online" | "Offline";
  download: string;
  upload: string;
  ip: string;
}

const NetworkCard = ({ status, download, upload, ip }: NetworkCardProps) => {
  return (
    <Card className="bg-black border border-gray-800 shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <Wifi className="h-4 w-4 mr-2 text-primary" />
            <h2 className="font-semibold text-foreground text-sm">Network</h2>
          </div>
          <span className="text-xl font-bold text-status-good">
            {status}
          </span>
        </div>
        <div className="flex flex-col space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Download:</span>
            <span className="text-white">{download}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Upload:</span>
            <span className="text-white">{upload}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">IP:</span>
            <span className="text-white">{ip}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkCard;
