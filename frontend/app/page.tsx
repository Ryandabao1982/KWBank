"use client"

import { Database, Upload, Target, AlertCircle, TrendingUp, CheckCircle } from "lucide-react"

const stats = [
  {
    name: "Total Keywords",
    value: "12,543",
    change: "+12.5%",
    icon: Database,
    color: "bg-indigo-500",
  },
  {
    name: "Active Campaigns",
    value: "23",
    change: "+3",
    icon: Target,
    color: "bg-emerald-500",
  },
  {
    name: "Duplicates Prevented",
    value: "1,247",
    change: "90%",
    icon: CheckCircle,
    color: "bg-amber-500",
  },
  {
    name: "Conflicts Detected",
    value: "5",
    change: "-2",
    icon: AlertCircle,
    color: "bg-red-500",
  },
]

const recentImports = [
  { brand: "Nike", keywords: 543, date: "2 hours ago", status: "completed" },
  { brand: "Adidas", keywords: 234, date: "5 hours ago", status: "completed" },
  { brand: "Puma", keywords: 167, date: "1 day ago", status: "completed" },
]

const recentCampaigns = [
  { name: "NIKE_EXACT_3ASIN_20251020", status: "active", budget: "$50.00" },
  { name: "ADIDAS_BROAD_5ASIN_20251019", status: "active", budget: "$75.00" },
  { name: "PUMA_PHRASE_2ASIN_20251018", status: "paused", budget: "$30.00" },
]

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Overview of your keyword bank and campaigns
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Imports */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Recent Imports
            </h2>
          </div>
          <div className="space-y-3">
            {recentImports.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-900"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {item.brand}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.keywords} keywords • {item.date}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Recent Campaigns
            </h2>
          </div>
          <div className="space-y-3">
            {recentCampaigns.map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-900"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">
                    {campaign.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Budget: {campaign.budget}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    campaign.status === "active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {campaign.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="font-medium text-slate-900 dark:text-white">
              Import Keywords
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Upload CSV file
            </p>
          </button>
          <button className="p-4 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="font-medium text-slate-900 dark:text-white">
              Create Campaign
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Generate new campaign
            </p>
          </button>
          <button className="p-4 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="font-medium text-slate-900 dark:text-white">
              Check Conflicts
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Detect duplicates
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
