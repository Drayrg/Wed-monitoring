import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUpdateInterval } from "@/context/UpdateIntervalContext";
import UpdateIntervalSelect from "@/components/controls/UpdateIntervalSelect";
import SystemDetailsTabs from "@/components/tabs/SystemDetailsTabs";
import HardwareTab from "@/components/system-details/HardwareTab";
import OSTab from "@/components/system-details/OSTab";
import StorageTab from "@/components/system-details/StorageTab";
import NetworkTab from "@/components/system-details/NetworkTab";

const SystemDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("hardware");
  const { interval } = useUpdateInterval();
  
  const { data: systemDetails, isLoading, refetch } = useQuery({
    queryKey: ["/api/system"],
    // Здесь мы получаем данные о системе с сервера
    // В реальном приложении endpoint API должен возвращать системную информацию
  });

  // Обновление данных с заданным интервалом
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, interval * 1000);
    
    return () => clearInterval(intervalId);
  }, [refetch, interval]);

  // Пример данных для разных вкладок (в реальном приложении данные будут приходить с сервера)
  const hardwareData = {
    cpuInfo: {
      model: "Standard CPU",
      cores: 4,
      currentUsage: 15.5
    },
    memoryInfo: {
      total: "16 GB",
      free: "14.36 GB",
      usedPercentage: 61, 
      usedGb: "8.2 GB",
      totalGb: "16 GB"
    },
    batteryInfo: {
      level: 90,
      status: "Charging",
      timeRemaining: "154 minutes"
    }
  };

  const osData = {
    osInfo: {
      name: "Linux",
      version: "5.15.0",
      architecture: "x86_64",
      kernel: "5.15.0-generic",
      hostname: "system-pulse",
      uptime: "3 days, 7 hours",
      lastBoot: "2023-10-25 08:30:15"
    }
  };

  const storageData = {
    storageDevices: [
      {
        name: "System Drive",
        type: "SSD",
        totalSpace: "256.0 GB Total",
        usedSpace: "107.55 GB Used",
        usedPercentage: 42
      },
      {
        name: "Data Drive",
        type: "HDD / 7200 RPM",
        totalSpace: "1000.0 GB Total",
        usedSpace: "842.85 GB Used",
        usedPercentage: 84
      }
    ]
  };

  const networkData = {
    networkInterfaces: [
      {
        name: "eth0",
        ipAddress: "192.168.1.50",
        macAddress: "00:1B:44:11:3A:B7",
        speed: "1000 Mbps",
        status: "connected",
        dataTransferred: {
          download: "1,397.67 KB",
          upload: "315.64 KB"
        }
      },
      {
        name: "wlan0",
        ipAddress: "192.168.1.51",
        macAddress: "00:1B:44:11:3A:B8",
        speed: "0 Mbps",
        status: "disconnected",
        dataTransferred: {
          download: "0 KB",
          upload: "0 KB"
        }
      }
    ]
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
        return <HardwareTab {...hardwareData} />;
      case "os":
        return <OSTab {...osData} />;
      case "storage":
        return <StorageTab {...storageData} />;
      case "network":
        return <NetworkTab {...networkData} />;
      default:
        return <HardwareTab {...hardwareData} />;
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

      <SystemDetailsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-6">
        {renderActiveTab()}
      </div>
    </main>
  );
};

export default SystemDetailsPage;
