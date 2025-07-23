import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transformers = pgTable("transformers", {
  id: serial("id").primaryKey(),
  objectId: integer("object_id").unique(),
  globalId: text("global_id"),
  transformerId: text("transformer_id"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  location: text("location"),
  address: text("address"),
  type: text("type"),
  capacity: text("capacity"),
  manufacturer: text("manufacturer"),
  physicalCondition: text("physical_condition"),
  oilLeakage: boolean("oil_leakage"),
  rustCorrosion: boolean("rust_corrosion"),
  externalDamage: boolean("external_damage"),
  overheatingSigns: boolean("overheating_signs"),
  bushingsCondition: text("bushings_condition"),
  insulatorsCondition: text("insulators_condition"),
  coolingFinsPresent: boolean("cooling_fins_present"),
  coolingFinsState: text("cooling_fins_state"),
  supportStructureType: text("support_structure_type"),
  supportStructureCondition: text("support_structure_condition"),
  safetySignagePresent: boolean("safety_signage_present"),
  clearanceFromBuildings: text("clearance_from_buildings"),
  accessibilityIssues: boolean("accessibility_issues"),
  unauthorizedConnections: boolean("unauthorized_connections"),
  creationDate: timestamp("creation_date"),
  lastUpdateDate: timestamp("last_update_date"),
  assessmentDate: timestamp("assessment_date"),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  transformerId: integer("transformer_id").references(() => transformers.id),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  message: text("message").notNull(),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertTransformerSchema = createInsertSchema(transformers).omit({
  id: true,
  creationDate: true,
  lastUpdateDate: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export type InsertTransformer = z.infer<typeof insertTransformerSchema>;
export type Transformer = typeof transformers.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;