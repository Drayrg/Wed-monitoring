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
} from "recharts";

interface NetworkTrafficChartProps {
  data: Array<{
    time: string;
    download: number;
    upload: number;
  }>;
}

const NetworkTrafficChart = ({ data }: NetworkTrafficChartProps) => {
  return (
    <Card className="bg-background-card shadow-lg">
      <CardContent className="p-4">
        <h2 className="font-semibold text-foreground mb-4">Network Traffic</h2>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                stroke="rgba(255, 255, 255, 0.1)"
              />
              <YAxis 
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                stroke="rgba(255, 255, 255, 0.1)"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background-card))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))"
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: "10px",
                  color: "hsl(var(--muted-foreground))"
                }}
              />
              <Line
                type="monotone"
                dataKey="download"
                name="Download (Mbps)"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="upload"
                name="Upload (Mbps)"
                stroke="hsl(var(--chart-5))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkTrafficChart;
