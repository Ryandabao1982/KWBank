"use client"

import { useState } from "react"
import { ChevronDown, Search, Moon, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"

const brands = ["Nike", "Adidas", "Puma", "All Brands"]

export function TopBar() {
  const [selectedBrand, setSelectedBrand] = useState(brands[0])
  const [darkMode, setDarkMode] = useState(false)

  return (
    <header className="h-16 border-b bg-white dark:bg-slate-950 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Brand Switcher */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 rounded-md border bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
            <span className="font-medium text-sm">{selectedBrand}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span>Dashboard</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search... (⌘+K)"
            className="pl-10 pr-4 py-2 rounded-md border bg-white dark:bg-slate-900 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* User Avatar */}
        <button className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600 text-white hover:bg-indigo-700">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
