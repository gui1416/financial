"use client"

import { useState } from "react"
import ReportForm from "./report-form"
import ReportPreview from "./report-preview"
import { generateReport } from "@/lib/actions/reports"
import type { Category } from "@/lib/supabase/types"

interface ReportsClientProps {
 categories: Category[]
}

export default function ReportsClient({ categories }: ReportsClientProps) {
 const [reportData, setReportData] = useState<any>(null)

 const handleReportGenerated = (data: any) => {
  setReportData(data)
 }

 return (
  <div className="space-y-8">
   <ReportForm categories={categories} action={generateReport} onReportGenerated={handleReportGenerated} />

   {reportData && <ReportPreview data={reportData} />}
  </div>
 )
}
