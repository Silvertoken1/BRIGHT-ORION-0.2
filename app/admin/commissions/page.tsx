"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle, ArrowLeft, DollarSign, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

interface Commission {
  id: number
  userId: number
  fromUserId: number
  amount: number
  level: number
  commissionType: string
  status: string
  createdAt: string
  approvedAt?: string
  user?: {
    firstName: string
    lastName: string
    memberId: string
    email: string
  }
  fromUser?: {
    firstName: string
    lastName: string
    memberId: string
  }
}

export default function AdminCommissionsPage() {
  const { toast } = useToast()
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    totalAmount: 0,
    pendingAmount: 0,
  })

  useEffect(() => {
    fetchCommissions()
  }, [])

  const fetchCommissions = async () => {
    try {
      const response = await fetch("/api/admin/commissions")
      if (response.ok) {
        const data = await response.json()
        setCommissions(data.commissions || [])
        setStats(data.stats || {})
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch commissions",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch commissions:", error)
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const approveCommission = async (commissionId: number) => {
    try {
      const response = await fetch("/api/admin/approve-commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commissionId,
          action: "approve",
          adminId: 1, // This should come from auth context
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Commission approved successfully",
        })
        fetchCommissions()
      } else {
        toast({
          title: "Error",
          description: "Failed to approve commission",
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

  const rejectCommission = async (commissionId: number) => {
    try {
      const response = await fetch("/api/admin/approve-commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commissionId,
          action: "reject",
          adminId: 1, // This should come from auth context
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Commission rejected",
        })
        fetchCommissions()
      } else {
        toast({
          title: "Error",
          description: "Failed to reject commission",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading commissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Commission Management</h1>
                <p className="text-gray-600">Review and approve pending commissions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₦{stats.totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All commissions</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">₦{stats.pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Commissions Table */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>All Commissions</CardTitle>
            <CardDescription>Review and manage commission payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>From User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {commission.user?.firstName} {commission.user?.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">{commission.user?.memberId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {commission.fromUser?.firstName} {commission.fromUser?.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">{commission.fromUser?.memberId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">₦{commission.amount.toLocaleString()}</TableCell>
                      <TableCell>Level {commission.level}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{commission.commissionType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            commission.status === "approved"
                              ? "default"
                              : commission.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            commission.status === "approved"
                              ? "bg-green-500"
                              : commission.status === "pending"
                                ? "bg-yellow-500"
                                : ""
                          }
                        >
                          {commission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(commission.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {commission.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => approveCommission(commission.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => rejectCommission(commission.id)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {commission.status === "approved" && (
                          <Badge variant="outline" className="text-green-600">
                            Approved
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {commissions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No commissions found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
