"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Database, 
  Upload, 
  GitBranch, 
  Target, 
  FileText, 
  Settings,
  AlertCircle
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Bank", href: "/bank", icon: Database },
  { name: "Imports", href: "/imports", icon: Upload },
  { name: "Mappings", href: "/mappings", icon: GitBranch },
  { name: "Campaigns", href: "/campaigns", icon: Target },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Conflicts", href: "/conflicts", icon: AlertCircle },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-slate-50 dark:bg-slate-900 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          KWBank
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Keyword Management
        </p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
