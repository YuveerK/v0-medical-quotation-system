"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Plus,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowRight,
  Receipt,
  BarChart3,
} from "lucide-react"
import { CompanyHeader } from "@/components/company-header"
import { AuthGuard } from "@/components/auth-guard"
import Link from "next/link"

function DashboardContent() {
  const [quotations] = useState([
    {
      id: "4465651",
      claimant: "Lucky Patrick Nkosi",
      title: "Above knee Prosthesis",
      date: "2024-06-04",
      status: "approved",
      total: 198756.86,
    },
    {
      id: "4465652",
      claimant: "Sarah Johnson",
      title: "Below knee Prosthesis",
      date: "2024-06-05",
      status: "pending",
      total: 125000.0,
    },
    {
      id: "4465653",
      claimant: "Michael Brown",
      title: "Spinal Orthosis",
      date: "2024-06-06",
      status: "draft",
      total: 45000.0,
    },
  ])

  const [invoices] = useState([
    {
      id: "INV-2024-001",
      claimant: "Lucky Patrick Nkosi",
      title: "Above knee Prosthesis",
      total: 81280.31,
      amountDue: 41280.31,
      status: "partially-paid",
    },
    {
      id: "INV-2024-002",
      claimant: "Sarah Johnson",
      title: "Below knee Prosthesis",
      total: 143750.0,
      amountDue: 143750.0,
      status: "overdue",
    },
  ])

  const totalValue = quotations.reduce((sum, q) => sum + q.total, 0)
  const approvedValue = quotations.filter((q) => q.status === "approved").reduce((sum, q) => sum + q.total, 0)
  const conversionRate =
    quotations.length > 0 ? (quotations.filter((q) => q.status === "approved").length / quotations.length) * 100 : 0

  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.amountDue, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "draft":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CompanyHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Manage quotations and invoices for your medical practice</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/analytics">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
            <Link href="/quotations">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Quotation
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Quotations</CardTitle>
              <FileText className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{quotations.length}</div>
              <p className="text-xs text-slate-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Approved Value</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                R{approvedValue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500 mt-1">Ready for invoicing</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Outstanding</CardTitle>
              <Receipt className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                R{totalOutstanding.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500 mt-1">Amount due</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-slate-500 mt-1">Quotations to invoices</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Quotations
              </CardTitle>
              <CardDescription>Manage medical quotations and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{quotations.length}</p>
                  <p className="text-sm text-slate-500">Active quotations</p>
                </div>
                <Link href="/quotations">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Manage
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-green-600" />
                Invoices
              </CardTitle>
              <CardDescription>Track payments and collections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{invoices.length}</p>
                  <p className="text-sm text-slate-500">Active invoices</p>
                </div>
                <Link href="/invoices">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Manage
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                Analytics
              </CardTitle>
              <CardDescription>Comprehensive business insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">94.5%</p>
                  <p className="text-sm text-slate-500">Client satisfaction</p>
                </div>
                <Link href="/analytics">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    View Reports
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Quotations */}
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Recent Quotations</CardTitle>
              <CardDescription className="text-slate-600">Latest quotations and their current status</CardDescription>
            </div>
            <Link href="/quotations">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quotations.map((quotation) => (
                <div
                  key={quotation.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{quotation.title}</h3>
                      <p className="text-sm text-slate-600">
                        Link No: {quotation.id} • {quotation.claimant}
                      </p>
                      <p className="text-xs text-slate-500">{quotation.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        R{quotation.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(quotation.status)} flex items-center space-x-1`}>
                      {getStatusIcon(quotation.status)}
                      <span className="capitalize">{quotation.status}</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
