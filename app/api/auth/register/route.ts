import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { users, activationPins } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { fullName, email, phone, password, sponsorId, uplineId, pin, location, pinMethod, packagePrice } = data

    // Validate required fields
    if (!fullName || !email || !phone || !password || !sponsorId || !uplineId) {
      return NextResponse.json({ success: false, message: "All required fields must be filled" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = users.findByEmail(email)
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email address is already registered" }, { status: 400 })
    }

    // Validate sponsor exists
    const sponsor = users.findByMemberId(sponsorId)
    if (!sponsor) {
      return NextResponse.json(
        { success: false, message: "Invalid sponsor ID. Please check and try again." },
        { status: 400 },
      )
    }

    // Validate upline exists
    const upline = users.findByMemberId(uplineId)
    if (!upline) {
      return NextResponse.json(
        { success: false, message: "Invalid upline ID. Please check and try again." },
        { status: 400 },
      )
    }

    // Validate PIN if using existing PIN method
    if (pinMethod === "existing") {
      if (!pin) {
        return NextResponse.json({ success: false, message: "Registration PIN is required" }, { status: 400 })
      }

      const validPin = activationPins.findUnused(pin)
      if (!validPin) {
        return NextResponse.json({ success: false, message: "Invalid or already used PIN" }, { status: 400 })
      }
    }

    // Generate member ID
    const memberIdNum = Math.floor(Math.random() * 900000) + 100000
    const memberId = `BO${memberIdNum}`

    // Check if member ID already exists (very unlikely but just in case)
    const existingMemberId = users.findByMemberId(memberId)
    if (existingMemberId) {
      return NextResponse.json({ success: false, message: "Registration failed. Please try again." }, { status: 500 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Split full name
    const nameParts = fullName.trim().split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || firstName

    // Create user data
    const userData = {
      memberId,
      firstName,
      lastName,
      fullName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      sponsorId,
      uplineId,
      location: location || "",
      packageType: "starter",
    }

    // Create user
    const result = users.create(userData)

    if (result.lastInsertRowid) {
      // Mark PIN as used if using existing PIN
      if (pinMethod === "existing" && pin) {
        activationPins.markAsUsed(pin, memberId)
      }

      // Return user data for payment processing
      const newUser = {
        id: result.lastInsertRowid,
        memberId,
        firstName,
        lastName,
        fullName,
        email: email.toLowerCase(),
        phone,
        sponsorId,
        uplineId,
        location,
        packageType: "starter",
        status: "pending",
      }

      return NextResponse.json({
        success: true,
        message:
          pinMethod === "new"
            ? "Registration successful! Complete payment to receive your PIN and activate your account."
            : "Registration successful! Complete payment to activate your account.",
        user: newUser,
      })
    } else {
      return NextResponse.json({ success: false, message: "Failed to create user account" }, { status: 500 })
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Internal server error. Please try again." }, { status: 500 })
  }
}
