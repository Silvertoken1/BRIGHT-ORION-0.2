import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memberId: text("member_id").unique().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique().notNull(),
  phone: text("phone").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("user").notNull(),
  status: text("status").default("pending").notNull(),
  sponsorId: text("sponsor_id"),
  uplineId: text("upline_id"),
  location: text("location"),
  level: integer("level").default(1),
  position: integer("position").default(1),
  packageType: text("package_type").default("starter"),
  paymentStatus: text("payment_status").default("pending"),
  totalEarnings: real("total_earnings").default(0),
  availableBalance: real("available_balance").default(0),
  totalReferrals: integer("total_referrals").default(0),
  activationDate: text("activation_date"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

// Activation PINs table
export const activationPins = sqliteTable("activation_pins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pin: text("pin").unique().notNull(),
  isUsed: integer("is_used", { mode: "boolean" }).default(false),
  usedBy: integer("used_by"),
  createdBy: integer("created_by").notNull(),
  usedAt: text("used_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
})

// Payments table
export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").default("NGN"),
  paymentMethod: text("payment_method").default("paystack"),
  reference: text("reference").unique().notNull(),
  status: text("status").default("pending"),
  metadata: text("metadata"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

// Commissions table
export const commissions = sqliteTable("commissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  fromUserId: integer("from_user_id").notNull(),
  amount: real("amount").notNull(),
  level: integer("level").notNull(),
  commissionType: text("commission_type").notNull(),
  status: text("status").default("pending"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  approvedAt: text("approved_at"),
})

// System settings table
export const systemSettings = sqliteTable("system_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  settingKey: text("setting_key").unique().notNull(),
  settingValue: text("setting_value").notNull(),
  description: text("description"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

// Stockists table
export const stockists = sqliteTable("stockists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  state: text("state").notNull(),
  lga: text("lga").notNull(),
  status: text("status").default("pending"),
  stockLevel: integer("stock_level").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
})

// Export helper functions
export { sql, eq, and, or, desc, asc, count, sum } from "drizzle-orm"
