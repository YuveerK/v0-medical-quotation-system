"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Save, X, Calculator } from "lucide-react"
import { ICD10Search } from "@/components/icd10-search"

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

interface QuotationFormProps {
  quotation?: Quotation | null
  onSave: (quotation: Partial<Quotation>) => void
  onCancel: () => void
}

const commonSAOPACodes = [
  { code: "10502", description: "Prosthetic fitting: TransTibial Endoskeletal" },
  { code: "10556", description: "Additional prosthesis fitting - test socket" },
  { code: "10501", description: "Prosthetic fitting: TransFemoral Endoskeletal" },
  { code: "10503", description: "Prosthetic fitting: Partial Foot" },
  { code: "10504", description: "Prosthetic fitting: Hip Disarticulation" },
  { code: "20001", description: "Spinal Orthosis - TLSO" },
  { code: "20002", description: "Spinal Orthosis - LSO" },
]

export function QuotationForm({ quotation, onSave, onCancel }: QuotationFormProps) {
  const [formData, setFormData] = useState({
    date: quotation?.date || new Date().toISOString().split("T")[0],
    claimantName: quotation?.claimantName || "",
    quotationTitle: quotation?.quotationTitle || "",
    lineItems: quotation?.lineItems || [],
  })

  const [includeVAT, setIncludeVAT] = useState(true)

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      icd10Code: "",
      description: "",
      quantity: 1,
      nappiCode: "",
      saopaCode: "",
      pricePerUnit: 0,
      total: 0,
    }
    setFormData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }))
  }

  const removeLineItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }))
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          // Recalculate total when quantity or price changes
          if (field === "quantity" || field === "pricePerUnit") {
            updatedItem.total = updatedItem.quantity * updatedItem.pricePerUnit
          }
          return updatedItem
        }
        return item
      }),
    }))
  }

  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.total, 0)
    const vatAmount = includeVAT ? subtotal * 0.15 : 0
    const total = subtotal + vatAmount
    return { subtotal, vatAmount, total }
  }

  const handleSave = () => {
    const { subtotal, vatAmount, total } = calculateTotals()

    const quotationData: Partial<Quotation> = {
      date: formData.date,
      claimantName: formData.claimantName,
      quotationTitle: formData.quotationTitle,
      lineItems: formData.lineItems,
      subtotal,
      vatAmount,
      total,
      status: quotation?.status || "draft",
    }

    onSave(quotationData)
  }

  const { subtotal, vatAmount, total } = calculateTotals()

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{quotation ? "Edit Quotation" : "New Quotation"}</h1>
          <p className="text-slate-600">Create or modify medical quotation details</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Quotation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-slate-700">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="linkNo" className="text-slate-700">
                    Link No
                  </Label>
                  <Input
                    id="linkNo"
                    value={quotation?.linkNo || "Auto-generated"}
                    disabled
                    className="mt-1 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="claimantName" className="text-slate-700">
                  Claimant Name
                </Label>
                <Input
                  id="claimantName"
                  value={formData.claimantName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, claimantName: e.target.value }))}
                  placeholder="Enter patient/client name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="quotationTitle" className="text-slate-700">
                  Quotation Title
                </Label>
                <Input
                  id="quotationTitle"
                  value={formData.quotationTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, quotationTitle: e.target.value }))}
                  placeholder="e.g., Above Knee Prosthesis"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-slate-900">Line Items</CardTitle>
              <Button onClick={addLineItem} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              {formData.lineItems.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Calculator className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <p>No line items added yet</p>
                  <p className="text-sm">Click "Add Item" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.lineItems.map((item, index) => (
                    <div key={item.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-slate-900">Item {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeLineItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-slate-700">ICD10 Code</Label>
                          <div className="mt-1">
                            <ICD10Search
                              value={item.icd10Code}
                              onChange={(value) => updateLineItem(item.id, "icd10Code", value)}
                              placeholder="Search ICD-10 codes..."
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-slate-700">Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label className="text-slate-700">Nappi Code</Label>
                          <Input
                            value={item.nappiCode}
                            onChange={(e) => updateLineItem(item.id, "nappiCode", e.target.value)}
                            placeholder="Optional"
                            className="mt-1"
                          />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                          <Label className="text-slate-700">Item Description</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                            placeholder="Detailed description of the item"
                            className="mt-1"
                            rows={2}
                          />
                        </div>

                        <div>
                          <Label className="text-slate-700">SAOPA/Treatment Code</Label>
                          <Select
                            value={item.saopaCode}
                            onValueChange={(value) => updateLineItem(item.id, "saopaCode", value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select SAOPA" />
                            </SelectTrigger>
                            <SelectContent>
                              {commonSAOPACodes.map((code) => (
                                <SelectItem key={code.code} value={code.code}>
                                  {code.code} - {code.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-slate-700">Price per Unit (inc. VAT)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.pricePerUnit}
                            onChange={(e) =>
                              updateLineItem(item.id, "pricePerUnit", Number.parseFloat(e.target.value) || 0)
                            }
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label className="text-slate-700">Line Total</Label>
                          <Input
                            value={`R${item.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`}
                            disabled
                            className="mt-1 bg-slate-100 font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card className="border-slate-200 sticky top-6">
            <CardHeader>
              <CardTitle className="text-slate-900">Quotation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-semibold">R{subtotal.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">VAT (15%):</span>
                <span className="font-semibold">
                  R{vatAmount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-slate-900">Total:</span>
                <span className="font-bold text-slate-900">
                  R{total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Line Items:</span>
                  <span>{formData.lineItems.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Status:</span>
                  <span className="capitalize">{quotation?.status || "Draft"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
