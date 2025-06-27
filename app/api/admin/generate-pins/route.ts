import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { count } = await request.json()

    if (!count || count < 1 || count > 100) {
      return NextResponse.json({ error: "Invalid PIN count (1-100)" }, { status: 400 })
    }

    // Generate PINs
    const sqliteInstance = (db as any)._.session
    const generatedPins = []

    for (let i = 0; i < count; i++) {
      // Generate unique PIN
      const pin = `PIN${Math.random().toString(36).substr(2, 6).toUpperCase()}`

      try {
        sqliteInstance
          .prepare("INSERT INTO activation_pins (pin, status, generated_by) VALUES (?, ?, ?)")
          .run(pin, "available", decoded.userId)

        generatedPins.push(pin)
      } catch (error) {
        // Skip if PIN already exists (very rare)
        console.log("PIN already exists, skipping:", pin)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${generatedPins.length} PINs successfully`,
      pins: generatedPins,
    })
  } catch (error) {
    console.error("Generate PINs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
