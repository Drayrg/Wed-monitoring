import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CPUCard from "./metrics/CPUCard";
import MemoryCard from "./metrics/MemoryCard";
import BatteryCard from "./metrics/BatteryCard";
import NetworkCard from "./metrics/NetworkCard";
import CPUHistoryChart from "./charts/CPUHistoryChart";
import MemoryHistoryChart from "./charts/MemoryHistoryChart";
import NetworkTrafficChart from "./charts/NetworkTrafficChart";

const Dashboard = () => {
  const { data: metrics, refetch } = useQuery({
    queryKey: ["/api/metrics"],
  });

  const { data: historicalData } = useQuery({
    queryKey: ["/api/metrics/history"],
  });

  // Poll for new data every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [refetch]);

  if (!metrics || !historicalData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-muted-foreground">Loading metrics...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">System Dashboard</h1>
        <p className="text-muted-foreground">Current system performance metrics</p>
      </div>

      {/* System Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <CPUCard
          usage={metrics.cpu.usage}
          cores={metrics.cpu.cores}
          threads={metrics.cpu.threads}
          speed={metrics.cpu.speed}
        />
        <MemoryCard
          usedPercentage={metrics.memory.usedPercentage}
          used={metrics.memory.used}
          total={metrics.memory.total}
        />
        <BatteryCard
          level={metrics.battery.level}
          status={metrics.battery.status}
          timeRemaining={metrics.battery.timeRemaining}
        />
        <NetworkCard
          status={metrics.network.status}
          download={metrics.network.download}
          upload={metrics.network.upload}
          ip={metrics.network.ip}
        />
      </div>

      {/* Historical Data Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CPUHistoryChart data={historicalData.cpu} />
        <MemoryHistoryChart data={historicalData.memory} />
        <NetworkTrafficChart data={historicalData.network} />
      </div>
    </div>
  );
};

export default Dashboard;
