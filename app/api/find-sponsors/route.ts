import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { users } from "@/lib/database"
import { eq, and, like } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const { location, interests } = await request.json()

    // Find active sponsors based on location and other criteria
    const whereConditions = [eq(users.status, "active"), eq(users.role, "user")]

    // Add location filter if provided
    if (location) {
      whereConditions.push(like(users.location, `%${location}%`))
    }

    const sponsors = await db.query.users.findMany({
      where: and(...whereConditions),
      columns: {
        id: true,
        memberId: true,
        firstName: true,
        lastName: true,
        location: true,
        totalReferrals: true,
        createdAt: true,
      },
      limit: 10,
      orderBy: (users, { desc }) => [desc(users.totalReferrals)], // Prioritize active sponsors
    })

    // If no location-based sponsors found, get general active sponsors
    if (sponsors.length === 0) {
      const generalSponsors = await db.query.users.findMany({
        where: and(eq(users.status, "active"), eq(users.role, "user")),
        columns: {
          id: true,
          memberId: true,
          firstName: true,
          lastName: true,
          location: true,
          totalReferrals: true,
          createdAt: true,
        },
        limit: 5,
        orderBy: (users, { desc }) => [desc(users.totalReferrals)],
      })

      return NextResponse.json({ sponsors: generalSponsors })
    }

    return NextResponse.json({ sponsors })
  } catch (error) {
    console.error("Find sponsors error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
