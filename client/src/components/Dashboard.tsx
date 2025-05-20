import { useEffect, useState } from "react";
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
import { AlertTriangle } from "lucide-react";

interface MetricsError {
  error: string;
  message: string;
}

const Dashboard = () => {
  const { interval } = useUpdateInterval();
  const [metricsError, setMetricsError] = useState<MetricsError | null>(null);
  const [historicalDataError, setHistoricalDataError] = useState<string | null>(null);

  const { 
    data: metrics, 
    refetch, 
    error: metricsQueryError, 
    isError: isMetricsError,
    isLoading: isMetricsLoading 
  } = useQuery({
    queryKey: ["/api/metrics"],
    refetchOnWindowFocus: false,
    retry: 2
  });

  const { 
    data: historicalData, 
    refetch: refetchHistoricalData,
    error: historicalDataQueryError, 
    isError: isHistoricalDataError,
    isLoading: isHistoricalDataLoading 
  } = useQuery({
    queryKey: ["/api/metrics/history"],
    refetchOnWindowFocus: false,
    retry: 2
  });

  // Обработка ошибок API
  useEffect(() => {
    if (isMetricsError && metricsQueryError) {
      const error = metricsQueryError as any;
      if (error.response?.data) {
        setMetricsError(error.response.data as MetricsError);
      } else {
        setMetricsError({
          error: "Ошибка соединения",
          message: "Не удалось подключиться к API метрик"
        });
      }
    } else {
      setMetricsError(null);
    }

    if (isHistoricalDataError && historicalDataQueryError) {
      const error = historicalDataQueryError as any;
      if (error.response?.data?.message) {
        setHistoricalDataError(error.response.data.message);
      } else {
        setHistoricalDataError("Не удалось загрузить исторические данные");
      }
    } else {
      setHistoricalDataError(null);
    }
  }, [isMetricsError, metricsQueryError, isHistoricalDataError, historicalDataQueryError]);

  // Опрос для обновления данных с заданным интервалом
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
      refetchHistoricalData();
    }, interval * 1000);
    
    return () => clearInterval(intervalId);
  }, [refetch, refetchHistoricalData, interval]);

  // Безопасный доступ к данным (fallback если данные не определены)
  const safeMetrics = {
    cpu: {
      usage: metrics?.cpu?.usage || 0,
      cores: metrics?.cpu?.cores || 0,
      threads: metrics?.cpu?.threads || 0,
      speed: metrics?.cpu?.speed || "N/A"
    },
    memory: {
      usedPercentage: metrics?.memory?.usedPercentage || 0,
      used: metrics?.memory?.used || "N/A",
      total: metrics?.memory?.total || "N/A"
    },
    battery: {
      level: metrics?.battery?.level || 0,
      status: metrics?.battery?.status || "N/A",
      timeRemaining: metrics?.battery?.timeRemaining || "N/A"
    },
    network: {
      status: (metrics?.network?.status as "Online" | "Offline") || "Offline",
      download: metrics?.network?.download || "0 KB/s",
      upload: metrics?.network?.upload || "0 KB/s",
      ip: metrics?.network?.ip || "0.0.0.0"
    }
  };

  // Безопасный доступ к историческим данным
  const safeHistoricalData = {
    cpu: historicalData?.cpu || [],
    memory: historicalData?.memory || [],
    network: historicalData?.network || []
  };

  if (isMetricsLoading && isHistoricalDataLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-muted-foreground">Загрузка метрик...</div>
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

      {/* Error message for Python client connection */}
      {metricsError && (
        <div className="bg-red-900/30 border border-red-700 rounded-md p-4 mb-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold">{metricsError.error}</h3>
          </div>
          <p className="text-sm">{metricsError.message}</p>
          <p className="text-xs mt-2 text-red-300">Подключите Python-клиент для получения метрик системы в реальном времени</p>
        </div>
      )}

      {/* System Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <CPUCard
          usage={safeMetrics.cpu.usage}
          cores={safeMetrics.cpu.cores}
          threads={safeMetrics.cpu.threads}
          speed={safeMetrics.cpu.speed}
        />
        <MemoryCard
          usedPercentage={safeMetrics.memory.usedPercentage}
          used={safeMetrics.memory.used}
          total={safeMetrics.memory.total}
        />
        <BatteryCard
          level={safeMetrics.battery.level}
          status={safeMetrics.battery.status}
          timeRemaining={safeMetrics.battery.timeRemaining}
        />
        <NetworkCard
          status={safeMetrics.network.status}
          download={safeMetrics.network.download}
          upload={safeMetrics.network.upload}
          ip={safeMetrics.network.ip}
        />
      </div>

      {/* Historical Data Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {historicalDataError ? (
          <div className="col-span-2 text-red-400 text-sm p-4 border border-red-700/30 rounded-md bg-red-900/20">
            <p className="font-medium">Ошибка загрузки исторических данных</p>
            <p className="text-xs mt-2">{historicalDataError}</p>
          </div>
        ) : (
          <>
            <CPUHistoryChart data={safeHistoricalData.cpu} />
            <MemoryHistoryChart data={safeHistoricalData.memory} />
          </>
        )}
      </div>
      
      {/* Network Traffic Chart (Full Width) */}
      {!historicalDataError && (
        <div className="w-full">
          <NetworkTrafficChart data={safeHistoricalData.network} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
