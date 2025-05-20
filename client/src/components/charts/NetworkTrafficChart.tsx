import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from "recharts";
import { Wifi } from "lucide-react";

interface NetworkTrafficChartProps {
  data: Array<{
    time: string;
    download: number;
    upload: number;
  }>;
}

const NetworkTrafficChart = ({ data }: NetworkTrafficChartProps) => {
  return (
    <Card className="bg-black border border-gray-800 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Wifi className="h-4 w-4 mr-2 text-primary" />
          <h2 className="font-semibold text-foreground text-sm">Network Traffic</h2>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 0,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="downloadFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="uploadFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                stroke="rgba(255, 255, 255, 0.05)"
              />
              <YAxis 
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                stroke="rgba(255, 255, 255, 0.05)"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#111",
                  border: "1px solid #333",
                  color: "#fff",
                  fontSize: "12px",
                  borderRadius: "4px"
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: "10px",
                  color: "#9ca3af",
                  fontSize: "10px"
                }}
              />
              <Area
                type="monotone"
                dataKey="download"
                name="Download (Mbps)"
                stroke="#3b82f6"
                fill="url(#downloadFill)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: "#fff", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="upload"
                name="Upload (Mbps)"
                stroke="#8b5cf6"
                fill="url(#uploadFill)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: "#fff", strokeWidth: 1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkTrafficChart;
