"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, ArrowRight, Home, User } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("pending")
  const [paymentData, setPaymentData] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference")

      if (!reference) {
        setPaymentStatus("failed")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/payment/verify?reference=${reference}`)
        const result = await response.json()

        if (response.ok && result.success) {
          setPaymentStatus("success")
          setPaymentData(result.payment)
          setUserData(result.user)

          // Store user data in localStorage for login
          localStorage.setItem("auth-token", "verified")
          localStorage.setItem("user-data", JSON.stringify(result.user))

          // Clear pending user data
          localStorage.removeItem("pending_user")
          localStorage.removeItem("package_info")
        } else {
          setPaymentStatus("failed")
        }
      } catch (error) {
        console.error("Payment verification error:", error)
        setPaymentStatus("failed")
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066E0] mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {paymentStatus === "success" ? (
          <>
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-lg text-gray-600">Welcome to Bright Orion! Your account is now active.</p>
            </div>

            {/* Success Details */}
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-green-700">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Account Activated Successfully
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Information */}
                {userData && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Your Account Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">
                          {userData.firstName} {userData.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium">{userData.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Member ID:</span>
                        <Badge variant="outline" className="ml-2">
                          {userData.memberId}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <Badge className="ml-2 bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Information */}
                {paymentData && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-3">Payment Details</h3>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="ml-2 font-bold text-blue-700">{formatCurrency(paymentData.amount)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Reference:</span>
                        <span className="ml-2 font-mono text-xs">{paymentData.reference}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <Badge className="ml-2 bg-green-100 text-green-800">Completed</Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Currency:</span>
                        <span className="ml-2">{paymentData.currency}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-3">What's Next?</h3>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600" />
                      Your account is now active and ready to use
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600" />
                      You can start building your network immediately
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600" />
                      Access your dashboard to track earnings and referrals
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600" />
                      Share your referral link to start earning commissions
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGoToDashboard}
                className="flex-1 bg-[#0066E0] hover:bg-[#0054c2] text-white py-3 text-lg"
                size="lg"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="flex-1 py-3 text-lg bg-transparent" size="lg">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Failed Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-lg text-gray-600">There was an issue processing your payment.</p>
            </div>

            {/* Failed Details */}
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Payment Not Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-red-700 mb-3">Your payment could not be processed. This could be due to:</p>
                  <ul className="space-y-1 text-sm text-red-600">
                    <li>• Insufficient funds in your account</li>
                    <li>• Network connectivity issues</li>
                    <li>• Payment was cancelled</li>
                    <li>• Invalid payment details</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-700 text-sm">
                    <strong>Don't worry!</strong> Your registration information has been saved. You can try the payment
                    process again or contact our support team for assistance.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push("/payment")}
                className="flex-1 bg-[#0066E0] hover:bg-[#0054c2] text-white py-3 text-lg"
                size="lg"
              >
                Try Payment Again
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="flex-1 py-3 text-lg bg-transparent" size="lg">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </div>
          </>
        )}

        {/* Support Information */}
        <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Need help or have questions?</p>
          <p className="text-sm">
            Contact our support team at{" "}
            <a href="mailto:support@brightorian.com" className="text-[#0066E0] hover:underline">
              support@brightorian.com
            </a>{" "}
            or call{" "}
            <a href="tel:+2348123456789" className="text-[#0066E0] hover:underline">
              +234 812 345 6789
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
