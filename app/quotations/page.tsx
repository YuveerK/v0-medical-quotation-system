"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Edit, Trash2, Eye, CheckCircle, Clock, FileX } from "lucide-react"
import { CompanyHeader } from "@/components/company-header"
import { QuotationForm } from "@/components/quotation-form"
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

interface Quotation {
  id: string
  linkNo: string
  date: string
  claimantName: string
  quotationTitle: string
  lineItems: LineItem[]
  subtotal: number
  vatAmount: number
  total: number
  status: "draft" | "pending" | "approved" | "converted"
  createdAt: string
  updatedAt: string
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: "1",
      linkNo: "4465651",
      date: "2024-06-04",
      claimantName: "Lucky Patrick Nkosi",
      quotationTitle: "Above knee Prosthesis",
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
      status: "approved",
      createdAt: "2024-06-04T10:00:00Z",
      updatedAt: "2024-06-04T10:00:00Z",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "converted":
        return "bg-blue-100 text-blue-800 border-blue-200"
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
        return <FileX className="h-4 w-4" />
      case "converted":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredQuotations = quotations.filter((q) => filterStatus === "all" || q.status === filterStatus)

  const handleCreateQuotation = () => {
    setEditingQuotation(null)
    setShowForm(true)
  }

  const handleEditQuotation = (quotation: Quotation) => {
    if (quotation.status === "approved" || quotation.status === "converted") {
      alert("Cannot edit approved or converted quotations")
      return
    }
    setEditingQuotation(quotation)
    setShowForm(true)
  }

  const handleSaveQuotation = (quotationData: Partial<Quotation>) => {
    if (editingQuotation) {
      // Update existing quotation
      setQuotations((prev) =>
        prev.map((q) =>
          q.id === editingQuotation.id ? { ...q, ...quotationData, updatedAt: new Date().toISOString() } : q,
        ),
      )
    } else {
      // Create new quotation
      const newQuotation: Quotation = {
        id: Date.now().toString(),
        linkNo: (4465651 + quotations.length + 1).toString(),
        date: new Date().toISOString().split("T")[0],
        claimantName: "",
        quotationTitle: "",
        lineItems: [],
        subtotal: 0,
        vatAmount: 0,
        total: 0,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...quotationData,
      }
      setQuotations((prev) => [...prev, newQuotation])
    }
    setShowForm(false)
    setEditingQuotation(null)
  }

  const handleDeleteQuotation = (id: string) => {
    if (confirm("Are you sure you want to delete this quotation?")) {
      setQuotations((prev) => prev.filter((q) => q.id !== id))
    }
  }

  const handleStatusChange = (id: string, newStatus: Quotation["status"]) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus, updatedAt: new Date().toISOString() } : q)),
    )
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CompanyHeader />
        <QuotationForm
          quotation={editingQuotation}
          onSave={handleSaveQuotation}
          onCancel={() => {
            setShowForm(false)
            setEditingQuotation(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CompanyHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Quotations</h1>
            <p className="text-slate-600">Manage medical quotations and track their progress</p>
          </div>
          <Button onClick={handleCreateQuotation} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Quotation
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <Label htmlFor="status-filter" className="text-sm font-medium text-slate-700">
            Filter by status:
          </Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending Approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="converted">Converted to Invoice</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quotations List */}
        <div className="space-y-4">
          {filteredQuotations.map((quotation) => (
            <Card key={quotation.id} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">{quotation.quotationTitle}</h3>
                      <p className="text-slate-600">
                        Link No: {quotation.linkNo} • {quotation.claimantName}
                      </p>
                      <p className="text-sm text-slate-500">
                        Created: {new Date(quotation.date).toLocaleDateString("en-ZA")} • Updated:{" "}
                        {new Date(quotation.updatedAt).toLocaleDateString("en-ZA")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">
                        R{quotation.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-slate-500">
                        {quotation.lineItems.length} item{quotation.lineItems.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <Badge className={`${getStatusColor(quotation.status)} flex items-center space-x-1`}>
                      {getStatusIcon(quotation.status)}
                      <span className="capitalize">{quotation.status.replace("-", " ")}</span>
                    </Badge>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditQuotation(quotation)}
                        disabled={quotation.status === "approved" || quotation.status === "converted"}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <PDFGenerator
                        data={{
                          ...quotation,
                          type: "quotation",
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuotation(quotation.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Status Actions */}
                {quotation.status === "draft" && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(quotation.id, "pending")}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Submit for Approval
                    </Button>
                  </div>
                )}

                {quotation.status === "pending" && (
                  <div className="mt-4 pt-4 border-t border-slate-200 flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(quotation.id, "approved")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(quotation.id, "draft")}>
                      Return to Draft
                    </Button>
                  </div>
                )}

                {quotation.status === "approved" && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(quotation.id, "converted")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Convert to Invoice
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredQuotations.length === 0 && (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No quotations found</h3>
                <p className="text-slate-600 mb-4">
                  {filterStatus === "all"
                    ? "Get started by creating your first quotation"
                    : `No quotations with status "${filterStatus}"`}
                </p>
                {filterStatus === "all" && (
                  <Button onClick={handleCreateQuotation} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Quotation
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
