import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/database"
import { users } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt))

    // Remove password hashes from response
    const safeUsers = allUsers.map(({ passwordHash, ...user }) => user)

    return NextResponse.json({ users: safeUsers })
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
