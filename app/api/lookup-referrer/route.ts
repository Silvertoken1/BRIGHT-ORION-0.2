import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { users } from "@/lib/database"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const referrerId = searchParams.get("id")

    if (!referrerId) {
      return NextResponse.json({ error: "Referrer ID required" }, { status: 400 })
    }

    const user = await db.query.users.findFirst({
      where: eq(users.memberId, referrerId.toUpperCase()),
      columns: {
        id: true,
        memberId: true,
        firstName: true,
        lastName: true,
        status: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Referrer not found" }, { status: 404 })
    }

    if (user.status !== "active") {
      return NextResponse.json({ error: "Referrer account is not active" }, { status: 400 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Lookup referrer error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
