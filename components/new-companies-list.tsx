import Image from "next/image";
import { Calendar, ExternalLink, MapPin, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const newCompanies = [
  {
    id: 1,
    name: "TechInnovate",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Software development and IT consulting services",
    location: "Freetown",
    founded: "May 2024",
    employees: "10-20",
  },
  {
    id: 2,
    name: "GreenFarms",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Organic farming and sustainable agriculture",
    location: "Bo",
    founded: "April 2024",
    employees: "5-10",
  },
  {
    id: 3,
    name: "UrbanMobility",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Transportation and logistics solutions",
    location: "Freetown",
    founded: "April 2024",
    employees: "10-20",
  },
  {
    id: 4,
    name: "EduLearn",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Educational technology and e-learning platforms",
    location: "Kenema",
    founded: "March 2024",
    employees: "5-10",
  },
];

export function NewCompaniesList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {newCompanies.map((company) => (
        <Card key={company.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-muted">
                <Image
                  src={company.logo || "/placeholder.svg"}
                  alt={`${company.name} logo`}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{company.name}</h3>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {company.description}
            </p>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-3.5 w-3.5" />
                {company.location}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-2 h-3.5 w-3.5" />
                Founded {company.founded}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Users className="mr-2 h-3.5 w-3.5" />
                {company.employees} employees
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              View Profile <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
