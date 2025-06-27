"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Circle } from "lucide-react"
import type { MatrixProgress } from "@/lib/matrix-calculator"

interface MatrixProgressTableProps {
  matrixData: MatrixProgress
}

export function MatrixProgressTable({ matrixData }: MatrixProgressTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">✅ Full</Badge>
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">🔄 In Progress</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-600">⏳ Not Started</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(matrixData.totalEarned)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(matrixData.totalPending)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Possible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(matrixData.totalPossible)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Matrix Progress Table */}
      <Card>
        <CardHeader>
          <CardTitle>Matrix Progress - Commission Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Level</th>
                  <th className="text-left p-3 font-semibold">Required</th>
                  <th className="text-left p-3 font-semibold">Progress</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Per Person</th>
                  <th className="text-left p-3 font-semibold">Total Reward</th>
                  <th className="text-left p-3 font-semibold">Earned</th>
                </tr>
              </thead>
              <tbody>
                {matrixData.levels.map((level) => (
                  <tr key={level.level} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(level.status)}
                        <span className="font-medium">Level {level.level}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-gray-600">{level.requiredDownlines.toLocaleString()} people</span>
                    </td>
                    <td className="p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            {level.currentDownlines}/{level.requiredDownlines}
                          </span>
                          <span>{level.progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={level.progress} className="h-2" />
                      </div>
                    </td>
                    <td className="p-3">{getStatusBadge(level.status)}</td>
                    <td className="p-3">
                      <span className="font-medium">{formatCurrency(level.commissionPerPerson)}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-blue-600">{formatCurrency(level.totalCommission)}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold ${level.status === "completed" ? "text-green-600" : "text-gray-400"}`}
                      >
                        {level.status === "completed" ? formatCurrency(level.totalCommission) : "₦0"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Commission Structure Reference */}
      <Card>
        <CardHeader>
          <CardTitle>💸 Commission Structure Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">How It Works:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>
                • <strong>Level 1:</strong> You refer 5 people → Earn ₦20,000
              </li>
              <li>
                • <strong>Level 2:</strong> Your 5 each refer 5 (25 total) → Earn ₦50,000
              </li>
              <li>
                • <strong>Level 3:</strong> 25 each refer 5 (125 total) → Earn ₦250,000
              </li>
              <li>
                • <strong>Level 4:</strong> 125 each refer 5 (625 total) → Earn ₦937,500
              </li>
              <li>
                • <strong>Level 5:</strong> 625 each refer 5 (3,125 total) → Earn ₦4,687,500
              </li>
              <li>
                • <strong>Level 6:</strong> 3,125 each refer 5 (15,625 total) → Earn ₦23,437,500
              </li>
            </ul>
            <div className="mt-3 p-2 bg-yellow-100 rounded text-sm">
              ⚠️ <strong>Important:</strong> Commissions are only released once a level is completely filled.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
