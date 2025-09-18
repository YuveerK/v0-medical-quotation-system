import { Phone, Mail, MapPin } from "lucide-react"
import { UserMenu } from "./user-menu"

export function CompanyHeader() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Company Name and Title */}
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">KLEINSMITH ORTHOPAEDICS</h1>
            <p className="text-slate-600 font-medium mt-1">Medical Orthotist & Prosthetist</p>
            <p className="text-sm text-slate-500 mt-1">PR No: 0485209</p>
          </div>

          {/* Contact Information and User Menu */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col lg:items-end space-y-2 mr-6">
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="h-4 w-4 mr-2 text-slate-400" />
                <span>064 526 5143</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Mail className="h-4 w-4 mr-2 text-slate-400" />
                <span>ruwan.kleinsmit@gmail.com</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                <span>Suite 2, Garden Medical Mews, 28 Bartlett Road, Johannesburg</span>
              </div>
            </div>

            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
