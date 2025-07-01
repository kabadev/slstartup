"use client";

import { useState } from "react";
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronRight,
  TrendingUp,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/stat-card";
import { SectorCard } from "@/components/sector-card";
import { RecentRoundsTable } from "@/components/recent-rounds-table";
import { HotStartupsList } from "@/components/hot-startups-list";
import { NewCompaniesList } from "@/components/new-companies-list";
import { Separator } from "@radix-ui/react-dropdown-menu";
import FundingRounds from "@/app/(app)/funding-rounds/page";
import RoundsTable from "./rounds-table";

export function DashboardPage({ stats }: any) {
  // const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            StartUp-SL Ecosystem
          </h1>
          <p className="text-muted-foreground">
            Your gateway to Sierra Leone's startup ecosystem.
          </p>
        </div>
      </div>

      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Companies"
          value="934"
          icon={<Building2 className="h-4 w-4" />}
          description="+8% from last month"
          trend="up"
        />
        <StatCard
          title="Rounds"
          value="99"
          icon={<TrendingUp className="h-4 w-4" />}
          description="+12% from last month"
          trend="up"
        />
        <StatCard
          title="Employees"
          value="50,403"
          icon={<Users className="h-4 w-4" />}
          description="+5% from last month"
          trend="up"
        />
        <StatCard
          title="VC Investment"
          value="$42M"
          icon={<BarChart3 className="h-4 w-4" />}
          description="+15% from last month"
          trend="up"
        />
      </div> */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Companies"
          value={stats.companies.total.toLocaleString()}
          description={`${stats.companies.change > 0 ? "+" : ""}${
            stats.companies.change
          }% from last month`}
          icon={<Building2 className="h-4 w-4" />}
          trend={stats.companies.change > 0 ? "up" : "down"}
        />
        <StatCard
          title="Rounds"
          value={stats.rounds.total?.toLocaleString()}
          description={`${stats.rounds.change > 0 ? "+" : ""}${
            stats.rounds.change
          }% from last month`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={stats.rounds.change > 0 ? "up" : "down"}
        />
        <StatCard
          title="Employees"
          value={` ${stats.employees.range}`}
          description={`${stats.employees.change > 0 ? "+" : ""}${
            stats.employees.change
          }% from last month`}
          icon={<Users className="h-4 w-4" />}
          trend={stats.employees.change > 0 ? "up" : "down"}
        />
        <StatCard
          title="VC Investment"
          value={`$${stats.vcInvestment.total.toFixed(1)}M`}
          description={`${stats.vcInvestment.change > 0 ? "+" : ""}${
            stats.vcInvestment.change
          }% from last month`}
          icon={<BarChart3 className="h-4 w-4" />}
          trend={stats.vcInvestment.change > 0 ? "up" : "down"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-full md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                About StartUp-SL
              </CardTitle>
              <CardDescription>
                An ecosystem for all to share resources, collaborate and support
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Read More <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              StartUp-SL is a comprehensive ecosystem designed to foster
              innovation and growth in Sierra Leone&apos;s startup community. We
              encourage startups and established companies to register with us
              to access resources, networking opportunities, and support
              services that can help accelerate their growth.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Connect with the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Startup Pitch Night</h4>
                <p className="text-xs text-muted-foreground">
                  May 15, 2024 • Freetown
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Investor Meetup</h4>
                <p className="text-xs text-muted-foreground">
                  May 22, 2024 • Virtual
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              See More Events
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="hot-startups" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="hot-startups">Hot Startups</TabsTrigger>
          <TabsTrigger value="recent-rounds">Recent Rounds</TabsTrigger>
          <TabsTrigger value="new-companies">New Companies</TabsTrigger>
        </TabsList>
        <TabsContent value="hot-startups" className="mt-4">
          <HotStartupsList hotCompanys={stats.hotCompanys} />
        </TabsContent>
        <TabsContent value="recent-rounds" className="mt-4">
          <RoundsTable />
        </TabsContent>
        <TabsContent value="new-companies" className="mt-4">
          <NewCompaniesList />
        </TabsContent>
      </Tabs>

      <div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Sectors</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <SectorCard title="Technology" count={156} color="bg-blue-500" />
          <SectorCard title="Healthcare" count={87} color="bg-green-500" />
          <SectorCard title="Finance" count={124} color="bg-purple-500" />
          <SectorCard title="Education" count={93} color="bg-amber-500" />
          <SectorCard title="Agriculture" count={142} color="bg-emerald-500" />
          <SectorCard title="Energy" count={68} color="bg-red-500" />
          <SectorCard title="Retail" count={112} color="bg-indigo-500" />
          <SectorCard title="Transportation" count={52} color="bg-orange-500" />
        </div>
      </div>
    </div>
  );
}
