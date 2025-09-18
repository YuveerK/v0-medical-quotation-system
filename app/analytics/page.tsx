"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, Clock, CheckCircle, Users, BarChart3, Download } from "lucide-react"
import { CompanyHeader } from "@/components/company-header"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")

  // Sample analytics data
  const monthlyData = [
    { month: "Jan", quotations: 12, invoices: 8, revenue: 245000, avgValue: 20416 },
    { month: "Feb", quotations: 15, invoices: 12, revenue: 320000, avgValue: 21333 },
    { month: "Mar", quotations: 18, invoices: 14, revenue: 385000, avgValue: 21388 },
    { month: "Apr", quotations: 22, invoices: 18, revenue: 465000, avgValue: 21136 },
    { month: "May", quotations: 19, invoices: 16, revenue: 420000, avgValue: 22105 },
    { month: "Jun", quotations: 25, invoices: 20, revenue: 580000, avgValue: 23200 },
  ]

  const statusDistribution = [
    { name: "Approved", value: 45, color: "#10b981" },
    { name: "Pending", value: 25, color: "#f59e0b" },
    { name: "Draft", value: 20, color: "#6b7280" },
    { name: "Converted", value: 10, color: "#3b82f6" },
  ]

  const paymentStatusData = [
    { name: "Paid", value: 60, color: "#10b981" },
    { name: "Partially Paid", value: 25, color: "#3b82f6" },
    { name: "Unpaid", value: 10, color: "#f59e0b" },
    { name: "Overdue", value: 5, color: "#ef4444" },
  ]

  const topICD10Codes = [
    { code: "S78.1", description: "Traumatic amputation at knee level", count: 45, revenue: 1250000 },
    { code: "S88.1", description: "Traumatic amputation at ankle level", count: 32, revenue: 890000 },
    { code: "Z44.1", description: "Fitting artificial leg", count: 28, revenue: 720000 },
    { code: "Z44.0", description: "Fitting artificial arm", count: 18, revenue: 485000 },
    { code: "M21.0", description: "Valgus deformity", count: 15, revenue: 320000 },
  ]

  const conversionFunnel = [
    { stage: "Quotations Created", count: 156, percentage: 100 },
    { stage: "Submitted for Approval", count: 124, percentage: 79.5 },
    { stage: "Approved", count: 98, percentage: 62.8 },
    { stage: "Converted to Invoice", count: 78, percentage: 50.0 },
    { stage: "Fully Paid", count: 65, percentage: 41.7 },
  ]

  const currentMetrics = {
    totalQuotations: 156,
    totalInvoices: 78,
    totalRevenue: 2415000,
    avgQuotationValue: 15480,
    conversionRate: 62.8,
    paymentRate: 83.3,
    avgPaymentTime: 18,
    overdueAmount: 125000,
  }

  const previousMetrics = {
    totalQuotations: 142,
    totalInvoices: 68,
    totalRevenue: 2180000,
    avgQuotationValue: 15352,
    conversionRate: 59.2,
    paymentRate: 79.4,
    avgPaymentTime: 22,
    overdueAmount: 145000,
  }

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      isNegative: change < 0,
    }
  }

  const MetricCard = ({
    title,
    value,
    previousValue,
    format = "number",
    suffix = "",
    prefix = "",
  }: {
    title: string
    value: number
    previousValue: number
    format?: "number" | "currency" | "percentage"
    suffix?: string
    prefix?: string
  }) => {
    const change = calculateChange(value, previousValue)
    const formatValue = (val: number) => {
      switch (format) {
        case "currency":
          return `R${val.toLocaleString("en-ZA")}`
        case "percentage":
          return `${val.toFixed(1)}%`
        default:
          return val.toLocaleString("en-ZA")
      }
    }

    return (
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-slate-900">
                {prefix}
                {formatValue(value)}
                {suffix}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              {change.isPositive && <TrendingUp className="h-4 w-4 text-green-600" />}
              {change.isNegative && <TrendingDown className="h-4 w-4 text-red-600" />}
              <span
                className={`text-sm font-medium ${
                  change.isPositive ? "text-green-600" : change.isNegative ? "text-red-600" : "text-slate-500"
                }`}
              >
                {change.isPositive && "+"}
                {change.isNegative && "-"}
                {change.value}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CompanyHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics & Reports</h1>
            <p className="text-slate-600">Comprehensive insights into your medical practice performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Quotations"
            value={currentMetrics.totalQuotations}
            previousValue={previousMetrics.totalQuotations}
          />
          <MetricCard
            title="Total Revenue"
            value={currentMetrics.totalRevenue}
            previousValue={previousMetrics.totalRevenue}
            format="currency"
          />
          <MetricCard
            title="Conversion Rate"
            value={currentMetrics.conversionRate}
            previousValue={previousMetrics.conversionRate}
            format="percentage"
          />
          <MetricCard
            title="Avg Quotation Value"
            value={currentMetrics.avgQuotationValue}
            previousValue={previousMetrics.avgQuotationValue}
            format="currency"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="procedures">Procedures</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Revenue Trend */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly revenue and quotation volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                        formatter={(value: any, name: string) => [
                          name === "revenue" ? `R${value.toLocaleString("en-ZA")}` : value,
                          name === "revenue" ? "Revenue" : "Quotations",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      <Bar dataKey="quotations" fill="#10b981" opacity={0.7} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Quotation Status Distribution</CardTitle>
                  <CardDescription>Current status breakdown of all quotations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {statusDistribution.map((item) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-600">
                          {item.name} ({item.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Payment Status Distribution</CardTitle>
                  <CardDescription>Invoice payment status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {paymentStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {paymentStatusData.map((item) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-600">
                          {item.name} ({item.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            {/* Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Invoices"
                value={currentMetrics.totalInvoices}
                previousValue={previousMetrics.totalInvoices}
              />
              <MetricCard
                title="Payment Rate"
                value={currentMetrics.paymentRate}
                previousValue={previousMetrics.paymentRate}
                format="percentage"
              />
              <MetricCard
                title="Avg Payment Time"
                value={currentMetrics.avgPaymentTime}
                previousValue={previousMetrics.avgPaymentTime}
                suffix=" days"
              />
              <MetricCard
                title="Overdue Amount"
                value={currentMetrics.overdueAmount}
                previousValue={previousMetrics.overdueAmount}
                format="currency"
              />
            </div>

            {/* Conversion Funnel */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Track the journey from quotation to payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnel.map((stage, index) => (
                    <div key={stage.stage} className="flex items-center space-x-4">
                      <div className="w-32 text-sm font-medium text-slate-700">{stage.stage}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-600">{stage.count} items</span>
                          <span className="text-sm font-medium text-slate-900">{stage.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${stage.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="procedures" className="space-y-6">
            {/* Top ICD10 Codes */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Top Medical Procedures</CardTitle>
                <CardDescription>Most frequent ICD10 codes and their revenue contribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topICD10Codes.map((item, index) => (
                    <div
                      key={item.code}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className="font-mono">
                            {item.code}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{item.description}</h4>
                          <p className="text-sm text-slate-500">{item.count} procedures</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">R{item.revenue.toLocaleString("en-ZA")}</p>
                        <p className="text-sm text-slate-500">
                          R{(item.revenue / item.count).toLocaleString("en-ZA")} avg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Avg Processing Time</CardTitle>
                  <Clock className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">3.2 days</div>
                  <p className="text-xs text-slate-500 mt-1">From draft to approval</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Client Satisfaction</CardTitle>
                  <CheckCircle className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">94.5%</div>
                  <p className="text-xs text-slate-500 mt-1">Based on feedback</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Repeat Clients</CardTitle>
                  <Users className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">67%</div>
                  <p className="text-xs text-slate-500 mt-1">Return customers</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Performance Chart */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Monthly Performance Trends</CardTitle>
                <CardDescription>Track key performance indicators over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                        formatter={(value: any, name: string) => [
                          name === "avgValue" ? `R${value.toLocaleString("en-ZA")}` : value,
                          name === "avgValue" ? "Avg Value" : "Quotations",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="quotations"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="avgValue"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
