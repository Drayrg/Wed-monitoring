import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { Database } from "lucide-react";

interface MemoryHistoryChartProps {
  data: Array<{
    time: string;
    value: number;
  }>;
}

const MemoryHistoryChart = ({ data }: MemoryHistoryChartProps) => {
  return (
    <Card className="bg-black border border-gray-800 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Database className="h-4 w-4 mr-2 text-secondary" />
          <h2 className="font-semibold text-foreground text-sm">Memory Usage History</h2>
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
                <linearGradient id="memoryFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                stroke="rgba(255, 255, 255, 0.05)"
              />
              <YAxis 
                domain={[0, 100]}
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
              <Area
                type="monotone"
                dataKey="value"
                name="Memory Usage %"
                stroke="#10b981"
                fill="url(#memoryFill)"
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

export default MemoryHistoryChart;
