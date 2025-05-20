import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CPUCard from "./metrics/CPUCard";
import MemoryCard from "./metrics/MemoryCard";
import BatteryCard from "./metrics/BatteryCard";
import NetworkCard from "./metrics/NetworkCard";
import CPUHistoryChart from "./charts/CPUHistoryChart";
import MemoryHistoryChart from "./charts/MemoryHistoryChart";
import NetworkTrafficChart from "./charts/NetworkTrafficChart";
import UpdateIntervalSelect from "./controls/UpdateIntervalSelect";
import { useUpdateInterval } from "@/context/UpdateIntervalContext";

const Dashboard = () => {
  const { interval } = useUpdateInterval();
  
  const { data: metrics, refetch } = useQuery({
    queryKey: ["/api/metrics"],
  });

  const { data: historicalData } = useQuery({
    queryKey: ["/api/metrics/history"],
  });

  // Опрос для обновления данных с заданным интервалом
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, interval * 1000);
    
    return () => clearInterval(intervalId);
  }, [refetch, interval]);

  if (!metrics || !historicalData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-muted-foreground">Loading metrics...</div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center">System Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">Мониторинг системных ресурсов в реальном времени</p>
        </div>
        <UpdateIntervalSelect />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CPUHistoryChart data={historicalData.cpu} />
        <MemoryHistoryChart data={historicalData.memory} />
      </div>
      
      {/* Network Traffic Chart (Full Width) */}
      <div className="w-full">
        <NetworkTrafficChart data={historicalData.network} />
      </div>
    </div>
  );
};

export default Dashboard;
