import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, real, foreignKey, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  systemProfiles: many(systemProfiles),
}));

// System Profiles table
export const systemProfiles = pgTable("system_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  hostname: text("hostname").notNull(),
  osName: text("os_name").notNull(),
  osVersion: text("os_version").notNull(),
  osArch: text("os_arch").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const systemProfilesRelations = relations(systemProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [systemProfiles.userId],
    references: [users.id],
  }),
  cpuMetrics: many(cpuMetrics),
  memoryMetrics: many(memoryMetrics),
  networkMetrics: many(networkMetrics),
  batteryMetrics: many(batteryMetrics),
}));

// CPU Metrics table
export const cpuMetrics = pgTable("cpu_metrics", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => systemProfiles.id).notNull(),
  usage: real("usage").notNull(),
  cores: integer("cores").notNull(),
  threads: integer("threads").notNull(),
  speed: text("speed").notNull(),
  model: text("model"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const cpuMetricsRelations = relations(cpuMetrics, ({ one }) => ({
  profile: one(systemProfiles, {
    fields: [cpuMetrics.profileId],
    references: [systemProfiles.id],
  }),
}));

// Memory Metrics table
export const memoryMetrics = pgTable("memory_metrics", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => systemProfiles.id).notNull(),
  usedPercentage: real("used_percentage").notNull(),
  used: text("used").notNull(),
  total: text("total").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const memoryMetricsRelations = relations(memoryMetrics, ({ one }) => ({
  profile: one(systemProfiles, {
    fields: [memoryMetrics.profileId],
    references: [systemProfiles.id],
  }),
}));

// Network Metrics table
export const networkMetrics = pgTable("network_metrics", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => systemProfiles.id).notNull(),
  status: text("status").notNull(),
  download: text("download").notNull(),
  upload: text("upload").notNull(),
  ip: text("ip").notNull(),
  interfaces: jsonb("interfaces"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const networkMetricsRelations = relations(networkMetrics, ({ one }) => ({
  profile: one(systemProfiles, {
    fields: [networkMetrics.profileId],
    references: [systemProfiles.id],
  }),
}));

// Battery Metrics table
export const batteryMetrics = pgTable("battery_metrics", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => systemProfiles.id).notNull(),
  level: real("level").notNull(),
  status: text("status").notNull(),
  timeRemaining: text("time_remaining"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const batteryMetricsRelations = relations(batteryMetrics, ({ one }) => ({
  profile: one(systemProfiles, {
    fields: [batteryMetrics.profileId],
    references: [systemProfiles.id],
  }),
}));

// Storage Metrics table
export const storageMetrics = pgTable("storage_metrics", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => systemProfiles.id).notNull(),
  devices: jsonb("devices").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const storageMetricsRelations = relations(storageMetrics, ({ one }) => ({
  profile: one(systemProfiles, {
    fields: [storageMetrics.profileId],
    references: [systemProfiles.id],
  }),
}));

// Process Metrics table
export const processMetrics = pgTable("process_metrics", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => systemProfiles.id).notNull(),
  processes: jsonb("processes").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const processMetricsRelations = relations(processMetrics, ({ one }) => ({
  profile: one(systemProfiles, {
    fields: [processMetrics.profileId],
    references: [systemProfiles.id],
  }),
}));

// Export insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSystemProfileSchema = createInsertSchema(systemProfiles).pick({
  userId: true,
  name: true,
  hostname: true,
  osName: true,
  osVersion: true,
  osArch: true,
});

export const insertCpuMetricsSchema = createInsertSchema(cpuMetrics).pick({
  profileId: true,
  usage: true,
  cores: true,
  threads: true,
  speed: true,
  model: true,
});

export const insertMemoryMetricsSchema = createInsertSchema(memoryMetrics).pick({
  profileId: true,
  usedPercentage: true,
  used: true,
  total: true,
});

export const insertNetworkMetricsSchema = createInsertSchema(networkMetrics).pick({
  profileId: true,
  status: true,
  download: true,
  upload: true,
  ip: true,
  interfaces: true,
});

export const insertBatteryMetricsSchema = createInsertSchema(batteryMetrics).pick({
  profileId: true,
  level: true,
  status: true,
  timeRemaining: true,
});

export const insertStorageMetricsSchema = createInsertSchema(storageMetrics).pick({
  profileId: true,
  devices: true,
});

export const insertProcessMetricsSchema = createInsertSchema(processMetrics).pick({
  profileId: true,
  processes: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSystemProfile = z.infer<typeof insertSystemProfileSchema>;
export type SystemProfile = typeof systemProfiles.$inferSelect;

export type InsertCpuMetrics = z.infer<typeof insertCpuMetricsSchema>;
export type CpuMetrics = typeof cpuMetrics.$inferSelect;

export type InsertMemoryMetrics = z.infer<typeof insertMemoryMetricsSchema>;
export type MemoryMetrics = typeof memoryMetrics.$inferSelect;

export type InsertNetworkMetrics = z.infer<typeof insertNetworkMetricsSchema>;
export type NetworkMetrics = typeof networkMetrics.$inferSelect;

export type InsertBatteryMetrics = z.infer<typeof insertBatteryMetricsSchema>;
export type BatteryMetrics = typeof batteryMetrics.$inferSelect;

export type InsertStorageMetrics = z.infer<typeof insertStorageMetricsSchema>;
export type StorageMetrics = typeof storageMetrics.$inferSelect;

export type InsertProcessMetrics = z.infer<typeof insertProcessMetricsSchema>;
export type ProcessMetrics = typeof processMetrics.$inferSelect;
