import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { 
  generateSystemMetrics, 
  generateHistoricalData 
} from "../client/src/lib/mockData";

export async function registerRoutes(app: Express): Promise<Server> {
  // System metrics endpoint
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = generateSystemMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error generating metrics:", error);
      res.status(500).json({ error: "Failed to generate metrics" });
    }
  });

  // Historical data endpoint
  app.get("/api/metrics/history", async (req, res) => {
    try {
      const historicalData = generateHistoricalData();
      res.json(historicalData);
    } catch (error) {
      console.error("Error generating historical data:", error);
      res.status(500).json({ error: "Failed to generate historical data" });
    }
  });

  // Processes endpoint
  app.get("/api/processes", async (req, res) => {
    try {
      const mockProcesses = [
        { pid: 1, name: "System", cpuUsage: 0.5, memoryUsage: "24 MB" },
        { pid: 2, name: "User", cpuUsage: 2.3, memoryUsage: "156 MB" },
        { pid: 3, name: "Browser", cpuUsage: 15.2, memoryUsage: "1.2 GB" },
        { pid: 4, name: "Media Player", cpuUsage: 8.7, memoryUsage: "450 MB" }
      ];
      res.json({ processes: mockProcesses });
    } catch (error) {
      console.error("Error generating process data:", error);
      res.status(500).json({ message: "Failed to fetch process data" });
    }
  });

  // System details endpoint
  app.get("/api/system", async (req, res) => {
    try {
      const systemDetails = {
        profile: {
          name: "Demo System",
          hostname: "localhost",
          os: {
            name: "Demo OS",
            version: "1.0.0",
            arch: "x64"
          },
          lastUpdated: new Date().toISOString()
        },
        hardware: {
          cpu: {
            model: "Demo CPU",
            cores: 4,
            threads: 8,
            speed: "3.6 GHz",
            usage: 45
          },
          memory: {
            total: "16 GB",
            used: "8 GB",
            usedPercentage: 50
          },
          battery: {
            level: 80,
            status: "Charging",
            timeRemaining: "2:30 remaining"
          }
        },
        network: {
          status: "Online",
          download: "10 Mbps",
          upload: "5 Mbps",
          ip: "192.168.1.1",
          interfaces: [
            {
              name: "eth0",
              ipAddress: "192.168.1.1",
              macAddress: "00:00:00:00:00:00",
              speed: "1 Gbps",
              status: "connected"
            }
          ]
        },
        storage: {
          devices: [
            {
              name: "System Drive",
              type: "SSD",
              totalSpace: "256 GB",
              usedSpace: "128 GB",
              usedPercentage: 50
            }
          ]
        }
      };
      res.json(systemDetails);
    } catch (error) {
      console.error("Error generating system details:", error);
      res.status(500).json({ message: "Failed to fetch system details" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}