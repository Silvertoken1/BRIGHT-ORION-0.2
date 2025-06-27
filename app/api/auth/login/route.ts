import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/database"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Login attempt started...")

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("👤 Looking for user:", email)

    // Get user from database
    const user = getUserByEmail(email.toLowerCase())

    if (!user) {
      console.log("❌ User not found:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log("✅ User found:", user.email)

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      console.log("❌ Invalid password for user:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log("✅ Password verified for user:", email)

    // Create token
    const token = generateToken({
      userId: user.id,
      memberId: user.member_id,
      email: user.email,
      role: user.role,
    })

    console.log("✅ Token generated for user:", email)

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        memberId: user.member_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      redirectUrl: user.role === "admin" ? "/admin" : "/dashboard",
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    console.log("🎉 Login successful for user:", email)
    return response
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
