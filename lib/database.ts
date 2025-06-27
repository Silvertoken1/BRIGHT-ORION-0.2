import Database from "better-sqlite3"
import path from "path"
import fs from "fs"
import bcrypt from "bcryptjs"

let databaseInstance: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (!databaseInstance) {
    const dbPath =
      process.env.NODE_ENV === "production" ? "/tmp/bright-orion.db" : path.join(process.cwd(), "bright-orion.db")

    // Ensure directory exists
    const dbDir = path.dirname(dbPath)
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }

    databaseInstance = new Database(dbPath)
    databaseInstance.pragma("journal_mode = WAL")
    databaseInstance.pragma("foreign_keys = ON")

    initializeTables()
  }
  return databaseInstance
}

function initializeTables() {
  if (!databaseInstance) return

  // Users table
  databaseInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memberId TEXT UNIQUE NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      fullName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      sponsorId TEXT,
      uplineId TEXT,
      location TEXT,
      status TEXT DEFAULT 'pending',
      role TEXT DEFAULT 'user',
      packageType TEXT DEFAULT 'starter',
      totalEarnings REAL DEFAULT 0,
      availableBalance REAL DEFAULT 0,
      totalReferrals INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Activation PINs table
  databaseInstance.exec(`
    CREATE TABLE IF NOT EXISTS activationPins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pin TEXT UNIQUE NOT NULL,
      isUsed BOOLEAN DEFAULT FALSE,
      usedBy TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      usedAt DATETIME
    )
  `)

  // Payments table
  databaseInstance.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      reference TEXT UNIQUE NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'NGN',
      status TEXT DEFAULT 'pending',
      paymentMethod TEXT DEFAULT 'paystack',
      transactionId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `)

  // Commissions table
  databaseInstance.exec(`
    CREATE TABLE IF NOT EXISTS commissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      fromUserId INTEGER NOT NULL,
      level INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT DEFAULT 'referral',
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id),
      FOREIGN KEY (fromUserId) REFERENCES users (id)
    )
  `)

  // Matrix positions table
  databaseInstance.exec(`
    CREATE TABLE IF NOT EXISTS matrixPositions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      uplineId INTEGER,
      level INTEGER NOT NULL,
      position INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id),
      FOREIGN KEY (uplineId) REFERENCES users (id)
    )
  `)

  // Stockists table
  databaseInstance.exec(`
    CREATE TABLE IF NOT EXISTS stockists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      businessName TEXT NOT NULL,
      businessAddress TEXT NOT NULL,
      businessPhone TEXT NOT NULL,
      businessEmail TEXT NOT NULL,
      bankName TEXT NOT NULL,
      accountNumber TEXT NOT NULL,
      accountName TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      totalSales REAL DEFAULT 0,
      commission REAL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `)

  // Stockist transactions table
  databaseInstance.exec(`
    CREATE TABLE IF NOT EXISTS stockistTransactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stockistId INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'completed',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stockistId) REFERENCES stockists (id)
    )
  `)

  console.log("Database tables initialized successfully")
}

// User management functions
export const users = {
  create: (userData: any) => {
    const db = getDatabase()
    const stmt = db.prepare(`
      INSERT INTO users (
        memberId, firstName, lastName, fullName, email, phone, 
        password, sponsorId, uplineId, location, packageType
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      userData.memberId,
      userData.firstName,
      userData.lastName,
      userData.fullName,
      userData.email,
      userData.phone,
      userData.password,
      userData.sponsorId,
      userData.uplineId,
      userData.location,
      userData.packageType,
    )
  },

  findByEmail: (email: string) => {
    const db = getDatabase()
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?")
    return stmt.get(email)
  },

  findByMemberId: (memberId: string) => {
    const db = getDatabase()
    const stmt = db.prepare("SELECT * FROM users WHERE memberId = ?")
    return stmt.get(memberId)
  },

  findById: (id: number) => {
    const db = getDatabase()
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?")
    return stmt.get(id)
  },

  updateStatus: (id: number, status: string) => {
    const db = getDatabase()
    const stmt = db.prepare("UPDATE users SET status = ?, updatedAt = datetime('now') WHERE id = ?")
    return stmt.run(status, id)
  },

  getAll: () => {
    const db = getDatabase()
    const stmt = db.prepare("SELECT * FROM users ORDER BY createdAt DESC")
    return stmt.all()
  },
}

