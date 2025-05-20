import { 
  users, systemProfiles, cpuMetrics, memoryMetrics, networkMetrics, 
  batteryMetrics, storageMetrics, processMetrics,
  type User, type InsertUser, 
  type SystemProfile, type InsertSystemProfile,
  type CpuMetrics, type InsertCpuMetrics,
  type MemoryMetrics, type InsertMemoryMetrics,
  type NetworkMetrics, type InsertNetworkMetrics,
  type BatteryMetrics, type InsertBatteryMetrics,
  type StorageMetrics, type InsertStorageMetrics,
  type ProcessMetrics, type InsertProcessMetrics
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // System profile methods
  getSystemProfiles(userId: number): Promise<SystemProfile[]>;
  getSystemProfile(id: number): Promise<SystemProfile | undefined>;
  createSystemProfile(profile: InsertSystemProfile): Promise<SystemProfile>;
  
  // CPU metrics methods
  getCpuMetrics(profileId: number, limit?: number): Promise<CpuMetrics[]>;
  getLatestCpuMetric(profileId: number): Promise<CpuMetrics | undefined>;
  createCpuMetric(metric: InsertCpuMetrics): Promise<CpuMetrics>;
  
  // Memory metrics methods
  getMemoryMetrics(profileId: number, limit?: number): Promise<MemoryMetrics[]>;
  getLatestMemoryMetric(profileId: number): Promise<MemoryMetrics | undefined>;
  createMemoryMetric(metric: InsertMemoryMetrics): Promise<MemoryMetrics>;
  
  // Network metrics methods
  getNetworkMetrics(profileId: number, limit?: number): Promise<NetworkMetrics[]>;
  getLatestNetworkMetric(profileId: number): Promise<NetworkMetrics | undefined>;
  createNetworkMetric(metric: InsertNetworkMetrics): Promise<NetworkMetrics>;
  
  // Battery metrics methods
  getBatteryMetrics(profileId: number, limit?: number): Promise<BatteryMetrics[]>;
  getLatestBatteryMetric(profileId: number): Promise<BatteryMetrics | undefined>;
  createBatteryMetric(metric: InsertBatteryMetrics): Promise<BatteryMetrics>;
  
  // Storage metrics methods
  getStorageMetrics(profileId: number, limit?: number): Promise<StorageMetrics[]>;
  getLatestStorageMetric(profileId: number): Promise<StorageMetrics | undefined>;
  createStorageMetric(metric: InsertStorageMetrics): Promise<StorageMetrics>;
  
  // Process metrics methods
  getProcessMetrics(profileId: number, limit?: number): Promise<ProcessMetrics[]>;
  getLatestProcessMetric(profileId: number): Promise<ProcessMetrics | undefined>;
  createProcessMetric(metric: InsertProcessMetrics): Promise<ProcessMetrics>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // System profile methods
  async getSystemProfiles(userId: number): Promise<SystemProfile[]> {
    return await db.select().from(systemProfiles).where(eq(systemProfiles.userId, userId));
  }
  
  async getSystemProfile(id: number): Promise<SystemProfile | undefined> {
    const [profile] = await db.select().from(systemProfiles).where(eq(systemProfiles.id, id));
    return profile;
  }
  
  async createSystemProfile(profile: InsertSystemProfile): Promise<SystemProfile> {
    const [newProfile] = await db.insert(systemProfiles).values(profile).returning();
    return newProfile;
  }
  
  // CPU metrics methods
  async getCpuMetrics(profileId: number, limit: number = 100): Promise<CpuMetrics[]> {
    return await db
      .select()
      .from(cpuMetrics)
      .where(eq(cpuMetrics.profileId, profileId))
      .orderBy(desc(cpuMetrics.timestamp))
      .limit(limit);
  }
  
  async getLatestCpuMetric(profileId: number): Promise<CpuMetrics | undefined> {
    const [metric] = await db
      .select()
      .from(cpuMetrics)
      .where(eq(cpuMetrics.profileId, profileId))
      .orderBy(desc(cpuMetrics.timestamp))
      .limit(1);
    return metric;
  }
  
  async createCpuMetric(metric: InsertCpuMetrics): Promise<CpuMetrics> {
    const [newMetric] = await db.insert(cpuMetrics).values(metric).returning();
    return newMetric;
  }
  
  // Memory metrics methods
  async getMemoryMetrics(profileId: number, limit: number = 100): Promise<MemoryMetrics[]> {
    return await db
      .select()
      .from(memoryMetrics)
      .where(eq(memoryMetrics.profileId, profileId))
      .orderBy(desc(memoryMetrics.timestamp))
      .limit(limit);
  }
  
  async getLatestMemoryMetric(profileId: number): Promise<MemoryMetrics | undefined> {
    const [metric] = await db
      .select()
      .from(memoryMetrics)
      .where(eq(memoryMetrics.profileId, profileId))
      .orderBy(desc(memoryMetrics.timestamp))
      .limit(1);
    return metric;
  }
  
  async createMemoryMetric(metric: InsertMemoryMetrics): Promise<MemoryMetrics> {
    const [newMetric] = await db.insert(memoryMetrics).values(metric).returning();
    return newMetric;
  }
  
  // Network metrics methods
  async getNetworkMetrics(profileId: number, limit: number = 100): Promise<NetworkMetrics[]> {
    return await db
      .select()
      .from(networkMetrics)
      .where(eq(networkMetrics.profileId, profileId))
      .orderBy(desc(networkMetrics.timestamp))
      .limit(limit);
  }
  
  async getLatestNetworkMetric(profileId: number): Promise<NetworkMetrics | undefined> {
    const [metric] = await db
      .select()
      .from(networkMetrics)
      .where(eq(networkMetrics.profileId, profileId))
      .orderBy(desc(networkMetrics.timestamp))
      .limit(1);
    return metric;
  }
  
  async createNetworkMetric(metric: InsertNetworkMetrics): Promise<NetworkMetrics> {
    const [newMetric] = await db.insert(networkMetrics).values(metric).returning();
    return newMetric;
  }
  
  // Battery metrics methods
  async getBatteryMetrics(profileId: number, limit: number = 100): Promise<BatteryMetrics[]> {
    return await db
      .select()
      .from(batteryMetrics)
      .where(eq(batteryMetrics.profileId, profileId))
      .orderBy(desc(batteryMetrics.timestamp))
      .limit(limit);
  }
  
  async getLatestBatteryMetric(profileId: number): Promise<BatteryMetrics | undefined> {
    const [metric] = await db
      .select()
      .from(batteryMetrics)
      .where(eq(batteryMetrics.profileId, profileId))
      .orderBy(desc(batteryMetrics.timestamp))
      .limit(1);
    return metric;
  }
  
  async createBatteryMetric(metric: InsertBatteryMetrics): Promise<BatteryMetrics> {
    const [newMetric] = await db.insert(batteryMetrics).values(metric).returning();
    return newMetric;
  }
  
  // Storage metrics methods
  async getStorageMetrics(profileId: number, limit: number = 100): Promise<StorageMetrics[]> {
    return await db
      .select()
      .from(storageMetrics)
      .where(eq(storageMetrics.profileId, profileId))
      .orderBy(desc(storageMetrics.timestamp))
      .limit(limit);
  }
  
  async getLatestStorageMetric(profileId: number): Promise<StorageMetrics | undefined> {
    const [metric] = await db
      .select()
      .from(storageMetrics)
      .where(eq(storageMetrics.profileId, profileId))
      .orderBy(desc(storageMetrics.timestamp))
      .limit(1);
    return metric;
  }
  
  async createStorageMetric(metric: InsertStorageMetrics): Promise<StorageMetrics> {
    const [newMetric] = await db.insert(storageMetrics).values(metric).returning();
    return newMetric;
  }
  
  // Process metrics methods
  async getProcessMetrics(profileId: number, limit: number = 100): Promise<ProcessMetrics[]> {
    return await db
      .select()
      .from(processMetrics)
      .where(eq(processMetrics.profileId, profileId))
      .orderBy(desc(processMetrics.timestamp))
      .limit(limit);
  }
  
  async getLatestProcessMetric(profileId: number): Promise<ProcessMetrics | undefined> {
    const [metric] = await db
      .select()
      .from(processMetrics)
      .where(eq(processMetrics.profileId, profileId))
      .orderBy(desc(processMetrics.timestamp))
      .limit(1);
    return metric;
  }
  
  async createProcessMetric(metric: InsertProcessMetrics): Promise<ProcessMetrics> {
    const [newMetric] = await db.insert(processMetrics).values(metric).returning();
    return newMetric;
  }
}

export const storage = new DatabaseStorage();
