
import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const readings = pgTable("readings", {
  id: serial("id").primaryKey(),
  // Maternal Vitals
  maternalHeartRate: integer("maternal_heart_rate").notNull(),
  maternalSpo2: integer("maternal_spo2").notNull(),
  maternalTemperature: real("maternal_temperature"), // Celsius
  stressLevel: integer("stress_level"), // 0-100 scale

  // Pregnancy Specifics
  contractionLevel: real("contraction_level"), // from accelerometer
  contractionStatus: text("contraction_status"), // NORMAL, LOW, MILD, HIGH
  fetalMovementCount: integer("fetal_movement_count"), // Kick count
  fetalHeartRate: integer("fetal_heart_rate"), // if available

  // Metadata
  timestamp: timestamp("timestamp").defaultNow(),
  deviceId: text("device_id"),
  edd: text("edd"), // Estimated Due Date
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  readingId: integer("reading_id").references(() => readings.id),
  type: text("type").notNull(), // 'HIGH_HR', 'LOW_SPO2', 'CONTRACTION_ALERT'
  message: text("message").notNull(),
  severity: text("severity").notNull(), // 'info', 'warning', 'critical'
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertReadingSchema = createInsertSchema(readings).omit({ id: true, timestamp: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Reading = typeof readings.$inferSelect;
export type InsertReading = z.infer<typeof insertReadingSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type ReadingResponse = Reading;
export type AlertResponse = Alert;

// API Request Types
export type CreateReadingRequest = InsertReading;

// API Response Types
export type ReadingsListResponse = Reading[];
export type DashboardStatsResponse = {
  latestReading: Reading | null;
  activeAlerts: Alert[];
  dailyAverages: {
    heartRate: number;
    spo2: number;
  };
};
