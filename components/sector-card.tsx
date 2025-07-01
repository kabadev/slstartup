import { cn } from "@/lib/utils"

interface SectorCardProps {
  title: string
  count: number
  color: string
}

export function SectorCard({ title, count, color }: SectorCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-md">
      <div className={cn("absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-20", color)} />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{count} companies</p>
      <div className="mt-4 flex items-center justify-between">
        <div className={cn("h-2 w-full rounded-full bg-muted")}>
          <div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(count / 2, 100)}%` }} />
        </div>
      </div>
    </div>
  )
}

