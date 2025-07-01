"use client";

import { BarChart3, Calendar, Filter, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const fundingRounds = [
  {
    id: 1,
    company: "EcoHarvest",
    amount: "$2.5M",
    type: "Seed",
    date: "Apr 12, 2024",
    investors: "Green Ventures, AgriTech Fund",
    sector: "Agriculture",
  },
  {
    id: 2,
    company: "PayQuick",
    amount: "$8M",
    type: "Series A",
    date: "Apr 5, 2024",
    investors: "FinTech Capital, Digital Investments",
    sector: "Fintech",
  },
  {
    id: 3,
    company: "MediConnect",
    amount: "$1.2M",
    type: "Pre-seed",
    date: "Mar 28, 2024",
    investors: "Health Innovations, Angel Group",
    sector: "Healthcare",
  },
  {
    id: 4,
    company: "SolarGrid",
    amount: "$3.7M",
    type: "Seed",
    date: "Mar 15, 2024",
    investors: "Clean Energy Fund, Impact Investors",
    sector: "Energy",
  },
  {
    id: 5,
    company: "EduTech",
    amount: "$5M",
    type: "Series A",
    date: "Mar 8, 2024",
    investors: "Education Ventures, Growth Partners",
    sector: "Education",
  },
  {
    id: 6,
    company: "LogiMove",
    amount: "$2.1M",
    type: "Seed",
    date: "Feb 22, 2024",
    investors: "Sierra Angels, Transport Fund",
    sector: "Transportation",
  },
  {
    id: 7,
    company: "BuildRight",
    amount: "$6.5M",
    type: "Series A",
    date: "Feb 15, 2024",
    investors: "Construction Capital, Growth Partners",
    sector: "Construction",
  },
  {
    id: 8,
    company: "FreshFoods",
    amount: "$3.2M",
    type: "Seed",
    date: "Feb 8, 2024",
    investors: "Retail Ventures, Food Innovation Fund",
    sector: "Retail",
  },
];

export function FundingRoundsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funding Rounds</h1>
          <p className="text-muted-foreground">
            Track investment activity in the ecosystem
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Funding Round
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$32.2M</div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Round Size
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4.03M</div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rounds</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Most Active Sector
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Agriculture</div>
            <p className="text-xs text-muted-foreground">$5.7M total funding</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Funding Rounds</CardTitle>
          <CardDescription>Browse all funding activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search funding rounds..."
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="sm" className="md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Rounds</TabsTrigger>
                <TabsTrigger value="seed">Seed</TabsTrigger>
                <TabsTrigger value="series-a">Series A</TabsTrigger>
                <TabsTrigger value="pre-seed">Pre-seed</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Investors
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Sector
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fundingRounds.map((round) => (
                        <TableRow key={round.id}>
                          <TableCell className="font-medium">
                            {round.company}
                          </TableCell>
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
                          <TableCell className="hidden md:table-cell">
                            {round.investors}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {round.sector}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="seed" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Investors
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Sector
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fundingRounds
                        .filter((r) => r.type === "Seed")
                        .map((round) => (
                          <TableRow key={round.id}>
                            <TableCell className="font-medium">
                              {round.company}
                            </TableCell>
                            <TableCell>{round.amount}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="border-green-500 text-green-500"
                              >
                                {round.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{round.date}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {round.investors}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {round.sector}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="series-a" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Investors
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Sector
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fundingRounds
                        .filter((r) => r.type === "Series A")
                        .map((round) => (
                          <TableRow key={round.id}>
                            <TableCell className="font-medium">
                              {round.company}
                            </TableCell>
                            <TableCell>{round.amount}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="border-blue-500 text-blue-500"
                              >
                                {round.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{round.date}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {round.investors}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {round.sector}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="pre-seed" className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Investors
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Sector
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fundingRounds
                        .filter((r) => r.type === "Pre-seed")
                        .map((round) => (
                          <TableRow key={round.id}>
                            <TableCell className="font-medium">
                              {round.company}
                            </TableCell>
                            <TableCell>{round.amount}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="border-amber-500 text-amber-500"
                              >
                                {round.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{round.date}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {round.investors}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {round.sector}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
