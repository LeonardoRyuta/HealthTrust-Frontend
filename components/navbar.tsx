"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-emerald-600" />
            <span className="font-bold">HealthTrust</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-1 sm:space-x-2">
          <Link href="/" passHref>
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              className={cn("text-sm", pathname === "/" && "bg-emerald-600 hover:bg-emerald-700")}
            >
              Marketplace
            </Button>
          </Link>
          <Link href="/dashboard" passHref>
            <Button
              variant={pathname === "/dashboard" ? "default" : "ghost"}
              className={cn("text-sm", pathname === "/dashboard" && "bg-emerald-600 hover:bg-emerald-700")}
            >
              Dashboard
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
