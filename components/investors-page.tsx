"use client";

import Image from "next/image";
import { Filter, Globe, Mail, MapPin, Plus, Search } from "lucide-react";

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

const investors = [
  {
    id: 1,
    name: "Green Ventures",
    logo: "/placeholder.svg?height=80&width=80",
    type: "Venture Capital",
    focus: ["Agriculture", "Energy", "Sustainability"],
    investments: 12,
    location: "Freetown",
    website: "greenventures.sl",
    contact: "info@greenventures.sl",
  },
  {
    id: 2,
    name: "Digital Investments",
    logo: "/placeholder.svg?height=80&width=80",
    type: "Venture Capital",
    focus: ["Technology", "Fintech", "E-commerce"],
    investments: 18,
    location: "Freetown",
    website: "digitalinvestments.sl",
    contact: "info@digitalinvestments.sl",
  },
  {
    id: 3,
    name: "Health Innovations",
    logo: "/placeholder.svg?height=80&width=80",
    type: "Angel Group",
    focus: ["Healthcare", "Biotech", "Wellness"],
    investments: 8,
    location: "Bo",
    website: "healthinnovations.sl",
    contact: "info@healthinnovations.sl",
  },
  {
    id: 4,
    name: "Impact Investors",
    logo: "/placeholder.svg?height=80&width=80",
    type: "Impact Fund",
    focus: ["Education", "Healthcare", "Clean Energy"],
    investments: 15,
    location: "Freetown",
    website: "impactinvestors.sl",
    contact: "info@impactinvestors.sl",
  },
  {
    id: 5,
    name: "Growth Partners",
    logo: "/placeholder.svg?height=80&width=80",
    type: "Private Equity",
    focus: ["Manufacturing", "Retail", "Infrastructure"],
    investments: 7,
    location: "Kenema",
    website: "growthpartners.sl",
    contact: "info@growthpartners.sl",
  },
  {
    id: 6,
    name: "Sierra Angels",
    logo: "/placeholder.svg?height=80&width=80",
    type: "Angel Network",
    focus: ["Technology", "Consumer", "Media"],
    investments: 22,
    location: "Freetown",
    website: "sierraangels.sl",
    contact: "info@sierraangels.sl",
  },
];

export function InvestorsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investors</h1>
          <p className="text-muted-foreground">
            Connect with investors funding Sierra Leone's future
          </p>
        </div>
      </div>

      <Card className="border-none">
        <CardHeader>
          <CardTitle>Investor Directory</CardTitle>
          <CardDescription>
            Browse active investors in the ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search investors..."
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="sm" className="md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full overflow-x-auto">
                <TabsTrigger
                  value="all"
                  className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4"
                >
                  All Investors
                </TabsTrigger>
                <TabsTrigger
                  value="vc"
                  className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4"
                >
                  Venture Capital
                </TabsTrigger>
                <TabsTrigger
                  value="angel"
                  className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4"
                >
                  Angel Investors
                </TabsTrigger>
                <TabsTrigger
                  value="impact"
                  className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4"
                >
                  Impact Funds
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {investors.map((investor) => (
                    <Card key={investor.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-4 border-b p-4">
                            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-muted">
                              <Image
                                src={investor.logo || "/placeholder.svg"}
                                alt={`${investor.name} logo`}
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">{investor.name}</h3>
                              <Badge variant="outline" className="mt-1">
                                {investor.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex flex-wrap gap-1 mb-4">
                              {investor.focus.map((area) => (
                                <Badge
                                  key={area}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {area}
                                </Badge>
                              ))}
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <MapPin className="mr-2 h-3.5 w-3.5" />
                                {investor.location}
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Globe className="mr-2 h-3.5 w-3.5" />
                                {investor.website}
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Mail className="mr-2 h-3.5 w-3.5" />
                                {investor.contact}
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {investor.investments} Investments
                              </span>
                              <Button variant="outline" size="sm">
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="vc" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {investors
                    .filter((i) => i.type === "Venture Capital")
                    .map((investor) => (
                      <Card key={investor.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-4 border-b p-4">
                              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-muted">
                                <Image
                                  src={investor.logo || "/placeholder.svg"}
                                  alt={`${investor.name} logo`}
                                  width={80}
                                  height={80}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {investor.name}
                                </h3>
                                <Badge variant="outline" className="mt-1">
                                  {investor.type}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex flex-wrap gap-1 mb-4">
                                {investor.focus.map((area) => (
                                  <Badge
                                    key={area}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {area}
                                  </Badge>
                                ))}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 w-full"
                              >
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="angel" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {investors
                    .filter(
                      (i) =>
                        i.type === "Angel Group" || i.type === "Angel Network"
                    )
                    .map((investor) => (
                      <Card key={investor.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-4 border-b p-4">
                              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-muted">
                                <Image
                                  src={investor.logo || "/placeholder.svg"}
                                  alt={`${investor.name} logo`}
                                  width={80}
                                  height={80}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {investor.name}
                                </h3>
                                <Badge variant="outline" className="mt-1">
                                  {investor.type}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex flex-wrap gap-1 mb-4">
                                {investor.focus.map((area) => (
                                  <Badge
                                    key={area}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {area}
                                  </Badge>
                                ))}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 w-full"
                              >
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="impact" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {investors
                    .filter((i) => i.type === "Impact Fund")
                    .map((investor) => (
                      <Card key={investor.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-4 border-b p-4">
                              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-muted">
                                <Image
                                  src={investor.logo || "/placeholder.svg"}
                                  alt={`${investor.name} logo`}
                                  width={80}
                                  height={80}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {investor.name}
                                </h3>
                                <Badge variant="outline" className="mt-1">
                                  {investor.type}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex flex-wrap gap-1 mb-4">
                                {investor.focus.map((area) => (
                                  <Badge
                                    key={area}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {area}
                                  </Badge>
                                ))}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 w-full"
                              >
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
