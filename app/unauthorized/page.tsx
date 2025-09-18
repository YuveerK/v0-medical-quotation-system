"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"
import { CompanyHeader } from "@/components/company-header"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CompanyHeader />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Access Denied</CardTitle>
              <CardDescription className="text-slate-600">
                You don't have permission to access this page
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-slate-500 mb-6">
                Please contact your administrator if you believe this is an error.
              </p>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
