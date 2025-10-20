"use client"

import { useState } from "react"
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImportedKeyword {
  keyword: string
  brand: string
  matchType: string
  status: "new" | "duplicate" | "conflict"
}

const mockImportData: ImportedKeyword[] = [
  { keyword: "running shoes", brand: "Nike", matchType: "exact", status: "new" },
  { keyword: "nike air max", brand: "Nike", matchType: "phrase", status: "new" },
  { keyword: "running shoes", brand: "Nike", matchType: "exact", status: "duplicate" },
  { keyword: "sports footwear", brand: "Nike", matchType: "broad", status: "conflict" },
  { keyword: "buy nike shoes", brand: "Nike", matchType: "exact", status: "new" },
]

export default function ImportsPage() {
  const [step, setStep] = useState<"upload" | "preview" | "complete">("upload")
  const [file, setFile] = useState<File | null>(null)
  const [importData, setImportData] = useState<ImportedKeyword[]>([])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      // Simulate data loading
      setTimeout(() => {
        setImportData(mockImportData)
        setStep("preview")
      }, 1000)
    }
  }

  const handleCommit = () => {
    // Simulate commit
    setTimeout(() => {
      setStep("complete")
    }, 1000)
  }

  const newCount = importData.filter((kw) => kw.status === "new").length
  const duplicateCount = importData.filter((kw) => kw.status === "duplicate").length
  const conflictCount = importData.filter((kw) => kw.status === "conflict").length

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Import Keywords
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Upload and preview keywords before committing to the bank
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 ${
              step === "upload"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "upload"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              1
            </div>
            <span className="font-medium">Upload</span>
          </div>
          <div className="w-16 h-0.5 bg-slate-300 dark:bg-slate-700" />
          <div
            className={`flex items-center gap-2 ${
              step === "preview"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "preview"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              2
            </div>
            <span className="font-medium">Preview</span>
          </div>
          <div className="w-16 h-0.5 bg-slate-300 dark:bg-slate-700" />
          <div
            className={`flex items-center gap-2 ${
              step === "complete"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "complete"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              3
            </div>
            <span className="font-medium">Complete</span>
          </div>
        </div>
      </div>

      {/* Upload Step */}
      {step === "upload" && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <FileText className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Upload Keyword CSV
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Choose a CSV file with keywords to import
              </p>
            </div>

            <label className="block">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-12 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  CSV file (max 10MB)
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </label>

            {file && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button onClick={() => setFile(null)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Step */}
      {step === "preview" && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded">
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {newCount}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    New Keywords
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded">
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {duplicateCount}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Duplicates
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {conflictCount}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Conflicts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Table */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Preview Keywords
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                      Keyword
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                      Brand
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                      Match Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {importData.map((kw, index) => (
                    <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                      <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                        {kw.keyword}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                        {kw.brand}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">
                          {kw.matchType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            kw.status === "new"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                              : kw.status === "duplicate"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {kw.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStep("upload")}>
              Cancel
            </Button>
            <Button onClick={handleCommit}>
              Commit to Bank ({newCount} keywords)
            </Button>
          </div>
        </div>
      )}

      {/* Complete Step */}
      {step === "complete" && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Import Complete!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Successfully imported {newCount} new keywords to the bank
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setStep("upload")}>
                Import More
              </Button>
              <Button onClick={() => (window.location.href = "/bank")}>
                View Bank
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