// Activation PIN management
export const activationPins = {
  create: (pin: string) => {
    const db = getDatabase()
    const stmt = db.prepare("INSERT INTO activationPins (pin) VALUES (?)")
    return stmt.run(pin)
  },

  findUnused: (pin: string) => {
    const db = getDatabase()
    const stmt = db.prepare("SELECT * FROM activationPins WHERE pin = ? AND isUsed = FALSE")
    return stmt.get(pin)
  },

  markAsUsed: (pin: string, userId: string) => {
    const db = getDatabase()
    const stmt = db.prepare(`
      UPDATE activationPins 
      SET isUsed = TRUE, usedBy = ?, usedAt = datetime('now') 
      WHERE pin = ?
    `)
    return stmt.run(userId, pin)
  },

  generateBatch: (count: number) => {
    const db = getDatabase()
    const pins = []
    const stmt = db.prepare("INSERT INTO activationPins (pin) VALUES (?)")

    for (let i = 0; i < count; i++) {
      const pin = `BO${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      stmt.run(pin)
      pins.push(pin)
    }

    return pins
  },

  getAll: () => {
    const db = getDatabase()
    const stmt = db.prepare("SELECT * FROM activationPins ORDER BY createdAt DESC")
    return stmt.all()
  },
}

// Payment management
export const payments = {
  create: (paymentData: any) => {
    const db = getDatabase()
    const stmt = db.prepare(`
      INSERT INTO payments (userId, reference, amount, currency, status, paymentMethod, transactionId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      paymentData.userId,
      paymentData.reference,
      paymentData.amount,
      paymentData.currency,
      paymentData.status,
      paymentData.paymentMethod,
      paymentData.transactionId,
    )
  },

  findByReference: (reference: string) => {
    const db = getDatabase()
    const stmt = db.prepare("SELECT * FROM payments WHERE reference = ?")
    return stmt.get(reference)
  },

  updateStatus: (reference: string, status: string) => {
    const db = getDatabase()
    const stmt = db.prepare("UPDATE payments SET status = ? WHERE reference = ?")
    return stmt.run(status, reference)
  },

  getByUserId: (userId: number) => {
    const db = getDatabase()
    const stmt = db.prepare("SELECT * FROM payments WHERE userId = ? ORDER BY createdAt DESC")
    return stmt.all(userId)
  },
}

// Get user statistics
export function getUserStats(userId: number) {
  const db = getDatabase()

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId)
  const totalReferrals = db.prepare("SELECT COUNT(*) as count FROM users WHERE sponsorId = ?").get(user?.memberId)
  const totalEarnings = db
    .prepare("SELECT SUM(amount) as total FROM commissions WHERE userId = ? AND status = 'approved'")
    .get(userId)
  const pendingCommissions = db
    .prepare("SELECT SUM(amount) as total FROM commissions WHERE userId = ? AND status = 'pending'")
    .get(userId)

  return {
    user,
    totalReferrals: totalReferrals?.count || 0,
    totalEarnings: totalEarnings?.total || 0,
    pendingCommissions: pendingCommissions?.total || 0,
  }
}

// Initialize admin user and sample data
export function initializeAdminUser() {
  const db = getDatabase()

  // Check if admin exists
  const adminExists = db.prepare("SELECT * FROM users WHERE email = ?").get("admin@brightorian.com")

  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync("Admin123!", 10)

    // Create admin user
    db.prepare(`
      INSERT INTO users (
        memberId, firstName, lastName, fullName, email, phone, 
        password, status, role, packageType
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      "BO000001",
      "Admin",
      "User",
      "Admin User",
      "admin@brightorian.com",
      "+2348123456789",
      hashedPassword,
      "active",
      "admin",
      "starter",
    )

    console.log("Admin user created successfully")
  }

  // Generate initial PINs if none exist
  const pinCount = db.prepare("SELECT COUNT(*) as count FROM activationPins").get()
  if (pinCount?.count === 0) {
    activationPins.generateBatch(100)
    console.log("Initial activation PINs generated")
  }
}

// Export the database instance and table references for compatibility
export const dbInstance = getDatabase()

// Initialize database when module is loaded
if (typeof window === "undefined") {
  // Only run on server side
  try {
    getDatabase()
    initializeAdminUser()
  } catch (error) {
    console.error("Database initialization error:", error)
  }
}
