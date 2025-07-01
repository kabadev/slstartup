"use client";

import { useEffect, useState } from "react";
import { SectorCard } from "@/components/sector-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Filter, TrendingUp } from "lucide-react";
import { sectorsData } from "@/data/sectors";
import SectorGrowthChart from "./SectorGrowthChart";

type SectorStat = {
  _id: string;
  count: number;
};

type SectorResponse = {
  all: SectorStat[];
  trending: SectorStat[];
  emerging: SectorStat[];
};

export function SectorsPage({ sectors, chartData, displayedSectors }: any) {
  const [sectorStats, setSectorStats] = useState<SectorResponse | null>(null);

  useEffect(() => {
    fetch("/api/sectors")
      .then((res) => res.json())
      .then((data) => setSectorStats(data));
  }, []);

  const getColor = (title: string) =>
    sectorsData?.find((s: any) => s.title.toLowerCase() === title.toLowerCase())
      ?.color || "bg-gray-300";

  const renderSectorCards = (data: SectorStat[]) =>
    data.map((sector) => (
      <SectorCard
        key={sector._id}
        title={sector._id}
        count={sector.count}
        color={getColor(sector._id)}
      />
    ));

  return (
    <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sectors</h1>
          <p className="text-muted-foreground">
            Explore different sectors in the startup ecosystem
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Sectors</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="emerging">Emerging</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sectors ? renderSectorCards(sectors.all) : "Loading..."}
          </div>
        </TabsContent>
        <TabsContent value="trending" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sectors ? renderSectorCards(sectors.trending) : "Loading..."}
          </div>
        </TabsContent>
        <TabsContent value="emerging" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sectors ? renderSectorCards(sectors.emerging) : "Loading..."}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Sector Growth Analysis</CardTitle>
          <CardDescription>Year-over-year growth by sector</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <SectorGrowthChart data={chartData} sectors={displayedSectors} />
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle>Sector Growth Analysis</CardTitle>
          <CardDescription>Year-over-year growth by sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted/25 rounded-md flex items-center justify-center text-muted-foreground">
            <BarChart3 className="mr-2 h-5 w-5" />
            Sector growth chart visualization
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
