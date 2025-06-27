import { type NextRequest, NextResponse } from "next/server"

const PAYSTACK_SECRET_KEY = "sk_test_e209c65b0c764b0f2e1899f373de682f32ac51a9"

export async function POST(request: NextRequest) {
  try {
    const { email, amount, userId, packageType } = await request.json()

    if (!email || !amount || !userId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Initialize payment with Paystack
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount, // Amount in kobo
        currency: "NGN",
        reference: `BO_${userId}_${Date.now()}`,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/success`,
        metadata: {
          userId,
          packageType,
          custom_fields: [
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: userId,
            },
            {
              display_name: "Package Type",
              variable_name: "package_type",
              value: packageType,
            },
          ],
        },
      }),
    })

    const paystackData = await paystackResponse.json()

    if (paystackData.status) {
      return NextResponse.json({
        success: true,
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      })
    } else {
      return NextResponse.json(
        { success: false, message: paystackData.message || "Payment initialization failed" },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
