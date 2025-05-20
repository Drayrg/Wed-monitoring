import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  generateSystemMetrics, 
  generateHistoricalData 
} from "../client/src/lib/mockData";
import { z } from "zod";
import { 
  insertSystemProfileSchema, 
  insertCpuMetricsSchema, 
  insertMemoryMetricsSchema,
  insertNetworkMetricsSchema,
  insertBatteryMetricsSchema,
  insertStorageMetricsSchema,
  insertProcessMetricsSchema
} from "@shared/schema";

// Default profile ID for demo purposes
// In a real app, this would be dynamically determined based on the logged-in user
const DEFAULT_PROFILE_ID = 1;

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a default system profile if it doesn't exist
  app.get("/api/initialize", async (req, res) => {
    try {
      // Check if we have any system profiles
      const profiles = await storage.getSystemProfiles(1);
      
      if (profiles.length === 0) {
        // Create a default user if none exists
        let userId = 1;
        const user = await storage.getUserByUsername("demo");
        
        if (!user) {
          const newUser = await storage.createUser({
            username: "demo",
            password: "demo123" // In a real app, this would be hashed
          });
          userId = newUser.id;
        } else {
          userId = user.id;
        }
        
        // Create a default system profile
        const systemProfile = await storage.createSystemProfile({
          userId,
          name: "Primary System",
          hostname: "system-pulse",
          osName: "Linux",
          osVersion: "5.15.0-generic",
          osArch: "x86_64"
        });
        
        res.json({ 
          success: true, 
          message: "System initialized", 
          profileId: systemProfile.id 
        });
      } else {
        res.json({ 
          success: true, 
          message: "System already initialized", 
          profileId: profiles[0].id 
        });
      }
    } catch (error) {
      console.error("Initialization error:", error);
      res.status(500).json({ success: false, message: "Failed to initialize system" });
    }
  });

  // System metrics endpoint
  app.get("/api/metrics", async (req, res) => {
    try {
      // For demo, we'll still generate metrics but also store them in the database
      const metricsData = generateSystemMetrics();
      
      // Check if we have a system profile
      const profiles = await storage.getSystemProfiles(1);
      if (profiles.length === 0) {
        return res.json(metricsData);
      }
      
      const profileId = profiles[0].id;
      
      // Store the CPU metrics
      await storage.createCpuMetric({
        profileId,
        usage: metricsData.cpu.usage,
        cores: metricsData.cpu.cores,
        threads: metricsData.cpu.threads,
        speed: metricsData.cpu.speed,
        model: "Sample CPU Model"
      });
      
      // Store the memory metrics
      await storage.createMemoryMetric({
        profileId,
        usedPercentage: metricsData.memory.usedPercentage,
        used: metricsData.memory.used,
        total: metricsData.memory.total
      });
      
      // Store the battery metrics
      await storage.createBatteryMetric({
        profileId,
        level: metricsData.battery.level,
        status: metricsData.battery.status,
        timeRemaining: metricsData.battery.timeRemaining
      });
      
      // Store the network metrics
      await storage.createNetworkMetric({
        profileId,
        status: metricsData.network.status,
        download: metricsData.network.download,
        upload: metricsData.network.upload,
        ip: metricsData.network.ip,
        interfaces: null // We'll add proper interfaces data later
      });
      
      res.json(metricsData);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      
      // If there's an error with the database, still return generated metrics
      // so the UI doesn't break
      const fallbackMetrics = generateSystemMetrics();
      res.json(fallbackMetrics);
    }
  });

  // Historical data endpoint
  app.get("/api/metrics/history", async (req, res) => {
    try {
      const { profileId = DEFAULT_PROFILE_ID } = req.query;
      const profileIdNum = Number(profileId);
      
      // Retrieve the metrics from the database
      const cpuMetricsData = await storage.getCpuMetrics(profileIdNum, 30);
      const memoryMetricsData = await storage.getMemoryMetrics(profileIdNum, 30);
      const networkMetricsData = await storage.getNetworkMetrics(profileIdNum, 30);
      
      // If we have enough data in the database, use it
      if (cpuMetricsData.length >= 5 && memoryMetricsData.length >= 5 && networkMetricsData.length >= 5) {
        // Format the data for the frontend
        const cpuHistory = cpuMetricsData.map((metric, index) => ({
          time: new Date(metric.timestamp).toLocaleTimeString(),
          value: metric.usage
        }));
        
        const memoryHistory = memoryMetricsData.map((metric, index) => ({
          time: new Date(metric.timestamp).toLocaleTimeString(),
          value: metric.usedPercentage
        }));
        
        const networkHistory = networkMetricsData.map((metric, index) => {
          // Parse the values from strings like "128.5 KB/s" to numbers
          const downloadValue = parseFloat(metric.download.split(" ")[0]);
          const uploadValue = parseFloat(metric.upload.split(" ")[0]);
          
          return {
            time: new Date(metric.timestamp).toLocaleTimeString(),
            download: downloadValue,
            upload: uploadValue
          };
        });
        
        const historicalData = {
          cpu: cpuHistory.reverse(),
          memory: memoryHistory.reverse(),
          network: networkHistory.reverse()
        };
        
        return res.json(historicalData);
      }
      
      // Not enough data in the database yet, use generated data
      const historicalData = generateHistoricalData();
      res.json(historicalData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      // If there's an error, return generated data as fallback
      const fallbackData = generateHistoricalData();
      res.json(fallbackData);
    }
  });

  // Processes endpoint
  app.get("/api/processes", async (req, res) => {
    try {
      const { profileId = DEFAULT_PROFILE_ID } = req.query;
      const profileIdNum = Number(profileId);
      
      // Check if we have process data in the database
      const latestProcesses = await storage.getLatestProcessMetric(profileIdNum);
      
      if (latestProcesses) {
        return res.json({ processes: latestProcesses.processes });
      }
      
      // No data in the database yet
      const mockProcesses = [
        { pid: 1, name: "System", cpuUsage: 0.5, memoryUsage: "24 MB" },
        { pid: 2, name: "User", cpuUsage: 2.3, memoryUsage: "156 MB" },
        { pid: 3, name: "Browser", cpuUsage: 15.2, memoryUsage: "1.2 GB" },
        { pid: 4, name: "Media Player", cpuUsage: 8.7, memoryUsage: "450 MB" }
      ];
      
      // Store the mock data in the database
      await storage.createProcessMetric({
        profileId: profileIdNum,
        processes: mockProcesses
      });
      
      res.json({ processes: mockProcesses });
    } catch (error) {
      console.error("Error fetching processes:", error);
      res.status(500).json({ message: "Failed to fetch process data" });
    }
  });

  // System details endpoint
  app.get("/api/system", async (req, res) => {
    try {
      const { profileId = DEFAULT_PROFILE_ID } = req.query;
      const profileIdNum = Number(profileId);
      
      // Get the system profile from the database
      const profile = await storage.getSystemProfile(profileIdNum);
      
      if (!profile) {
        return res.status(404).json({ message: "System profile not found" });
      }
      
      // Get the latest metrics for this profile
      const cpuMetric = await storage.getLatestCpuMetric(profileIdNum);
      const memoryMetric = await storage.getLatestMemoryMetric(profileIdNum);
      const batteryMetric = await storage.getLatestBatteryMetric(profileIdNum);
      const networkMetric = await storage.getLatestNetworkMetric(profileIdNum);
      const storageMetric = await storage.getLatestStorageMetric(profileIdNum);
      
      // Prepare the response with the available data
      const systemDetails = {
        profile: {
          name: profile.name,
          hostname: profile.hostname,
          os: {
            name: profile.osName,
            version: profile.osVersion,
            arch: profile.osArch
          },
          lastUpdated: profile.updatedAt
        },
        hardware: {
          cpu: cpuMetric ? {
            model: cpuMetric.model || "Standard CPU",
            cores: cpuMetric.cores,
            threads: cpuMetric.threads,
            speed: cpuMetric.speed,
            usage: cpuMetric.usage
          } : null,
          memory: memoryMetric ? {
            total: memoryMetric.total,
            used: memoryMetric.used,
            usedPercentage: memoryMetric.usedPercentage
          } : null,
          battery: batteryMetric ? {
            level: batteryMetric.level,
            status: batteryMetric.status,
            timeRemaining: batteryMetric.timeRemaining
          } : null
        },
        network: networkMetric ? {
          status: networkMetric.status,
          download: networkMetric.download,
          upload: networkMetric.upload,
          ip: networkMetric.ip,
          interfaces: networkMetric.interfaces
        } : null,
        storage: storageMetric ? {
          devices: storageMetric.devices
        } : null
      };
      
      res.json(systemDetails);
    } catch (error) {
      console.error("Error fetching system details:", error);
      res.status(500).json({ message: "Failed to fetch system details" });
    }
  });
  
  // Create mock storage data endpoint
  app.get("/api/create-mock-storage", async (req, res) => {
    try {
      const { profileId = DEFAULT_PROFILE_ID } = req.query;
      const profileIdNum = Number(profileId);
      
      const storageDevices = [
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
      ];
      
      // Store the mock data in the database
      await storage.createStorageMetric({
        profileId: profileIdNum,
        devices: storageDevices
      });
      
      res.json({ success: true, devices: storageDevices });
    } catch (error) {
      console.error("Error creating mock storage data:", error);
      res.status(500).json({ message: "Failed to create mock storage data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
