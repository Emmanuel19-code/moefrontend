/* eslint-disable @typescript-eslint/no-explicit-any */
import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transformers = pgTable("transformers", {
  id: serial("id").primaryKey(),
  objectId: integer("object_id").unique(),
  globalId: text("global_id"),
  transformerId: text("transformer_id"),
  
  // Location information
  latitude: real("latitude"),
  longitude: real("longitude"),
  location: text("location"),
  address: text("address"),
  
  // Basic transformer info
  type: text("type"),
  capacity: text("capacity"),
  manufacturer: text("manufacturer"),
  
  // Physical condition
  physicalCondition: text("physical_condition"),
  oilLeakage: boolean("oil_leakage"),
  rustCorrosion: boolean("rust_corrosion"),
  externalDamage: boolean("external_damage"),
  overheatingSigns: boolean("overheating_signs"),
  
  // Components condition
  bushingsCondition: text("bushings_condition"),
  insulatorsCondition: text("insulators_condition"),
  coolingFinsPresent: boolean("cooling_fins_present"),
  coolingFinsState: text("cooling_fins_state"),
  
  // Support structure
  supportStructureType: text("support_structure_type"),
  supportStructureCondition: text("support_structure_condition"),
  
  // Safety and accessibility
  safetySignagePresent: boolean("safety_signage_present"),
  clearanceFromBuildings: text("clearance_from_buildings"),
  accessibilityIssues: boolean("accessibility_issues"),
  unauthorizedConnections: boolean("unauthorized_connections"),
  
  // Metadata
  creationDate: timestamp("creation_date"),
  lastUpdateDate: timestamp("last_update_date"),
  assessmentDate: timestamp("assessment_date"),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  transformerId: integer("transformer_id").references(() => transformers.id),
  type: text("type").notNull(),
  severity: text("severity").notNull(), // critical, warning, info
  message: text("message").notNull(),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(), // hashed
  role: text("role").notNull().default("manager"), // "admin" or "manager"
  companyName: text("company_name"),
  contactNumber: text("contact_number"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  subscriptionType: text("subscription_type").notNull().default("yearly"), // "yearly", "monthly"
  status: text("status").notNull().default("active"), // "active", "cancelled", "expired", "pending"
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date").notNull(),
  paymentMethod: text("payment_method"),
  lastPaymentAmount: integer("last_payment_amount"), // in cents
  lastPaymentDate: timestamp("last_payment_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTransformerSchema = createInsertSchema(transformers).omit({
  id: true,
  creationDate: true,
  lastUpdateDate: true,
}) as unknown as z.ZodType<any, any, any>;

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
}) as unknown as z.ZodType<any, any, any>;

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLoginAt: true,
}) as unknown as z.ZodType<any, any, any>;

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
}) as unknown as z.ZodType<any, any, any>;

export type InsertTransformer = z.infer<typeof insertTransformerSchema>;
export type Transformer = typeof transformers.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;