import type React from "react"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  description?: string
  trend?: "up" | "down" | "neutral"
}

export function StatCard({ title, value, icon, description, trend = "neutral" }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="mt-1 flex items-center text-xs text-muted-foreground">
            {trend === "up" && <ArrowUpIcon className="mr-1 h-3 w-3 text-emerald-500" />}
            {trend === "down" && <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />}
            <span className={cn(trend === "up" && "text-emerald-500", trend === "down" && "text-red-500")}>
              {description}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

