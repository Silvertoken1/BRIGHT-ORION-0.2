"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut,
  Plus,
  CheckCircle,
  CreditCard,
  BarChart3,
  Shield,
  Database,
  Mail,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    totalEarnings: 0,
    pendingCommissions: 0,
    availablePins: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
  })
  const [pinCount, setPinCount] = useState(5)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats({
          totalUsers: data.users?.total || 0,
          activeUsers: data.users?.active || 0,
          pendingUsers: data.users?.pending || 0,
          totalEarnings: data.payments?.total || 0,
          pendingCommissions: data.commissions?.pending || 0,
          availablePins: data.pins?.available || 0,
          totalWithdrawals: data.withdrawals?.total || 0,
          pendingWithdrawals: data.withdrawals?.pending || 0,
        })
      } else if (response.status === 401 || response.status === 403) {
        router.push("/auth/login")
      } else {
        console.error("Failed to fetch stats:", response.statusText)
        toast({
          title: "Error",
          description: "Failed to load admin statistics",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generatePins = async () => {
    try {
      const response = await fetch("/api/admin/generate-pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: pinCount }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Generated ${pinCount} new PINs successfully`,
        })
        fetchStats() // Refresh stats
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate PINs",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast({
        title: "Success",
        description: "Logged out successfully",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-600 absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-600 text-lg animate-pulse">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  const quickActions = [
    {
      title: "View All Users",
      description: "Manage user accounts and profiles",
      icon: Users,
      href: "/admin/users",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Approve Commissions",
      description: "Review and approve pending commissions",
      icon: CheckCircle,
      href: "/admin/commissions",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Manage Withdrawals",
      description: "Process withdrawal requests",
      icon: CreditCard,
      href: "/admin/withdrawals",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "System Settings",
      description: "Configure system parameters",
      icon: Settings,
      href: "/admin/settings",
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      textColor: "text-gray-600",
    },
    {
      title: "PIN Management",
      description: "Generate and manage activation PINs",
      icon: Shield,
      href: "/admin/pins",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "Reports & Analytics",
      description: "View detailed system reports",
      icon: BarChart3,
      href: "/admin/reports",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      title: "Email Management",
      description: "Send bulk emails and notifications",
      icon: Mail,
      href: "/admin/emails",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
    },
    {
      title: "Stockist Management",
      description: "Manage stockist applications",
      icon: Database,
      href: "/admin/stockists",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 text-lg">Bright Orion Management Panel</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="hover:scale-105 transition-transform">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards with Staggered Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                {stats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} active, {stats.pendingUsers} pending
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up animation-delay-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <div className="p-2 rounded-lg bg-green-50">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                ₦{stats.totalEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">System revenue</p>
            </CardContent>
          </Card>

          <Card className="card-hover shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up animation-delay-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Commissions</CardTitle>
              <div className="p-2 rounded-lg bg-orange-50">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                ₦{stats.pendingCommissions.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="card-hover shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-fade-in-up animation-delay-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available PINs</CardTitle>
              <div className="p-2 rounded-lg bg-purple-50">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                {stats.availablePins}
              </div>
              <p className="text-xs text-muted-foreground">Ready for distribution</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick PIN Generation */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-slide-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick PIN Generation
            </CardTitle>
            <CardDescription>Generate activation PINs for new users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="space-y-2">
                <Label htmlFor="pinCount">Number of PINs</Label>
                <Input
                  id="pinCount"
                  type="number"
                  min="1"
                  max="100"
                  value={pinCount}
                  onChange={(e) => setPinCount(Number.parseInt(e.target.value) || 1)}
                  className="w-32"
                />
              </div>
              <Button
                onClick={generatePins}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate PINs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Management Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Card
                  className={`card-hover shadow-xl border-0 bg-white/80 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-105 animate-slide-in-up animation-delay-${800 + index * 100}`}
                >
                  <CardHeader className="text-center">
                    <div className={`mx-auto p-4 rounded-full ${action.bgColor} mb-4`}>
                      <Icon className={`h-8 w-8 ${action.textColor}`} />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription className="text-sm">{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        .animate-slide-in-up {
          animation: slideInUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(40px);
        }
        .animation-delay-0 { animation-delay: 0ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-900 { animation-delay: 900ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1100 { animation-delay: 1100ms; }
        .animation-delay-1200 { animation-delay: 1200ms; }
        .animation-delay-1300 { animation-delay: 1300ms; }
        .animation-delay-1400 { animation-delay: 1400ms; }
        .animation-delay-1500 { animation-delay: 1500ms; }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </div>
  )
}
