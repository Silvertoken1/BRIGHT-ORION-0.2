import { type NextRequest, NextResponse } from "next/server"
import { getUserByMemberId, getUserStats } from "@/lib/database"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    console.log("👤 Profile request started...")

    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    console.log("✅ Token verified for user:", decoded.email)

    // Get user profile
    const user = await getUserByMemberId(decoded.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user statistics
    const stats = await getUserStats(user.member_id)

    console.log("✅ Profile data retrieved for user:", user.email)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        memberId: user.member_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.role,
        activationDate: user.activation_date,
      },
      stats,
    })
  } catch (error) {
    console.error("❌ Profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
