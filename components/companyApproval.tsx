import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Calendar,
  CheckCircle,
  Globe,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import type { ObjectId } from "mongodb";

// Define the company type based on your data structure
type SocialLink = {
  platform: string;
  url: string;
};

type Company = {
  _id: string | ObjectId;
  userId: string;
  name: string;
  sector: string;
  location: string;
  foundedAt: string;
  registrationNumber: string;
  type: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: SocialLink[];
  website: string;
  stage: string;
  description: string;
  missionStatement: string;
  fundingStatus: string;
  amountRaised: number;
  foundingDocuments: string;
  pitchDeck: string;
  fundingNeeded: number;
  employeesRange: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v?: number;
};

interface CompanyDetailsProps {
  company: Company;
}

export default function CompanyDetails({ company }: CompanyDetailsProps) {
  console.log(company);
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Company Verification</h1>
            <p className="text-muted-foreground mt-1">
              Review and verify company details
            </p>
          </div>
          <Badge
            variant="outline"
            className="px-3 py-1 bg-amber-50 text-amber-700 border-amber-200"
          >
            Pending Verification
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>Basic details about the company</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Company Name
                </h3>
                <p className="text-base font-medium">{company.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Registration Number
                </h3>
                <p className="text-base">{company.registrationNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Type
                </h3>
                <p className="text-base">{company.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Sector
                </h3>
                <p className="text-base">{company.sector}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Founded
                  </div>
                </h3>
                <p className="text-base">{formatDate(company.foundedAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Employees
                  </div>
                </h3>
                <p className="text-base">{company.employeesRange}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </h3>
              <p className="text-base">{company.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Mission Statement
              </h3>
              <p className="text-base">{company.missionStatement}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Email
                  </h3>
                  <p className="text-base">{company.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Phone
                  </h3>
                  <p className="text-base">{company.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Address
                  </h3>
                  <p className="text-base">{company.address}</p>
                  <p className="text-base">{company.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Website
                  </h3>
                  <p className="text-base">{company.website}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Funding Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Company Stage
                </h3>
                <p className="text-base">{company.stage}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Funding Status
                </h3>
                <p className="text-base">{company.fundingStatus}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Amount Raised
                </h3>
                <p className="text-base">
                  {formatCurrency(company.amountRaised)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Funding Needed
                </h3>
                <p className="text-base">
                  {formatCurrency(company.fundingNeeded)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Founding Documents
                </h3>
                {company.foundingDocuments ? (
                  <a
                    href={company.foundingDocuments}
                    className="text-primary hover:underline"
                  >
                    View Document
                  </a>
                ) : (
                  <p className="text-muted-foreground italic">
                    No document provided
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Pitch Deck
                </h3>
                {company.pitchDeck ? (
                  <a
                    href={company.pitchDeck}
                    className="text-primary hover:underline"
                  >
                    View Pitch Deck
                  </a>
                ) : (
                  <p className="text-muted-foreground italic">
                    No pitch deck provided
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            {company.socialLinks && company.socialLinks.length > 0 ? (
              <div className="space-y-3">
                {company.socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <h3 className="text-sm font-medium">{link.platform}:</h3>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {link.url}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                No social links provided
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p>Company information is complete</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p>Contact details are valid</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p>Funding information is consistent</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 justify-end">
            <Button variant="outline">Reject</Button>
            <Button>Approve Verification</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
