"use client"

import { useState } from "react"
import { Search, Filter, Download, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Keyword {
  id: string
  keyword: string
  matchType: "exact" | "phrase" | "broad"
  intent: "Awareness" | "Consideration" | "Conversion"
  brand: string
  asins: string[]
  status: "active" | "paused"
  bid: number
}

const mockKeywords: Keyword[] = [
  {
    id: "1",
    keyword: "running shoes",
    matchType: "exact",
    intent: "Conversion",
    brand: "Nike",
    asins: ["B07X9C8N6D"],
    status: "active",
    bid: 1.75,
  },
  {
    id: "2",
    keyword: "nike air max",
    matchType: "phrase",
    intent: "Consideration",
    brand: "Nike",
    asins: ["B07X9C8N6D", "B08XYZ123"],
    status: "active",
    bid: 1.50,
  },
  {
    id: "3",
    keyword: "athletic footwear",
    matchType: "broad",
    intent: "Awareness",
    brand: "Nike",
    asins: [],
    status: "paused",
    bid: 0.85,
  },
  {
    id: "4",
    keyword: "buy nike shoes",
    matchType: "exact",
    intent: "Conversion",
    brand: "Nike",
    asins: ["B07X9C8N6D"],
    status: "active",
    bid: 2.00,
  },
  {
    id: "5",
    keyword: "sports shoes",
    matchType: "phrase",
    intent: "Consideration",
    brand: "Adidas",
    asins: ["B09ABC123"],
    status: "active",
    bid: 1.25,
  },
]

export default function KeywordBankPage() {
  const [keywords, setKeywords] = useState<Keyword[]>(mockKeywords)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null)

  const filteredKeywords = keywords.filter((kw) =>
    kw.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-white dark:bg-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Keyword Bank
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {filteredKeywords.length} keywords
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button>
                <Plus className="w-4 h-4" />
                Add Keyword
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Keyword
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Match Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Intent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    ASINs
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Bid
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredKeywords.map((keyword) => (
                  <tr
                    key={keyword.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                    onClick={() => setSelectedKeyword(keyword)}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                      {keyword.keyword}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">
                        {keyword.matchType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          keyword.intent === "Conversion"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                            : keyword.intent === "Consideration"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                            : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                        }`}
                      >
                        {keyword.intent}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {keyword.brand}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {keyword.asins.length > 0
                        ? `${keyword.asins.length} ASIN${keyword.asins.length > 1 ? "s" : ""}`
                        : "None"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white font-mono">
                      ${keyword.bid.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          keyword.status === "active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {keyword.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                          <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Drawer - Keyword Details */}
      {selectedKeyword && (
        <div className="w-96 border-l bg-white dark:bg-slate-800 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Keyword Details
            </h2>
            <button
              onClick={() => setSelectedKeyword(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Keyword
              </label>
              <input
                type="text"
                value={selectedKeyword.keyword}
                className="w-full px-3 py-2 rounded-md border bg-white dark:bg-slate-900 text-sm"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Match Type
              </label>
              <select className="w-full px-3 py-2 rounded-md border bg-white dark:bg-slate-900 text-sm">
                <option value="exact">Exact</option>
                <option value="phrase">Phrase</option>
                <option value="broad">Broad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Intent
              </label>
              <select className="w-full px-3 py-2 rounded-md border bg-white dark:bg-slate-900 text-sm">
                <option value="Awareness">Awareness</option>
                <option value="Consideration">Consideration</option>
                <option value="Conversion">Conversion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Brand
              </label>
              <input
                type="text"
                value={selectedKeyword.brand}
                className="w-full px-3 py-2 rounded-md border bg-white dark:bg-slate-900 text-sm"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Bid ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={selectedKeyword.bid}
                className="w-full px-3 py-2 rounded-md border bg-white dark:bg-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Associated ASINs
              </label>
              <div className="space-y-2">
                {selectedKeyword.asins.map((asin, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                  >
                    {asin}
                  </div>
                ))}
                {selectedKeyword.asins.length === 0 && (
                  <p className="text-sm text-slate-500">No ASINs associated</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
