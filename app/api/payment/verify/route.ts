import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

const PAYSTACK_SECRET_KEY = "sk_test_e209c65b0c764b0f2e1899f373de682f32ac51a9"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ success: false, message: "Payment reference is required" }, { status: 400 })
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 })
    }

    const paymentData = paystackData.data

    if (paymentData.status !== "success") {
      return NextResponse.json({ success: false, message: "Payment was not successful" }, { status: 400 })
    }

    // Get database connection
    const db = getDatabase()

    // Extract user ID from metadata
    const userId =
      paymentData.metadata?.userId ||
      paymentData.metadata?.custom_fields?.find((field: any) => field.variable_name === "user_id")?.value

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID not found in payment data" }, { status: 400 })
    }

    // Update user status to active
    const updateUserStmt = db.prepare(`
      UPDATE users 
      SET status = 'active', updatedAt = datetime('now')
      WHERE id = ?
    `)
    updateUserStmt.run(userId)

    // Record the payment
    const insertPaymentStmt = db.prepare(`
      INSERT INTO payments (
        userId, reference, amount, currency, status, 
        paymentMethod, transactionId, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `)

    insertPaymentStmt.run(
      userId,
      reference,
      paymentData.amount / 100, // Convert from kobo to naira
      paymentData.currency,
      "completed",
      "paystack",
      paymentData.id,
    )

    // Get updated user data
    const getUserStmt = db.prepare(`
      SELECT id, memberId, firstName, lastName, email, phone, status, role
      FROM users WHERE id = ?
    `)
    const user = getUserStmt.get(userId)

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      user,
      payment: {
        reference,
        amount: paymentData.amount / 100,
        currency: paymentData.currency,
        status: "completed",
      },
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
