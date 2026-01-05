
import { db } from "./db";
import {
  readings,
  alerts,
  type Reading,
  type InsertReading,
  type Alert,
  type InsertAlert,
  type DashboardStatsResponse
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Readings
  createReading(reading: InsertReading): Promise<Reading>;
  getReadings(limit?: number): Promise<Reading[]>;
  getLatestReading(): Promise<Reading | undefined>;
  getDashboardStats(): Promise<DashboardStatsResponse>;
  
  // Alerts
  createAlert(alert: InsertAlert): Promise<Alert>;
  getActiveAlerts(): Promise<Alert[]>;
  resolveAlert(id: number): Promise<Alert | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createReading(reading: InsertReading): Promise<Reading> {
    const [newReading] = await db.insert(readings).values(reading).returning();
    
    // Simple alert logic check
    if (newReading.maternalHeartRate > 120 || newReading.maternalHeartRate < 50) {
      await this.createAlert({
        readingId: newReading.id,
        type: 'ABNORMAL_HR',
        message: `Abnormal Heart Rate detected: ${newReading.maternalHeartRate} bpm`,
        severity: 'warning',
        isResolved: false
      });
    }
    
    if (newReading.maternalSpo2 < 95) {
      await this.createAlert({
        readingId: newReading.id,
        type: 'LOW_SPO2',
        message: `Low SpO2 detected: ${newReading.maternalSpo2}%`,
        severity: 'critical',
        isResolved: false
      });
    }

    if (newReading.contractionStatus === 'HIGH') {
      await this.createAlert({
        readingId: newReading.id,
        type: 'CONTRACTION_ALERT',
        message: `High contraction level detected. Monitor closely.`,
        severity: 'warning',
        isResolved: false
      });
    }

    return newReading;
  }

  async getReadings(limit = 50): Promise<Reading[]> {
    return await db.select()
      .from(readings)
      .orderBy(desc(readings.timestamp))
      .limit(limit);
  }

  async getLatestReading(): Promise<Reading | undefined> {
    const [reading] = await db.select()
      .from(readings)
      .orderBy(desc(readings.timestamp))
      .limit(1);
    return reading;
  }

  async getDashboardStats(): Promise<DashboardStatsResponse> {
    const latestReading = await this.getLatestReading();
    const activeAlerts = await this.getActiveAlerts();
    
    // Calculate daily averages (simplified for last 50 readings for MVP speed)
    const recentReadings = await this.getReadings(50);
    const avgHr = recentReadings.length 
      ? recentReadings.reduce((acc, r) => acc + r.maternalHeartRate, 0) / recentReadings.length 
      : 0;
    const avgSpo2 = recentReadings.length 
      ? recentReadings.reduce((acc, r) => acc + r.maternalSpo2, 0) / recentReadings.length 
      : 0;

    return {
      latestReading: latestReading || null,
      activeAlerts,
      dailyAverages: {
        heartRate: Math.round(avgHr),
        spo2: Math.round(avgSpo2)
      }
    };
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return await db.select()
      .from(alerts)
      .where(eq(alerts.isResolved, false))
      .orderBy(desc(alerts.createdAt));
  }

  async resolveAlert(id: number): Promise<Alert | undefined> {
    const [updated] = await db.update(alerts)
      .set({ isResolved: true })
      .where(eq(alerts.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
