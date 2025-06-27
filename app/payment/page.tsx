"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, CreditCard, Shield, Clock, ArrowLeft, User, Mail, Phone } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [packageInfo, setPackageInfo] = useState<any>(null)
  const [message, setMessage] = useState({ text: "", type: "" })

  useEffect(() => {
    // Get user data from localStorage
    const pendingUser = localStorage.getItem("pending_user")
    const packageData = localStorage.getItem("package_info")

    if (!pendingUser || !packageData) {
      router.push("/auth/register")
      return
    }

    try {
      setUserData(JSON.parse(pendingUser))
      setPackageInfo(JSON.parse(packageData))
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/auth/register")
    }
  }, [router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handlePayment = async () => {
    if (!userData || !packageInfo) return

    setLoading(true)
    setMessage({ text: "", type: "" })

    try {
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          amount: packageInfo.price * 100, // Convert to kobo
          userId: userData.id,
          packageType: "starter",
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Redirect to Paystack payment page
        window.location.href = result.authorization_url
      } else {
        setMessage({
          text: result.message || "Failed to initialize payment",
          type: "error",
        })
      }
    } catch (error) {
      console.error("Payment initialization error:", error)
      setMessage({
        text: "Error initializing payment. Please try again.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBackToRegistration = () => {
    router.push("/auth/register")
  }

  if (!userData || !packageInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066E0] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-[#0066E0] rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Complete Your Registration</h1>
          <p className="text-lg text-gray-600">Secure payment to activate your Bright Orion account</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Summary */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Package Details */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#0066E0]">{packageInfo.name}</h3>
                    <Badge className="bg-green-100 text-green-800">Starter Package</Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {packageInfo.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-700">Package Price:</span>
                    <span className="text-2xl font-bold text-[#0066E0]">{formatCurrency(packageInfo.price)}</span>
                  </div>
                </div>

                {/* User Information */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Account Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{userData.fullName}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">{userData.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{userData.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="text-xs">
                        Member ID: {userData.memberId}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Payment Security */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-green-800 mb-1">Secure Payment</h5>
                      <p className="text-sm text-green-700">
                        Your payment is secured by Paystack with 256-bit SSL encryption. We never store your card
                        details.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Actions */}
          <div className="space-y-6">
            {/* Total Amount Card */}
            <Card className="shadow-lg border-2 border-[#0066E0]">
              <CardHeader className="bg-[#0066E0] text-white">
                <CardTitle className="text-center">Total Amount</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0066E0] mb-2">{formatCurrency(packageInfo.price)}</div>
                  <p className="text-sm text-gray-600 mb-6">One-time activation fee</p>

                  <Button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-[#0066E0] hover:bg-[#0054c2] text-white py-3 text-lg font-semibold"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pay with Paystack
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* What Happens Next */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  What Happens Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Complete Payment</p>
                    <p className="text-xs text-gray-600">Secure payment via Paystack</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Account Activation</p>
                    <p className="text-xs text-gray-600">Instant account activation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Access Dashboard</p>
                    <p className="text-xs text-gray-600">Start earning immediately</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back Button */}
            <Button variant="outline" onClick={handleBackToRegistration} className="w-full bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {message.text && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div
              className={`p-4 rounded-lg text-center ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Need help? Contact our support team at support@brightorian.com</p>
        </div>
      </div>
    </div>
  )
}
