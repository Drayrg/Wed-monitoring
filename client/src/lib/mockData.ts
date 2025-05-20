// System metrics data structure
export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    threads: number;
    speed: string;
  };
  memory: {
    usedPercentage: number;
    used: string;
    total: string;
  };
  battery: {
    level: number;
    status: string;
    timeRemaining: string;
  };
  network: {
    status: "Online" | "Offline";
    download: string;
    upload: string;
    ip: string;
  };
}

// Historical data structure
export interface HistoricalData {
  cpu: Array<{
    time: string;
    value: number;
  }>;
  memory: Array<{
    time: string;
    value: number;
  }>;
  network: Array<{
    time: string;
    download: number;
    upload: number;
  }>;
}

// Generate random CPU usage between 40% and 90%
export function generateRandomCPUUsage(): number {
  return Math.floor(Math.random() * 50) + 40;
}

// Generate random memory usage between 50% and 85%
export function generateRandomMemoryUsage(): number {
  return Math.floor(Math.random() * 35) + 50;
}

// Generate random battery level between 20% and 100%
export function generateRandomBatteryLevel(): number {
  return Math.floor(Math.random() * 80) + 20;
}

// Generate random network download speed between 5 and 20 Mbps
export function generateRandomDownloadSpeed(): number {
  return Math.floor(Math.random() * 15) + 5;
}

// Generate random network upload speed between 1 and 6 Mbps
export function generateRandomUploadSpeed(): number {
  return Math.floor(Math.random() * 5) + 1;
}

// Generate random system metrics
export function generateSystemMetrics(): SystemMetrics {
  return {
    cpu: {
      usage: generateRandomCPUUsage(),
      cores: 4,
      threads: 8,
      speed: "3.6 GHz",
    },
    memory: {
      usedPercentage: generateRandomMemoryUsage(),
      used: `${Math.floor(generateRandomMemoryUsage() * 16 / 100)} GB`,
      total: "16 GB",
    },
    battery: {
      level: generateRandomBatteryLevel(),
      status: Math.random() > 0.3 ? "Charging" : "Discharging",
      timeRemaining: `${Math.floor(Math.random() * 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} remaining`,
    },
    network: {
      status: Math.random() > 0.05 ? "Online" : "Offline",
      download: `${generateRandomDownloadSpeed().toFixed(1)} Mbps`,
      upload: `${generateRandomUploadSpeed().toFixed(1)} Mbps`,
      ip: "192.168.1." + Math.floor(Math.random() * 254 + 1),
    },
  };
}

// Generate historical data points
export function generateHistoricalData(): HistoricalData {
  const timePoints = ["5m ago", "4m ago", "3m ago", "2m ago", "1m ago", "Now"];
  
  return {
    cpu: timePoints.map((time) => ({
      time,
      value: generateRandomCPUUsage(),
    })),
    memory: timePoints.map((time) => ({
      time,
      value: generateRandomMemoryUsage(),
    })),
    network: timePoints.map((time) => ({
      time,
      download: generateRandomDownloadSpeed(),
      upload: generateRandomUploadSpeed(),
    })),
  };
}
