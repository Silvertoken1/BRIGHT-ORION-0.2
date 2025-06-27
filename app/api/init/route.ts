import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/database"

export async function GET() {
  try {
    console.log("🔄 Initializing database...")

    await initializeDatabase()

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      adminCredentials: {
        email: process.env.ADMIN_EMAIL || "admin@brightorian.com",
        password: process.env.ADMIN_PASSWORD || "Admin123!",
      },
      testUserCredentials: {
        email: "john.doe@brightorian.com",
        password: "User123!",
      },
    })
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    return NextResponse.json({ error: "Database initialization failed", details: error.message }, { status: 500 })
  }
}
