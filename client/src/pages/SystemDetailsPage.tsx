import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUpdateInterval } from "@/context/UpdateIntervalContext";
import UpdateIntervalSelect from "@/components/controls/UpdateIntervalSelect";
import SystemDetailsTabs from "@/components/tabs/SystemDetailsTabs";
import HardwareTab from "@/components/system-details/HardwareTab";
import OSTab from "@/components/system-details/OSTab";
import StorageTab from "@/components/system-details/StorageTab";
import NetworkTab from "@/components/system-details/NetworkTab";
import { AlertTriangle } from "lucide-react";

// Интерфейсы для данных от сервера
interface SystemDetails {
  profile: {
    name: string;
    hostname: string;
    os: {
      name: string;
      version: string;
      arch: string;
    };
    lastUpdated: string;
  };
  hardware: {
    cpu: {
      model: string;
      cores: number;
      threads: number;
      speed: string;
      usage: number;
    } | null;
    memory: {
      total: string;
      used: string;
      usedPercentage: number;
    } | null;
    battery: {
      level: number;
      status: string;
      timeRemaining: string;
    } | null;
  };
  network: {
    status: string;
    download: string;
    upload: string;
    ip: string;
    interfaces: any;
  } | null;
  storage: {
    devices: Array<{
      name: string;
      type: string;
      totalSpace: string;
      usedSpace: string;
      usedPercentage: number;
    }>;
  } | null;
}

const SystemDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("hardware");
  const { interval } = useUpdateInterval();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { 
    data: systemDetails, 
    isLoading, 
    refetch,
    isError,
    error
  } = useQuery({
    queryKey: ["/api/system"],
    refetchOnWindowFocus: false,
    retry: 2
  });

  // Обновление данных с заданным интервалом
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, interval * 1000);
    
    return () => clearInterval(intervalId);
  }, [refetch, interval]);

  // Обработка ошибок
  useEffect(() => {
    if (isError) {
      const err = error as any;
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else if (err.message) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Не удалось получить данные о системе");
      }
    } else {
      setErrorMessage(null);
    }
  }, [isError, error]);

  // Преобразование данных API в формат для компонентов вкладок
  const getHardwareData = () => {
    const defaultData = {
      cpuInfo: {
        model: "Н/Д",
        cores: 0,
        currentUsage: 0
      },
      memoryInfo: {
        total: "Н/Д",
        free: "Н/Д",
        usedPercentage: 0,
        usedGb: "0 GB",
        totalGb: "0 GB"
      },
      batteryInfo: {
        level: 0,
        status: "Н/Д",
        timeRemaining: "Н/Д"
      }
    };

    if (!systemDetails?.hardware) return defaultData;

    return {
      cpuInfo: {
        model: systemDetails.hardware.cpu?.model || "Н/Д",
        cores: systemDetails.hardware.cpu?.cores || 0,
        currentUsage: systemDetails.hardware.cpu?.usage || 0
      },
      memoryInfo: {
        total: systemDetails.hardware.memory?.total || "Н/Д",
        free: "Н/Д", // Рассчитываем на основе имеющихся данных
        usedPercentage: systemDetails.hardware.memory?.usedPercentage || 0,
        usedGb: systemDetails.hardware.memory?.used || "0 GB",
        totalGb: systemDetails.hardware.memory?.total || "0 GB"
      },
      batteryInfo: {
        level: systemDetails.hardware.battery?.level || 0,
        status: systemDetails.hardware.battery?.status || "Н/Д",
        timeRemaining: systemDetails.hardware.battery?.timeRemaining || "Н/Д"
      }
    };
  };

  const getOsData = () => {
    const defaultData = {
      osInfo: {
        name: "Н/Д",
        version: "Н/Д",
        architecture: "Н/Д",
        kernel: "Н/Д",
        hostname: "Н/Д",
        uptime: "Н/Д",
        lastBoot: "Н/Д"
      }
    };

    if (!systemDetails?.profile) return defaultData;

    return {
      osInfo: {
        name: systemDetails.profile.os?.name || "Н/Д",
        version: systemDetails.profile.os?.version || "Н/Д",
        architecture: systemDetails.profile.os?.arch || "Н/Д",
        kernel: systemDetails.profile.os?.version || "Н/Д", // Часто kernel version = OS version
        hostname: systemDetails.profile.hostname || "Н/Д",
        uptime: "Информация недоступна",
        lastBoot: new Date(systemDetails.profile.lastUpdated).toLocaleString() || "Н/Д"
      }
    };
  };

  const getStorageData = () => {
    const defaultData = {
      storageDevices: []
    };

    if (!systemDetails?.storage?.devices || systemDetails.storage.devices.length === 0) {
      return defaultData;
    }

    return {
      storageDevices: systemDetails.storage.devices
    };
  };

  const getNetworkData = () => {
    const defaultData = {
      networkInterfaces: []
    };

    if (!systemDetails?.network) return defaultData;

    // Если есть данные о интерфейсах, используем их
    if (systemDetails.network.interfaces && Array.isArray(systemDetails.network.interfaces)) {
      return {
        networkInterfaces: systemDetails.network.interfaces.map(iface => ({
          ...iface,
          // Преобразуем статус в требуемый формат (connected/disconnected)
          status: iface.status === "connected" ? "connected" : "disconnected",
          // Добавляем информацию о переданных данных
          dataTransferred: {
            download: systemDetails.network.download || "0 KB",
            upload: systemDetails.network.upload || "0 KB"
          }
        }))
      };
    }

    // Если нет данных о интерфейсах, создаем простую запись
    return {
      networkInterfaces: [
        {
          name: "default",
          ipAddress: systemDetails.network.ip || "0.0.0.0",
          macAddress: "Н/Д",
          speed: "Н/Д",
          status: systemDetails.network.status === "Online" ? "connected" : "disconnected",
          dataTransferred: {
            download: systemDetails.network.download || "0 KB",
            upload: systemDetails.network.upload || "0 KB"
          }
        }
      ]
    };
  };

  function renderActiveTab() {
    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <p className="text-muted-foreground">Загрузка системной информации...</p>
        </div>
      );
    }

    switch(activeTab) {
      case "hardware":
        return <HardwareTab {...getHardwareData()} />;
      case "os":
        return <OSTab {...getOsData()} />;
      case "storage":
        return <StorageTab {...getStorageData()} />;
      case "network":
        return <NetworkTab {...getNetworkData()} />;
      default:
        return <HardwareTab {...getHardwareData()} />;
    }
  }

  return (
    <main className="flex-1 p-5 overflow-auto bg-background">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">System Details</h1>
          <p className="text-xs text-muted-foreground mt-1">Подробная информация о системе и оборудовании</p>
        </div>
        <UpdateIntervalSelect />
      </div>

      {errorMessage && (
        <div className="bg-red-900/30 border border-red-700 rounded-md p-4 mb-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold">Ошибка получения данных</h3>
          </div>
          <p className="text-sm">{errorMessage}</p>
          <p className="text-xs mt-2 text-red-300">
            Убедитесь, что Python-клиент запущен и отправляет системные данные
          </p>
        </div>
      )}

      <SystemDetailsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-6">
        {renderActiveTab()}
      </div>
    </main>
  );
};

export default SystemDetailsPage;
