import { Transformer, InsertTransformer, Alert, InsertAlert, transformers, alerts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

export const storage = {
  async getTransformers(): Promise<Transformer[]> {
    return await db.select().from(transformers);
  },

  async getTransformer(id: number): Promise<Transformer | undefined> {
    const [row] = await db.select().from(transformers).where(eq(transformers.id, id));
    return row;
  },

  async getTransformerByObjectId(objectId: number): Promise<Transformer | undefined> {
    const [row] = await db.select().from(transformers).where(eq(transformers.objectId, objectId));
    return row;
  },

  async createTransformer(data: InsertTransformer): Promise<Transformer> {
    const [row] = await db.insert(transformers).values(data).returning();
    return row;
  },

  async updateTransformer(id: number, updates: Partial<InsertTransformer>): Promise<Transformer | undefined> {
    const [row] = await db.update(transformers).set(updates).where(eq(transformers.id, id)).returning();
    return row;
  },

  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts);
  },

  async getAlertsByTransformerId(transformerId: number): Promise<Alert[]> {
    return await db.select().from(alerts).where(eq(alerts.transformerId, transformerId));
  },

  async createAlert(data: InsertAlert): Promise<Alert> {
    const [row] = await db.insert(alerts).values(data).returning();
    return row;
  },

  async resolveAlert(id: number): Promise<Alert | undefined> {
    const [row] = await db.update(alerts).set({ isResolved: true, resolvedAt: new Date() }).where(eq(alerts.id, id)).returning();
    return row;
  },

  async getTransformerStats(): Promise<{
    total: number;
    good: number;
    fair: number;
    poor: number;
    critical: number;
  }> {
    const rows = await db.select().from(transformers);
    const total = rows.length;
    const good = rows.filter(r => r.physicalCondition === "Good").length;
    const fair = rows.filter(r => r.physicalCondition === "Fair").length;
    const poor = rows.filter(r => r.physicalCondition === "Poor").length;
    const critical = rows.filter(r => r.oilLeakage || r.overheatingSigns || r.unauthorizedConnections).length;
    return { total, good, fair, poor, critical };
  },
};