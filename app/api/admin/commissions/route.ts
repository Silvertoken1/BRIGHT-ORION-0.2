import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/database"
import { commissions, users } from "@/lib/db/schema"
import { desc, eq, count, sum } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all commissions with user details
    const allCommissions = await db
      .select({
        id: commissions.id,
        userId: commissions.userId,
        fromUserId: commissions.fromUserId,
        amount: commissions.amount,
        level: commissions.level,
        commissionType: commissions.commissionType,
        status: commissions.status,
        createdAt: commissions.createdAt,
        approvedAt: commissions.approvedAt,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
          memberId: users.memberId,
          email: users.email,
        },
      })
      .from(commissions)
      .leftJoin(users, eq(commissions.userId, users.id))
      .orderBy(desc(commissions.createdAt))

    // Get stats
    const totalCommissions = await db.select({ count: count() }).from(commissions)
    const pendingCommissions = await db
      .select({ count: count() })
      .from(commissions)
      .where(eq(commissions.status, "pending"))
    const approvedCommissions = await db
      .select({ count: count() })
      .from(commissions)
      .where(eq(commissions.status, "approved"))
    const totalAmount = await db.select({ total: sum(commissions.amount) }).from(commissions)
    const pendingAmount = await db
      .select({ total: sum(commissions.amount) })
      .from(commissions)
      .where(eq(commissions.status, "pending"))

    const stats = {
      total: totalCommissions[0]?.count || 0,
      pending: pendingCommissions[0]?.count || 0,
      approved: approvedCommissions[0]?.count || 0,
      totalAmount: totalAmount[0]?.total || 0,
      pendingAmount: pendingAmount[0]?.total || 0,
    }

    return NextResponse.json({
      commissions: allCommissions,
      stats,
    })
  } catch (error) {
    console.error("Commissions fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
