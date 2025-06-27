import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Get the database URL from environment variables
const sql = neon(process.env.DATABASE_URL!)

// Create the database instance
export const db = drizzle(sql, { schema })

// Test database connection
export async function testNeonConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    console.log("✅ Neon database connected successfully!")
    return true
  } catch (error) {
    console.error("❌ Neon database connection failed:", error)
    return false
  }
}

// Initialize Neon database with tables and data
export async function initializeNeonDatabase() {
  try {
    console.log("🚀 Starting Neon database initialization...")

    // Test connection first
    const connected = await testNeonConnection()
    if (!connected) {
      throw new Error("Database connection failed")
    }

    // Create tables
    await createNeonTables()

    // Create admin user
    await createAdminUser()

    // Create test user
    await createTestUser()

    // Create system settings
    await createSystemSettings()

    // Create sample data
    await createSampleData()

    console.log("🎉 Neon database initialization completed!")

    return {
      success: true,
      message: "Neon database initialized successfully",
      adminCredentials: {
        email: "admin@brightorian.com",
        password: "BrightAdmin2024!",
      },
      userCredentials: {
        email: "user@brightorian.com",
        password: "BrightUser2024!",
      },
    }
  } catch (error) {
    console.error("❌ Neon database initialization failed:", error)
    throw error
  }
}

async function createNeonTables() {
  console.log("📋 Creating Neon database tables...")

  // Create users table
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      member_id VARCHAR(50) UNIQUE NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      sponsor_id VARCHAR(50),
      upline_id VARCHAR(50),
      status VARCHAR(20) DEFAULT 'pending' NOT NULL,
      role VARCHAR(20) DEFAULT 'user' NOT NULL,
      balance DECIMAL(15,2) DEFAULT 0 NOT NULL,
      total_earnings DECIMAL(15,2) DEFAULT 0 NOT NULL,
      activation_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `

  // Create activation_pins table
  await sql`
    CREATE TABLE IF NOT EXISTS activation_pins (
      id SERIAL PRIMARY KEY,
      pin VARCHAR(20) UNIQUE NOT NULL,
      status VARCHAR(20) DEFAULT 'available' NOT NULL,
      generated_by VARCHAR(50) NOT NULL,
      used_by VARCHAR(50),
      custom_for VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      used_at TIMESTAMP
    )
  `

  // Create commissions table
  await sql`
    CREATE TABLE IF NOT EXISTS commissions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      from_user_id VARCHAR(50) NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      level INTEGER NOT NULL,
      type VARCHAR(50) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `

  // Create withdrawals table
  await sql`
    CREATE TABLE IF NOT EXISTS withdrawals (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      bank_name VARCHAR(100) NOT NULL,
      account_number VARCHAR(20) NOT NULL,
      account_name VARCHAR(100) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' NOT NULL,
      processed_by VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      processed_at TIMESTAMP
    )
  `

  // Create system_settings table
  await sql`
    CREATE TABLE IF NOT EXISTS system_settings (
      id SERIAL PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `

  // Create transactions table
  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      type VARCHAR(50) NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      description TEXT NOT NULL,
      reference VARCHAR(100),
      status VARCHAR(20) DEFAULT 'completed' NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `

  console.log("✅ All Neon tables created successfully!")
}

async function createAdminUser() {
  console.log("👤 Creating admin user...")

  const bcrypt = await import("bcryptjs")
  const hashedPassword = await bcrypt.hash("BrightAdmin2024!", 12)

  await sql`
    INSERT INTO users (
      member_id, first_name, last_name, email, phone,
      password_hash, status, role, activation_date, balance, total_earnings
    ) VALUES (
      'BO000001', 'System', 'Administrator', 'admin@brightorian.com', '+2348123456789',
      ${hashedPassword}, 'active', 'admin', CURRENT_TIMESTAMP, 0, 0
    )
    ON CONFLICT (email) DO NOTHING
  `

  console.log("✅ Admin user created!")
}

async function createTestUser() {
  console.log("👤 Creating test user...")

  const bcrypt = await import("bcryptjs")
  const hashedPassword = await bcrypt.hash("BrightUser2024!", 12)

  await sql`
    INSERT INTO users (
      member_id, first_name, last_name, email, phone,
      password_hash, sponsor_id, upline_id, status, role, 
      activation_date, balance, total_earnings
    ) VALUES (
      'BO000002', 'John', 'Doe', 'user@brightorian.com', '+2348987654321',
      ${hashedPassword}, 'BO000001', 'BO000001', 'active', 'user',
      CURRENT_TIMESTAMP, 25000, 45000
    )
    ON CONFLICT (email) DO NOTHING
  `

  console.log("✅ Test user created!")
}

async function createSystemSettings() {
  console.log("⚙️ Creating system settings...")

  const settings = [
    ["package_price", "36000"],
    ["min_withdrawal", "5000"],
    ["level_1_commission", "4000"],
    ["level_2_commission", "2000"],
    ["level_3_commission", "2000"],
    ["level_4_commission", "1500"],
    ["level_5_commission", "1500"],
    ["level_6_commission", "1500"],
    ["max_matrix_levels", "6"],
    ["referrals_per_level", "5"],
    ["company_name", "Bright Orion"],
    ["company_email", "info@brightorian.com"],
    ["company_phone", "+2348000000000"],
  ]

  for (const [key, value] of settings) {
    await sql`
      INSERT INTO system_settings (setting_key, setting_value)
      VALUES (${key}, ${value})
      ON CONFLICT (setting_key) DO NOTHING
    `
  }

  console.log("✅ System settings created!")
}

async function createSampleData() {
  console.log("📊 Creating sample data...")

  // Create sample PINs
  const samplePins = ["PIN123456", "PIN789012", "PIN345678", "PIN901234", "PIN567890"]

  for (const pin of samplePins) {
    await sql`
      INSERT INTO activation_pins (pin, status, generated_by)
      VALUES (${pin}, 'available', 'BO000001')
      ON CONFLICT (pin) DO NOTHING
    `
  }

  // Create sample commissions
  const commissions = [
    ["BO000002", "BO000003", 4000, 1, "referral", "approved"],
    ["BO000002", "BO000004", 2000, 2, "referral", "approved"],
    ["BO000002", "BO000005", 2000, 3, "referral", "pending"],
    ["BO000002", "BO000006", 1500, 4, "referral", "pending"],
  ]

  for (const [userId, fromUserId, amount, level, type, status] of commissions) {
    await sql`
      INSERT INTO commissions (user_id, from_user_id, amount, level, type, status)
      VALUES (${userId}, ${fromUserId}, ${amount}, ${level}, ${type}, ${status})
    `
  }

  // Create sample transactions
  const transactions = [
    ["BO000002", "commission", 4000, "Level 1 Commission from BO000003", "COM001"],
    ["BO000002", "commission", 2000, "Level 2 Commission from BO000004", "COM002"],
    ["BO000002", "withdrawal", -5000, "Bank Transfer to GTBank", "WTH001"],
    ["BO000002", "bonus", 1000, "Monthly Performance Bonus", "BON001"],
  ]

  for (const [userId, type, amount, description, reference] of transactions) {
    await sql`
      INSERT INTO transactions (user_id, type, amount, description, reference)
      VALUES (${userId}, ${type}, ${amount}, ${description}, ${reference})
    `
  }

  console.log("✅ Sample data created!")
}
