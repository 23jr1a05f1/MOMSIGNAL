
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // === API ROUTES ===
  
  // Get all readings
  app.get(api.readings.list.path, async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const readings = await storage.getReadings(limit);
    res.json(readings);
  });

  // Create reading (IoT Device Endpoint)
  app.post(api.readings.create.path, async (req, res) => {
    try {
      const input = api.readings.create.input.parse(req.body);
      const reading = await storage.createReading(input);
      res.status(201).json(reading);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Get stats
  app.get(api.readings.stats.path, async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // Get alerts
  app.get(api.alerts.list.path, async (req, res) => {
    const alerts = await storage.getActiveAlerts();
    res.json(alerts);
  });

  // Resolve alert
  app.patch(api.alerts.resolve.path, async (req, res) => {
    const alert = await storage.resolveAlert(Number(req.params.id));
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json(alert);
  });

  // === DEMO MODE SIMULATION ===
  let demoModeEnabled = true;
  let simulationInterval: NodeJS.Timeout | null = null;

  const startSimulation = () => {
    if (simulationInterval) return;
    simulationInterval = setInterval(async () => {
      if (!demoModeEnabled) return;

      const hr = 70 + Math.floor(Math.random() * 20);
      const spo2 = 96 + Math.floor(Math.random() * 4);
      const contraction = Math.random() * 2.5; // Can go high
      let status = "NORMAL";
      if (contraction > 2.0) status = "HIGH";
      else if (contraction > 1.2) status = "MILD";
      else if (contraction > 0.5) status = "LOW";

      await storage.createReading({
        maternalHeartRate: hr,
        maternalSpo2: spo2,
        maternalTemperature: 36.5 + Math.random(),
        stressLevel: Math.floor(Math.random() * 30),
        contractionLevel: contraction * 10, // scale for UI
        contractionStatus: status,
        fetalMovementCount: Math.floor(Math.random() * 2),
        deviceId: "DEMO_MODE"
      });
    }, 5000); // New reading every 5 seconds
  };

  startSimulation();

  // === SEED DATA ON STARTUP ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getLatestReading();
  if (!existing) {
    console.log("Seeding initial data...");
    
    // Seed some historical data
    const baseTime = new Date().getTime();
    for (let i = 0; i < 20; i++) {
      await storage.createReading({
        maternalHeartRate: 70 + Math.floor(Math.random() * 20),
        maternalSpo2: 96 + Math.floor(Math.random() * 4),
        maternalTemperature: 36.5 + Math.random(),
        stressLevel: Math.floor(Math.random() * 30),
        contractionLevel: Math.random() * 0.5,
        contractionStatus: "NORMAL",
        fetalMovementCount: Math.floor(Math.random() * 3),
        deviceId: "SIMULATOR_01"
      });
    }
  }
}
