"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  MapPin,
  Calendar,
  Globe,
  Mail,
  Phone,
  FileText,
  DollarSign,
  Briefcase,
  Edit,
  ArrowLeft,
  Trash2,
  AlertTriangle,
  ExternalLink,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// import { deleteInvestor } from "@/app/actions/investor-actions";
import { deleteInvestor } from "@/lib/db-simulation"; // Adjust the import path as necessary
import type { Investor } from "@/lib/db-simulation";
import { useUser } from "@clerk/nextjs";

// interface InvestorDetailsProps {
//   investor: Investor;
// }

export default function InvestorDetails({ investor }: any) {
  const router = useRouter();
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteInvestor(investor?._id);
      router.push("/investors");
      router.refresh();
    } catch (error) {
      console.error("Error deleting investor:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        {/* Header with navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/investors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Investors
            </Link>
          </Button>
          <div className="flex gap-2">
            {user?.id === investor?.userId && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/investors/${investor?._id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Basic info */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted mb-4 flex items-center justify-center">
                  {investor?.logo ? (
                    <Image
                      src={investor?.logo || "/placeholder.svg"}
                      alt={`${investor?.name} logo`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Building2 className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="text-xl">{investor?.name}</CardTitle>
                {investor?.type && (
                  <CardDescription className="text-sm">
                    {investor?.type}
                  </CardDescription>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investor?.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{investor?.location}</span>
                  </div>
                )}
                {investor?.foundedAt && (
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Founded {investor?.foundedAt}</span>
                  </div>
                )}
                {investor?.website && (
                  <div className="flex items-center text-sm">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a
                      href={
                        investor?.website.startsWith("http")
                          ? investor?.website
                          : `https://${investor?.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      {investor?.website.replace(/^https?:\/\//, "")}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
                {investor?.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a
                      href={`mailto:${investor?.email}`}
                      className="text-primary hover:underline"
                    >
                      {investor?.email}
                    </a>
                  </div>
                )}
                {investor?.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a
                      href={`tel:${investor?.phone}`}
                      className="text-primary hover:underline"
                    >
                      {investor?.phone}
                    </a>
                  </div>
                )}
              </div>

              {investor?.socialLinks && investor?.socialLinks.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Social Links</h4>
                    <div className="flex flex-wrap gap-2">
                      {investor?.socialLinks.map((social: any, index: any) => (
                        <Button key={index} variant="outline" size="sm" asChild>
                          <a
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs"
                          >
                            {social.name}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Right column - Detailed info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Investor Profile</CardTitle>
              {investor?.registrationNumber && (
                <CardDescription>
                  Registration: {investor?.registrationNumber}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              {investor?.description && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">About</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {investor?.description}
                  </p>
                </div>
              )}

              {/* Investment Preferences */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Investment Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {investor?.stage && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Preferred Stage
                      </p>
                      <p className="text-sm font-medium">{investor?.stage}</p>
                    </div>
                  )}
                  {investor?.fundingCapacity && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Funding Capacity
                      </p>
                      <p className="text-sm font-medium">
                        {investor?.fundingCapacity}
                      </p>
                    </div>
                  )}
                  {investor?.amountRaised !== undefined && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Amount Raised
                      </p>
                      <p className="text-sm font-medium">
                        ${investor?.amountRaised.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {investor?.goalExpected && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Investment Goal
                      </p>
                      <p className="text-sm font-medium">
                        {investor?.goalExpected}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sectors */}
              {investor?.sectorInterested &&
                investor?.sectorInterested.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Sectors of Interest</h3>
                    <div className="flex flex-wrap gap-2">
                      {investor?.sectorInterested.map(
                        (sector: any, index: any) => (
                          <Badge key={index} variant="secondary">
                            {sector}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Documents */}
              {(investor?.profileDocuments ||
                investor?.businessRegistrationDocuments) && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Documents</h3>
                  <div className="flex flex-wrap gap-2">
                    {investor?.profileDocuments && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        asChild
                      >
                        <a
                          href={investor?.profileDocuments}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="mr-2 h-3.5 w-3.5" />
                          Profile Documents
                        </a>
                      </Button>
                    )}
                    {investor?.businessRegistrationDocuments && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        asChild
                      >
                        <a
                          href={investor?.businessRegistrationDocuments}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Briefcase className="mr-2 h-3.5 w-3.5" />
                          Business Registration
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Address */}
              {investor?.address && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Address</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {investor?.address}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
