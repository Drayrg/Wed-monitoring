import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NetworkCardProps {
  status: "Online" | "Offline";
  download: string;
  upload: string;
  ip: string;
}

const NetworkCard = ({ status, download, upload, ip }: NetworkCardProps) => {
  return (
    <Card className="bg-background-card shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h2 className="font-semibold text-foreground">Network</h2>
          <Badge
            className={`${
              status === "Online"
                ? "bg-status-good hover:bg-status-good/90"
                : "bg-status-critical hover:bg-status-critical/90"
            } text-primary-foreground`}
          >
            {status}
          </Badge>
        </div>
        <div className="flex flex-col space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Download:</span>
            <span className="text-foreground">{download}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Upload:</span>
            <span className="text-foreground">{upload}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">IP:</span>
            <span className="text-foreground">{ip}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkCard;
