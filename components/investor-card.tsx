"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  DollarSign,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

// Define the type for the investor prop
interface Investor {
  _id: string;
  name: string;
  logo?: string;
  type?: string;
  description?: string;
  location?: string;
  foundedAt?: string;
  fundingCapacity?: string;
  sectorInterested?: string[];
}

export default function InvestorCard({ investor }: { investor: Investor }) {
  const { user } = useUser();
  return (
    <Card className="h-full border-none flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
            {investor.logo ? (
              <Image
                src={investor.logo || "/placeholder.svg"}
                alt={`${investor.name} logo`}
                fill
                className="object-cover"
              />
            ) : (
              <Building2 className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-semibold line-clamp-1">{investor.name}</h3>
            {investor.type && (
              <p className="text-sm text-muted-foreground">{investor.type}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {investor.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {investor.description}
          </p>
        )}

        <div className="space-y-2">
          {investor.location && (
            <div className="flex items-center text-sm">
              <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <span className="line-clamp-1">{investor.location}</span>
            </div>
          )}

          {investor.foundedAt && (
            <div className="flex items-center text-sm">
              <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <span>Founded {investor.foundedAt}</span>
            </div>
          )}

          {investor.fundingCapacity && (
            <div className="flex items-center text-sm">
              <DollarSign className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <span>Funding capacity: {investor.fundingCapacity}</span>
            </div>
          )}
        </div>

        {investor.sectorInterested && investor.sectorInterested.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1.5">
              {investor.sectorInterested.slice(0, 3).map((sector, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {sector}
                </Badge>
              ))}
              {investor.sectorInterested.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{investor.sectorInterested.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/investors/${investor._id}`}>
            View Profile
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
