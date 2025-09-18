"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

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

interface DocumentData {
  id: string
  linkNo?: string
  invoiceNo?: string
  date: string
  claimantName: string
  title: string
  lineItems: LineItem[]
  subtotal: number
  vatAmount: number
  total: number
  status: string
  type: "quotation" | "invoice"
  dueDate?: string
  amountPaid?: number
  amountDue?: number
}

interface PDFGeneratorProps {
  data: DocumentData
  onGenerate?: () => void
}

export function PDFGenerator({ data, onGenerate }: PDFGeneratorProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = async () => {
    if (onGenerate) onGenerate()

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = printRef.current?.innerHTML || ""

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.type === "quotation" ? "Quotation" : "Invoice"} ${data.linkNo || data.invoiceNo}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #1e293b;
              background: white;
            }
            
            .document-container {
              max-width: 210mm;
              margin: 0 auto;
              padding: 20mm;
              background: white;
              min-height: 297mm;
              position: relative;
            }
            
            .header {
              border-bottom: 3px solid #1e40af;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #1e40af;
              letter-spacing: 1px;
              margin-bottom: 8px;
            }
            
            .company-subtitle {
              font-size: 14px;
              color: #475569;
              font-weight: 600;
              margin-bottom: 4px;
            }
            
            .company-pr {
              font-size: 12px;
              color: #64748b;
              margin-bottom: 15px;
            }
            
            .contact-info {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            
            .contact-details {
              font-size: 11px;
              color: #475569;
              line-height: 1.6;
            }
            
            .document-info {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 30px;
            }
            
            .document-title {
              font-size: 18px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 15px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .document-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            
            .detail-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .detail-label {
              font-weight: 600;
              color: #374151;
              text-transform: uppercase;
              font-size: 10px;
              letter-spacing: 0.5px;
            }
            
            .detail-value {
              font-weight: 600;
              color: #1e293b;
            }
            
            .client-section {
              margin-bottom: 30px;
            }
            
            .client-title {
              font-size: 14px;
              font-weight: bold;
              color: #374151;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .client-name {
              font-size: 16px;
              font-weight: bold;
              color: #1e40af;
              padding: 10px 15px;
              background: #eff6ff;
              border-left: 4px solid #1e40af;
              border-radius: 4px;
            }
            
            .line-items {
              margin-bottom: 30px;
            }
            
            .items-title {
              font-size: 16px;
              font-weight: bold;
              color: #374151;
              margin-bottom: 15px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              overflow: hidden;
            }
            
            .items-table th {
              background: #1e40af;
              color: white;
              font-weight: 600;
              padding: 12px 8px;
              text-align: left;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .items-table td {
              padding: 12px 8px;
              border-bottom: 1px solid #e5e7eb;
              vertical-align: top;
            }
            
            .items-table tr:nth-child(even) {
              background: #f9fafb;
            }
            
            .items-table tr:hover {
              background: #f3f4f6;
            }
            
            .description-cell {
              max-width: 200px;
              word-wrap: break-word;
            }
            
            .amount-cell {
              text-align: right;
              font-weight: 600;
              font-family: 'Courier New', monospace;
            }
            
            .totals-section {
              margin-top: 30px;
              display: flex;
              justify-content: flex-end;
            }
            
            .totals-table {
              width: 300px;
              border-collapse: collapse;
            }
            
            .totals-table td {
              padding: 8px 15px;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .totals-label {
              font-weight: 600;
              color: #374151;
              text-align: right;
            }
            
            .totals-amount {
              text-align: right;
              font-weight: 600;
              font-family: 'Courier New', monospace;
              color: #1e293b;
            }
            
            .total-row {
              background: #1e40af;
              color: white;
              font-size: 14px;
              font-weight: bold;
            }
            
            .total-row td {
              border: none;
              padding: 12px 15px;
            }
            
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 2px solid #e2e8f0;
              text-align: center;
            }
            
            .footer-text {
              font-size: 14px;
              color: #475569;
              font-weight: 600;
            }
            
            .company-signature {
              font-size: 16px;
              color: #1e40af;
              font-weight: bold;
              margin-top: 10px;
            }
            
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 72px;
              color: rgba(239, 68, 68, 0.1);
              font-weight: bold;
              z-index: 0;
              pointer-events: none;
            }
            
            .content {
              position: relative;
              z-index: 1;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .status-draft {
              background: #f3f4f6;
              color: #374151;
              border: 1px solid #d1d5db;
            }
            
            .status-approved {
              background: #dcfce7;
              color: #166534;
              border: 1px solid #bbf7d0;
            }
            
            .status-paid {
              background: #dcfce7;
              color: #166534;
              border: 1px solid #bbf7d0;
            }
            
            .status-unpaid {
              background: #fef3c7;
              color: #92400e;
              border: 1px solid #fde68a;
            }
            
            .status-overdue {
              background: #fee2e2;
              color: #dc2626;
              border: 1px solid #fecaca;
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .document-container {
                margin: 0;
                padding: 15mm;
                box-shadow: none;
              }
              
              .no-print {
                display: none !important;
              }
            }
            
            @page {
              size: A4;
              margin: 0;
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 1000);
            }
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "status-draft"
      case "approved":
        return "status-approved"
      case "paid":
        return "status-paid"
      case "unpaid":
        return "status-unpaid"
      case "overdue":
        return "status-overdue"
      case "partially-paid":
        return "status-unpaid"
      default:
        return "status-draft"
    }
  }

  return (
    <>
      <Button onClick={handleDownloadPDF} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Download PDF
      </Button>

      {/* Hidden PDF Content */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <div ref={printRef}>
          <div className="document-container">
            {/* Watermark for draft status */}
            {(data.status === "draft" || data.status === "pending") && <div className="watermark">DRAFT</div>}

            <div className="content">
              {/* Header */}
              <div className="header">
                <div className="company-name">KLEINSMITH ORTHOPAEDICS</div>
                <div className="company-subtitle">Medical Orthotist & Prosthetist</div>
                <div className="company-pr">PR No: 0485209</div>

                <div className="contact-info">
                  <div className="contact-details">
                    <div>064 526 5143</div>
                    <div>ruwan.kleinsmit@gmail.com</div>
                    <div>Suite 2, Garden Medical Mews, 28 Bartlett Road, Johannesburg</div>
                  </div>
                  <div className={`status-badge ${getStatusClass(data.status)}`}>{data.status.replace("-", " ")}</div>
                </div>
              </div>

              {/* Document Info */}
              <div className="document-info">
                <div className="document-title">{data.type === "quotation" ? "Quotation" : "Invoice"}</div>

                <div className="document-details">
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{new Date(data.date).toLocaleDateString("en-ZA")}</span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">{data.type === "quotation" ? "Link No:" : "Invoice No:"}</span>
                    <span className="detail-value">{data.linkNo || data.invoiceNo}</span>
                  </div>

                  {data.type === "invoice" && data.dueDate && (
                    <div className="detail-item">
                      <span className="detail-label">Due Date:</span>
                      <span className="detail-value">{new Date(data.dueDate).toLocaleDateString("en-ZA")}</span>
                    </div>
                  )}

                  <div className="detail-item">
                    <span className="detail-label">{data.type === "quotation" ? "Quotation:" : "Invoice:"}</span>
                    <span className="detail-value">{data.title}</span>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="client-section">
                <div className="client-title">Claimant</div>
                <div className="client-name">{data.claimantName}</div>
              </div>

              {/* Line Items */}
              <div className="line-items">
                <div className="items-title">Items</div>

                <table className="items-table">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>ICD 10 Code</th>
                      <th style={{ width: "300px" }}>Item Description</th>
                      <th style={{ width: "60px" }}>Quantity</th>
                      <th style={{ width: "80px" }}>Nappi Code</th>
                      <th style={{ width: "100px" }}>SAOPA/Treatment Code</th>
                      <th style={{ width: "100px" }}>Price per Unit (inc.vat)</th>
                      <th style={{ width: "100px" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lineItems.map((item, index) => (
                      <tr key={item.id}>
                        <td>{item.icd10Code}</td>
                        <td className="description-cell">{item.description}</td>
                        <td style={{ textAlign: "center" }}>{item.quantity}</td>
                        <td>{item.nappiCode || "N/A"}</td>
                        <td>{item.saopaCode}</td>
                        <td className="amount-cell">
                          R{item.pricePerUnit.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="amount-cell">
                          R{item.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="totals-section">
                <table className="totals-table">
                  <tbody>
                    <tr>
                      <td className="totals-label">Subtotal:</td>
                      <td className="totals-amount">
                        R{data.subtotal.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    {data.vatAmount > 0 && (
                      <tr>
                        <td className="totals-label">VAT (15%):</td>
                        <td className="totals-amount">
                          R{data.vatAmount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}
                    <tr className="total-row">
                      <td>Total:</td>
                      <td>R{data.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</td>
                    </tr>

                    {/* Invoice-specific payment info */}
                    {data.type === "invoice" && (
                      <>
                        {data.amountPaid !== undefined && data.amountPaid > 0 && (
                          <tr>
                            <td className="totals-label">Amount Paid:</td>
                            <td className="totals-amount">
                              R{data.amountPaid.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        )}
                        {data.amountDue !== undefined && data.amountDue > 0 && (
                          <tr style={{ background: "#fef3c7", color: "#92400e", fontWeight: "bold" }}>
                            <td>Amount Due:</td>
                            <td>R{data.amountDue.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="footer">
                <div className="footer-text">Kind regards</div>
                <div className="company-signature">Kleinsmith Orthopaedics</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
