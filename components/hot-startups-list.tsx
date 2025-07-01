import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const hotStartups = [
  {
    id: 1,
    name: "EcoHarvest",
    logo: "/placeholder.svg?height=40&width=40",
    description:
      "Sustainable agriculture technology solutions for small-scale farmers",
    sector: "Agriculture",
    employees: 28,
    founded: 2020,
  },
  {
    id: 2,
    name: "PayQuick",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Mobile payment platform for seamless transactions",
    sector: "Fintech",
    employees: 42,
    founded: 2019,
  },
  {
    id: 3,
    name: "MediConnect",
    logo: "/placeholder.svg?height=40&width=40",
    description:
      "Telemedicine platform connecting patients with healthcare providers",
    sector: "Healthcare",
    employees: 35,
    founded: 2021,
  },
  {
    id: 4,
    name: "SolarGrid",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Renewable energy solutions for rural communities",
    sector: "Energy",
    employees: 24,
    founded: 2020,
  },
];

export function HotStartupsList({ hotCompanys }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {hotCompanys.map((startup: any) => (
        <Card key={startup._id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-4 border-b p-4">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-muted">
                  <Image
                    src={startup.logo || "/placeholder.svg"}
                    alt={`${startup.name} logo`}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{startup.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {startup.sector}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  {startup.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{startup.employeesRange} employees</span>
                  <span>Founded {startup.founded}</span>
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  <Link href={`/companies/${startup._id}`}>
                    View Profile <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
