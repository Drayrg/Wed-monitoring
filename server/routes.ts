import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  generateSystemMetrics, 
  generateHistoricalData 
} from "../client/src/lib/mockData";

export async function registerRoutes(app: Express): Promise<Server> {
  // System metrics endpoint
  app.get("/api/metrics", (req, res) => {
    const metrics = generateSystemMetrics();
    res.json(metrics);
  });

  // Historical data endpoint
  app.get("/api/metrics/history", (req, res) => {
    const historicalData = generateHistoricalData();
    res.json(historicalData);
  });

  // Placeholder for processes endpoint
  app.get("/api/processes", (req, res) => {
    res.json({ message: "Process data not implemented yet" });
  });

  // Placeholder for system details endpoint
  app.get("/api/system", (req, res) => {
    res.json({ message: "System details not implemented yet" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
