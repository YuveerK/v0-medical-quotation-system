"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Eye, Send, DollarSign, Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react"
import { CompanyHeader } from "@/components/company-header"
import { PDFGenerator } from "@/components/pdf-generator"

interface LineItem {
  id: string
  icd10Code: string
  description: string
  quantity: number
  nappiCode: string
  saopaCode: string
  pricePerUnit: number
  total: number
}

interface Invoice {
  id: string
  invoiceNo: string
  quotationLinkNo: string
  date: string
  dueDate: string
  claimantName: string
  invoiceTitle: string
  lineItems: LineItem[]
  subtotal: number
  vatAmount: number
  total: number
  paymentStatus: "unpaid" | "partially-paid" | "paid" | "overdue"
  amountPaid: number
  amountDue: number
  createdAt: string
  updatedAt: string
  lastReminderSent?: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNo: "INV-2024-001",
      quotationLinkNo: "4465651",
      date: "2024-06-04",
      dueDate: "2024-07-04",
      claimantName: "Lucky Patrick Nkosi",
      invoiceTitle: "Above knee Prosthesis",
      lineItems: [
        {
          id: "1",
          icd10Code: "S78.1",
          description: "Prosthetic fitting: TransTibial Endoskeletal Prosthesis",
          quantity: 1,
          nappiCode: "20047",
          saopaCode: "10502",
          pricePerUnit: 65459.13,
          total: 65459.13,
        },
        {
          id: "2",
          icd10Code: "S78.1",
          description: "Additional to prosthesis fitting – test socket diagnostical",
          quantity: 1,
          nappiCode: "N/A",
          saopaCode: "10556",
          pricePerUnit: 5219.4,
          total: 5219.4,
        },
      ],
      subtotal: 70678.53,
      vatAmount: 10601.78,
      total: 81280.31,
      paymentStatus: "partially-paid",
      amountPaid: 40000.0,
      amountDue: 41280.31,
      createdAt: "2024-06-04T10:00:00Z",
      updatedAt: "2024-06-10T14:30:00Z",
    },
    {
      id: "2",
      invoiceNo: "INV-2024-002",
      quotationLinkNo: "4465652",
      date: "2024-06-05",
      dueDate: "2024-07-05",
      claimantName: "Sarah Johnson",
      invoiceTitle: "Below knee Prosthesis",
      lineItems: [],
      subtotal: 125000.0,
      vatAmount: 18750.0,
      total: 143750.0,
      paymentStatus: "overdue",
      amountPaid: 0,
      amountDue: 143750.0,
      createdAt: "2024-06-05T10:00:00Z",
      updatedAt: "2024-06-05T10:00:00Z",
    },
  ])

  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "partially-paid":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "unpaid":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />
      case "partially-paid":
        return <DollarSign className="h-4 w-4" />
      case "unpaid":
        return <Clock className="h-4 w-4" />
      case "overdue":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = today.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const filteredInvoices = invoices.filter(
    (invoice) => filterStatus === "all" || invoice.paymentStatus === filterStatus,
  )

  const handleRecordPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setPaymentAmount("")
    setShowPaymentModal(true)
  }

  const handleSavePayment = () => {
    if (!selectedInvoice || !paymentAmount) return

    const amount = Number.parseFloat(paymentAmount)
    if (amount <= 0 || amount > selectedInvoice.amountDue) return

    setInvoices((prev) =>
      prev.map((invoice) => {
        if (invoice.id === selectedInvoice.id) {
          const newAmountPaid = invoice.amountPaid + amount
          const newAmountDue = invoice.total - newAmountPaid
          const newStatus = newAmountDue <= 0 ? "paid" : "partially-paid"

          return {
            ...invoice,
            amountPaid: newAmountPaid,
            amountDue: newAmountDue,
            paymentStatus: newStatus,
            updatedAt: new Date().toISOString(),
          }
        }
        return invoice
      }),
    )

    setShowPaymentModal(false)
    setSelectedInvoice(null)
    setPaymentAmount("")
  }

  const handleSendReminder = (invoice: Invoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoice.id ? { ...inv, lastReminderSent: new Date().toISOString() } : inv)),
    )
    alert(`Payment reminder sent to ${invoice.claimantName}`)
  }

  // Update overdue status
  const updatedInvoices = invoices.map((invoice) => {
    if (invoice.paymentStatus === "unpaid" && isOverdue(invoice.dueDate)) {
      return { ...invoice, paymentStatus: "overdue" as const }
    }
    return invoice
  })

  const totalOutstanding = filteredInvoices.reduce((sum, inv) => sum + inv.amountDue, 0)
  const totalPaid = filteredInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0)
  const overdueCount = filteredInvoices.filter((inv) => inv.paymentStatus === "overdue").length

  return (
    <div className="min-h-screen bg-slate-50">
      <CompanyHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Invoices</h1>
            <p className="text-slate-600">Track payments and manage invoice collections</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Outstanding</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-400" />
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
              <CardTitle className="text-sm font-medium text-slate-600">Total Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                R{totalPaid.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500 mt-1">Received payments</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{filteredInvoices.length}</div>
              <p className="text-xs text-slate-500 mt-1">Active invoices</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
              <p className="text-xs text-slate-500 mt-1">Require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <Label htmlFor="status-filter" className="text-sm font-medium text-slate-700">
            Filter by payment status:
          </Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="partially-paid">Partially Paid</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">{invoice.invoiceTitle}</h3>
                      <p className="text-slate-600">
                        Invoice: {invoice.invoiceNo} • Quote: {invoice.quotationLinkNo} • {invoice.claimantName}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                        <span>Issued: {new Date(invoice.date).toLocaleDateString("en-ZA")}</span>
                        <span>Due: {new Date(invoice.dueDate).toLocaleDateString("en-ZA")}</span>
                        {invoice.paymentStatus === "overdue" && (
                          <span className="text-red-600 font-medium">
                            {getDaysOverdue(invoice.dueDate)} days overdue
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">
                        R{invoice.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                      </p>
                      <div className="text-sm text-slate-500 space-y-1">
                        <p>Paid: R{invoice.amountPaid.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</p>
                        <p>Due: R{invoice.amountDue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>

                    <Badge className={`${getPaymentStatusColor(invoice.paymentStatus)} flex items-center space-x-1`}>
                      {getPaymentStatusIcon(invoice.paymentStatus)}
                      <span className="capitalize">{invoice.paymentStatus.replace("-", " ")}</span>
                    </Badge>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <PDFGenerator
                        data={{
                          ...invoice,
                          type: "invoice",
                          linkNo: invoice.quotationLinkNo,
                        }}
                      />
                      {invoice.paymentStatus !== "paid" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRecordPayment(invoice)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendReminder(invoice)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                {invoice.amountPaid > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Payment Progress:</span>
                      <span className="text-slate-600">
                        {((invoice.amountPaid / invoice.total) * 100).toFixed(1)}% paid
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(invoice.amountPaid / invoice.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Last Reminder */}
                {invoice.lastReminderSent && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-500">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Last reminder sent: {new Date(invoice.lastReminderSent).toLocaleDateString("en-ZA")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredInvoices.length === 0 && (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No invoices found</h3>
                <p className="text-slate-600">
                  {filterStatus === "all"
                    ? "No invoices have been created yet"
                    : `No invoices with status "${filterStatus.replace("-", " ")}"`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Record Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-700">Invoice</Label>
                <p className="text-sm text-slate-600">
                  {selectedInvoice.invoiceNo} - {selectedInvoice.claimantName}
                </p>
              </div>

              <div>
                <Label className="text-slate-700">Amount Due</Label>
                <p className="text-lg font-semibold text-slate-900">
                  R{selectedInvoice.amountDue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <Label htmlFor="payment-amount" className="text-slate-700">
                  Payment Amount
                </Label>
                <Input
                  id="payment-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={selectedInvoice.amountDue}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={handleSavePayment}
                  disabled={!paymentAmount || Number.parseFloat(paymentAmount) <= 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Record Payment
                </Button>
                <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
