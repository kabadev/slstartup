import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const recentRounds = [
  {
    id: 1,
    company: "EcoHarvest",
    amount: "$2.5M",
    type: "Seed",
    date: "Apr 12, 2024",
    investors: "Green Ventures, AgriTech Fund",
  },
  {
    id: 2,
    company: "PayQuick",
    amount: "$8M",
    type: "Series A",
    date: "Apr 5, 2024",
    investors: "FinTech Capital, Digital Investments",
  },
  {
    id: 3,
    company: "MediConnect",
    amount: "$1.2M",
    type: "Pre-seed",
    date: "Mar 28, 2024",
    investors: "Health Innovations, Angel Group",
  },
  {
    id: 4,
    company: "SolarGrid",
    amount: "$3.7M",
    type: "Seed",
    date: "Mar 15, 2024",
    investors: "Clean Energy Fund, Impact Investors",
  },
  {
    id: 5,
    company: "EduTech",
    amount: "$5M",
    type: "Series A",
    date: "Mar 8, 2024",
    investors: "Education Ventures, Growth Partners",
  },
]

export function RecentRoundsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="hidden md:table-cell">Investors</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentRounds.map((round) => (
            <TableRow key={round.id}>
              <TableCell className="font-medium">{round.company}</TableCell>
              <TableCell>{round.amount}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    round.type === "Series A"
                      ? "border-blue-500 text-blue-500"
                      : round.type === "Seed"
                        ? "border-green-500 text-green-500"
                        : "border-amber-500 text-amber-500"
                  }
                >
                  {round.type}
                </Badge>
              </TableCell>
              <TableCell>{round.date}</TableCell>
              <TableCell className="hidden md:table-cell">{round.investors}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

