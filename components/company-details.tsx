"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Download,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Share2,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import RoundsTable from "./rounds-table";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCompanyRounds } from "@/app/actions/round-actions";
import FollowButton from "./FollowButton";

// Define the Company interface based on your MongoDB schema
interface Company {
  _id: string;
  userId: string;
  name: string;
  sector: string;
  otherSector?: string;
  type?: string;
  stage?: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  socialLinks?: { name: string; link: string }[];
  location?: string;
  foundedAt?: string;
  registrationNumber?: string;
  description?: string;
  missionStatement?: string;
  employeesRange?: string;
  fundingStatus?: string;
  amountRaised?: number;
  fundingNeeded?: number;
  fundingDocuments?: string;
  pitchDeck?: string;
  headOfficeAddress?: string;
  logo?: string;
  businessModel?: string;
  otherBusinessModel?: string;
  isYouthLed?: boolean;
  isWomanLed?: boolean;
  founderName?: string;
  founderGender?: string;
  founderDob?: string;
  founderEducation?: string;
  taxCompliance?: string[];
  sectorLicenses?: string;
  hasIntellectualProperty?: boolean;
  annualTurnoverBefore?: string;
  annualTurnoverCurrent?: string;
  annualTurnoverNext?: string;
  hasBusinessBankAccount?: boolean;
  externalFunding?: string[];
  otherExternalFunding?: string;
  keepsFinancialRecords?: string;
  usesDigitalTools?: boolean;
  digitalTools?: string[];
  otherDigitalTools?: string;
  isInnovative?: boolean;
  innovationExplanation?: string;
  businessChallenges?: string[];
  otherBusinessChallenges?: string;
  supportNeeded?: string;
  planningExpansion?: boolean;
  expansionPlans?: string;
  employsVulnerableGroups?: boolean;
  addressesEnvironmentalSustainability?: boolean;
  impactInitiatives?: string;
  joinEcosystemPrograms?: boolean;
  consentToDataUsage?: boolean;
  additionalComments?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CompanyDetailsPageProps {
  company: Company;
}

export default function CompanyDetailsPage({
  company,
}: CompanyDetailsPageProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { toast } = useToast();

  // Format currency
  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date string to readable format
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get age from date of birth
  const getAge = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate business age
  const getBusinessAge = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const today = new Date();
    const foundedDate = new Date(dateString);
    let years = today.getFullYear() - foundedDate.getFullYear();
    const m = today.getMonth() - foundedDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < foundedDate.getDate())) {
      years--;
    }
    return `${years} ${years === 1 ? "year" : "years"}`;
  };

  // Calculate funding progress percentage
  const calculateFundingProgress = () => {
    if (!company.amountRaised || !company.fundingNeeded) return 0;
    const progress = (company.amountRaised / company.fundingNeeded) * 100;
    return Math.min(progress, 100); // Cap at 100%
  };

  // Fetch funding rounds
  const fetchRounds = async () => {
    try {
      setLoading(true);
      const rounds: any = await getCompanyRounds(company._id);

      setRounds(rounds);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching rounds:", error);
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchRounds();
  // }, [company._id]);

  useEffect(() => {
    if (company?._id) {
      fetchRounds();
    }
  }, [company?._id]);

  // Handle share button click
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: company.name,
          text: company.missionStatement || `Check out ${company.name}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard",
          description: "You can now share it with others",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Get badge color based on company stage
  const getStageBadgeColor = (stage: string | undefined) => {
    if (!stage) return "bg-gray-100 text-gray-800";

    const stageMap: Record<string, string> = {
      Idea: "bg-blue-50 text-blue-700 border-blue-200",
      "Pre-seed": "bg-purple-50 text-purple-700 border-purple-200",
      Seed: "bg-indigo-50 text-indigo-700 border-indigo-200",
      "Early Stage": "bg-emerald-50 text-emerald-700 border-emerald-200",
      Growth: "bg-amber-50 text-amber-700 border-amber-200",
      Mature: "bg-green-50 text-green-700 border-green-200",
    };

    return stageMap[stage] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  function calculateAge(founderDob: string): number {
    if (!founderDob) return NaN;
    const today = new Date();
    const birthDate = new Date(founderDob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  return (
    <div className="min-h-screen ">
      {/* Hero section with company info */}
      <div className="border-b dark:bg-accent">
        <div className="container px-4 py-8 mx-auto max-w-7xl">
          {/* Back button */}
          <div className="mb-6 ">
            <Link
              href="/companies"
              className="inline-flex items-center text-sm font-medium transition-colors text-slate-600 hover:text-slate-900 dark:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2 " />
              Back to Companies
            </Link>
          </div>

          <div className="flex flex-col items-start gap-8 md:flex-row">
            <div className="flex-shrink-0">
              <div className="relative flex items-center justify-center overflow-hidden border shadow-sm h-28 w-28 rounded-xl">
                {company?.logo ? (
                  <Image
                    src={company.logo || "/placeholder.svg"}
                    alt={`${company?.name || "Company"} logo`}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <Image
                    src="/placeholder.svg"
                    alt="Placeholder logo"
                    layout="fill"
                    objectFit="cover"
                  />
                )}
              </div>
            </div>

            {/* Company info */}
            <div className="flex-grow space-y-4 dark:text-white">
              <div>
                {/* <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold ">
                    {company.name}
                  </h1>
                  {company.stage && (
                    <Badge
                      variant="outline"
                      className={`font-medium px-3 py-1 rounded-full text-xs ${getStageBadgeColor(
                        company.stage
                      )}`}
                    >
                      {company.stage}
                    </Badge>
                  )}
                </div> */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold ">
                    {company?.name || "Loading..."}
                  </h1>
                  {company?.stage && <Badge>{company.stage}</Badge>}
                </div>

                {/* {company.missionStatement && (
                  <p className="max-w-3xl text-lg text-slate-600">
                    {company.missionStatement}
                  </p>
                )} */}
                {company?.missionStatement && (
                  <p className="max-w-3xl text-lg text-slate-600">
                    {company.missionStatement}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center text-sm gap-x-6 gap-y-2 text-slate-500">
                {/* <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1.5 text-slate-400" />
                  <span>{company.sector}</span>
                </div> */}
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1.5 text-slate-400" />
                  <span>{company?.sector || "Sector not available"}</span>
                </div>
                {/* {company.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5 text-slate-400" />
                    <span>{company.location}</span>
                  </div>
                )} */}
                {company?.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5 text-slate-400" />
                    <span>{company.location}</span>
                  </div>
                )}
                {/* {company.foundedAt && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 text-slate-400" />
                    <span>
                      Founded {new Date(company.foundedAt).getFullYear()}
                    </span>
                  </div>
                )} */}
                {company?.foundedAt && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 text-slate-400" />
                    <span>
                      {new Date(company.foundedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {/* {company.employeesRange && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1.5 text-slate-400" />
                    <span>{company.employeesRange}</span>
                  </div>
                )} */}
                {company?.employeesRange && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1.5 text-slate-400" />
                    <span>{company.employeesRange}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                {/* {company.isYouthLed && (
                  <Badge variant="secondary" className="font-normal">
                    Youth-led
                  </Badge>
                )} */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {company?.isYouthLed && (
                    <Badge variant="secondary" className="font-normal">
                      Youth-led
                    </Badge>
                  )}
                </div>
                {/* {company.isWomanLed && (
                  <Badge variant="secondary" className="font-normal">
                    Woman-led
                  </Badge>
                )} */}
                {company?.isWomanLed && (
                  <Badge variant="secondary" className="font-normal">
                    Woman-led
                  </Badge>
                )}
                {/* {company.isInnovative && (
                  <Badge variant="secondary" className="font-normal">
                    Innovative
                  </Badge>
                )} */}

                {company?.isInnovative && (
                  <Badge variant="secondary" className="font-normal">
                    Innovative
                  </Badge>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col w-full gap-2 mt-4 md:items-end md:mt-0 md:w-auto">
              <div className="flex items-center w-full gap-2 md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex-1 md:flex-none"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>

                {/* {user?.id === company.userId && (
                  <Link
                    href={`/companies/${company._id}/edit`}
                    className="flex-1 md:flex-none"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                )} */}

                {/* {user?.id === company?.userId && (
                  <Link
                    href={`/companies/${company._id}/edit`}
                    className="flex-1 md:flex-none"
                  >
                    Edit Company
                  </Link>
                )} */}
                {user?.id === company?.userId && (
                  <Link
                    href={`/companies/${company?._id}/edit`}
                    className="flex items-center justify-center flex-1 px-4 py-2 transition-colors border rounded-md md:flex-none bg-inherit hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                  >
                    Edit Company
                  </Link>
                )}
                {user && <FollowButton userId={company?.userId} />}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                    <DropdownMenuItem>Print details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* <Button className="w-full md:w-auto">Contact Company</Button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Key metrics */}
        <div className="grid grid-cols-1 gap-6 mb-10 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-0 shadow-md dark:bg-accent">
            <CardHeader className="pb-2 ">
              <CardDescription className="font-medium">
                Business Age
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* {getBusinessAge(company.foundedAt)}
              </div>
              {company.foundedAt && (
                <p className="mt-1 text-sm text-slate-500">
                  Founded {formatDate(company.foundedAt)}
                </p>
              )} */}
              <div className="text-2xl font-bold ">
                {company?.foundedAt ? getBusinessAge(company.foundedAt) : "N/A"}
              </div>
              {company?.foundedAt && (
                <p className="mt-1 text-sm text-slate-500">
                  Founded on {new Date(company.foundedAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md dark:bg-accent">
            <CardHeader className="pb-2 ">
              <CardDescription className="font-medium">
                Funding Status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <div className="flex items-center">
                <div className="text-2xl font-bold ">
                  {company.fundingStatus || "Not specified"}
                </div>
              </div> */}
              <div className="flex items-center">
                <div className="text-2xl font-bold ">
                  {company?.fundingStatus || "Not specified"}
                </div>
              </div>
              {/* {company.amountRaised && company.amountRaised > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-slate-500">
                      {formatCurrency(company.amountRaised)} raised
                    </span>
                    {company.fundingNeeded && (
                      <span className="text-slate-500">
                        {formatCurrency(company.fundingNeeded)} goal
                      </span>
                    )}
                  </div>
                  <Progress
                    value={calculateFundingProgress()}
                    className="h-2"
                  />
                </div>
              )} */}
              {company?.amountRaised && company.amountRaised > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-slate-500">Amount Raised</span>
                    <span className="font-medium ">
                      ${company.amountRaised.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md dark:bg-accent">
            <CardHeader className="pb-2 ">
              <CardDescription className="font-medium">
                Team Size
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold ">
                {company.employeesRange || "Not specified"}
              </div>
              {company.founderName && (
                <p className="mt-1 text-sm text-slate-500">
                  Founded by {company.founderName}
                </p>
              )} */}
              <div className="text-2xl font-bold ">
                {company?.employeesRange || "Not specified"}
              </div>
              {company?.founderName && (
                <p className="mt-1 text-sm text-slate-500">
                  Founder: {company.founderName}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md dark:bg-accent">
            <CardHeader className="pb-2 ">
              <CardDescription className="font-medium">
                Business Model
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold truncate">
                {company.businessModel === "Other"
                  ? company.otherBusinessModel
                  : company.businessModel || "Not specified"}
              </div>
              {company.type && (
                <p className="mt-1 text-sm text-slate-500">
                  {company.type} company
                </p>
              )} */}

              <div className="text-2xl font-bold truncate">
                {company?.businessModel === "Other"
                  ? company?.otherBusinessModel || "Not specified"
                  : company?.businessModel || "Not specified"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="overflow-x-auto border-b">
            <TabsList className="justify-start w-full h-12 gap-2 bg-transparent rounded-none">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                Overview
              </TabsTrigger>
              {user && (
                <>
                  <TabsTrigger
                    value="business"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-4"
                  >
                    Business Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="financial"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-4"
                  >
                    Financial
                  </TabsTrigger>
                  <TabsTrigger
                    value="innovation"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-4"
                  >
                    Innovation & Impact
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-4"
                  >
                    Documents
                  </TabsTrigger>
                  <TabsTrigger
                    value="contact"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-4"
                  >
                    Contact
                  </TabsTrigger>
                  <TabsTrigger
                    value="funding"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-4"
                  >
                    Funding Rounds
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b dark:bg-accent">
                    <CardTitle className="text-xl">Company Profile</CardTitle>
                  </CardHeader>
                  {/* <CardContent className="p-6">
                    {company.description ? (
                      <p className="leading-relaxed whitespace-pre-line text-slate-700">
                        {company.description}
                      </p>
                    ) : (
                      <p className="italic text-slate-500">
                        No company description provided.
                      </p>
                    )}
                  </CardContent> */}

                  <CardContent className="p-6">
                    {company?.description ? (
                      <p className="leading-relaxed whitespace-pre-line text-slate-700 dark:text-white">
                        {company.description}
                      </p>
                    ) : (
                      <p className="text-slate-500">No description available</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b dark:bg-accent">
                    <CardTitle className="text-xl">Key Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Industry
                          </h3>
                          {/* <p className="font-medium text-slate-900">
                            {company.sector}
                            {company.otherSector && ` - ${company.otherSector}`}
                          </p> */}
                          <p className="font-medium ">
                            {company?.sector || "Sector not specified"}
                            {company?.otherSector &&
                              ` - ${company.otherSector}`}
                          </p>
                        </div>
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Company Type
                          </h3>
                          {/* <p className="font-medium ">
                            {company.type || "Not specified"}
                          </p> */}
                          <p className="font-medium ">
                            {company?.type || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Founded
                          </h3>
                          {/* <p className="font-medium ">
                            {company.foundedAt
                              ? formatDate(company.foundedAt)
                              : "Not specified"}
                          </p> */}
                          <p className="font-medium ">
                            {company && company.foundedAt
                              ? formatDate(company.foundedAt)
                              : "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Registration Number
                          </h3>
                          {/* <p className="font-medium ">
                            {company.registrationNumber || "Not specified"}
                          </p> */}
                          <p className="font-medium ">
                            {company?.registrationNumber || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Location
                          </h3>
                          <p className="font-medium ">
                            {company?.location || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Team Size
                          </h3>
                          <p className="font-medium ">
                            {company?.employeesRange || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Business Model
                          </h3>
                          <p className="font-medium ">
                            {company?.businessModel === "Other"
                              ? company?.otherBusinessModel || "Not specified"
                              : company?.businessModel || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Head Office
                          </h3>
                          <p className="font-medium ">
                            {company?.headOfficeAddress || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b dark:bg-accent">
                    <CardTitle className="text-xl">Mission Statement</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* {company.missionStatement ? (
                      <blockquote className="pl-4 italic border-l-4 border-slate-200 text-slate-700">
                        "{company.missionStatement}"
                      </blockquote>
                    ) : (
                      <p className="italic text-slate-500">
                        No mission statement provided.
                      </p>
                    )} */}
                    <CardContent className="p-6">
                      {company?.missionStatement ? (
                        <blockquote className="pl-4 italic border-l-4 border-slate-200 text-slate-700 dark:text-white">
                          "{company.missionStatement}"
                        </blockquote>
                      ) : (
                        <p className="text-slate-500">
                          No mission statement available
                        </p>
                      )}
                    </CardContent>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b dark:bg-accent">
                    <CardTitle className="text-xl">
                      Founder Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-1 text-sm font-medium text-slate-500">
                          Name
                        </h3>
                        <p className="font-medium ">
                          {company?.founderName || "Not specified"}
                        </p>
                      </div>
                      {company?.founderGender &&
                        company.founderGender !== "Prefer not to say" && (
                          <div>
                            <h3 className="mb-1 text-sm font-medium text-slate-500">
                              Founder Gender
                            </h3>
                            <p className="font-medium ">
                              {company.founderGender}
                            </p>
                          </div>
                        )}
                      {company?.founderDob && (
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Age
                          </h3>
                          <p className="font-medium ">
                            {calculateAge(company.founderDob)} years old
                          </p>
                        </div>
                      )}
                      {company?.founderEducation && (
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Education
                          </h3>
                          <p className="font-medium ">
                            {company.founderEducation}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick contact card */}
                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">Quick Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {company?.email ? (
                        <>
                          <p className="text-sm text-slate-500">Email</p>
                          <a
                            href={`mailto:${company.email}`}
                            className="font-medium hover:text-slate-700"
                          >
                            {company.email}
                          </a>
                        </>
                      ) : (
                        <p className="text-sm text-slate-500">
                          Email not available
                        </p>
                      )}
                      {company?.phone && (
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium ">{company.phone}</p>
                          </div>
                        </div>
                      )}
                      {company?.website && (
                        <div className="flex items-start">
                          <Globe className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                          <div>
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium hover:text-slate-700"
                            >
                              {company.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    <Button className="w-full mt-4">Contact Company</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Business Details Tab */}
          <TabsContent value="business" className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      <div>
                        <h3 className="mb-3 text-sm font-medium text-slate-500">
                          Business Characteristics
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700">
                              Youth-led Business
                            </span>
                            <Badge
                              variant={
                                company?.isYouthLed ? "default" : "outline"
                              }
                              className={
                                company?.isYouthLed
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }
                            >
                              {company?.isYouthLed
                                ? "Youth-led"
                                : "Not Youth-led"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700">
                              Woman-led Business
                            </span>
                            <Badge
                              variant={
                                company?.isWomanLed ? "default" : "outline"
                              }
                              className={
                                company?.isWomanLed
                                  ? "bg-pink-500"
                                  : "bg-gray-300"
                              }
                            >
                              {company?.isWomanLed
                                ? "Woman-led"
                                : "Not Woman-led"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700">
                              Business Model
                            </span>
                            <span className="font-medium ">
                              {company?.businessModel === "Other"
                                ? company?.otherBusinessModel || "Not specified"
                                : company?.businessModel || "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700">
                              Planning Expansion
                            </span>
                            <Badge
                              variant={
                                company?.planningExpansion
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                company?.planningExpansion
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }
                            >
                              {company?.planningExpansion
                                ? "Planning Expansion"
                                : "Not Planning Expansion"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3 text-sm font-medium text-slate-500">
                          Compliance & Licensing
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <span>Tax Compliance</span>
                            {company?.taxCompliance &&
                            company.taxCompliance.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {company.taxCompliance.map((item, index) => (
                                  <span key={index} className="badge">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-500">
                                No tax compliance information available
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700">
                              Sector Licenses
                            </span>
                            <span className="font-medium ">
                              {company?.sectorLicenses || "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700">
                              Intellectual Property
                            </span>
                            <Badge
                              variant={
                                company?.hasIntellectualProperty
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                company?.hasIntellectualProperty
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }
                            >
                              {company?.hasIntellectualProperty
                                ? "Has IP"
                                : "No IP"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {company?.planningExpansion && company?.expansionPlans && (
                      <div className="pt-6 mt-8 border-t border-slate-100">
                        <h3 className="mb-2 text-sm font-medium text-slate-500">
                          Expansion Plans
                        </h3>
                        <p className="text-slate-700">
                          {company.expansionPlans}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">
                      Business Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {company?.businessChallenges &&
                    company.businessChallenges.length > 0 ? (
                      <>
                        <h3 className="mb-3 text-sm font-medium text-slate-500">
                          Business Challenges
                        </h3>
                        <ul className="list-disc list-inside text-slate-700 dark:text-white">
                          {company.businessChallenges.map(
                            (challenge, index) => (
                              <li key={index}>{challenge}</li>
                            )
                          )}
                        </ul>
                      </>
                    ) : (
                      <p className="text-slate-500">
                        No business challenges specified
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">Business Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500">
                          Business Type
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-5 h-5 text-slate-400" />
                          <span className="font-medium ">
                            {company?.type || "Not specified"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500">
                          Stage
                        </h3>
                        {/* <div className="flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5 text-slate-400" />
                          <span className="font-medium ">
                            {company.stage || "Not specified"}
                          </span>
                        </div> */}
                        {company && (
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                            <span className="font-medium ">
                              {company.stage || "Not specified"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500 dark:text-white">
                          Business Age
                        </h3>
                        {/* <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-slate-400" />
                          <span className="font-medium ">
                            {getBusinessAge(company.foundedAt)}
                          </span>
                        </div> */}
                        <span className="font-medium ">
                          {company?.foundedAt
                            ? getBusinessAge(company.foundedAt)
                            : "Not specified"}
                        </span>
                      </div>

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500 dark:text-white">
                          Team Size
                        </h3>
                        {/* <div className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-slate-400" />
                          <span className="font-medium ">
                            {company.employeesRange || "Not specified"}
                          </span>
                        </div> */}
                        <span className="font-medium ">
                          {company?.employeesRange || "Not specified"}
                        </span>
                      </div>

                      <Separator className="my-2" />

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500">
                          Business Strengths
                        </h3>
                        <div className="space-y-2 ">
                          {/* {company.isYouthLed && (
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="text-slate-700">
                                Youth-led business
                              </span>
                            </div>
                          )} */}
                          {company?.isYouthLed && (
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="text-slate-700 dark:text-white">
                                Youth-led business
                              </span>
                            </div>
                          )}

                          {/* {company.isWomanLed && (
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="text-slate-700">
                                Woman-led business
                              </span>
                            </div>
                          )} */}
                          {company?.isWomanLed && (
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="text-slate-700 dark:text-white">
                                Woman-led business
                              </span>
                            </div>
                          )}

                          {company?.hasIntellectualProperty && (
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="text-slate-700 dark:text-white">
                                Has intellectual property
                              </span>
                            </div>
                          )}

                          {/* {company.isInnovative && (
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="text-slate-700">
                                Innovative business model
                              </span>
                            </div>
                          )} */}

                          {company?.isInnovative && (
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="text-slate-700 dark:text-white">
                                Innovative business model
                              </span>
                            </div>
                          )}

                          {/* {company.planningExpansion && (
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="text-slate-700">
                                Planning expansion
                              </span>
                            </div>
                          )} */}
                          {company?.planningExpansion && (
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="text-slate-700 dark:text-white">
                                Planning expansion
                              </span>
                            </div>
                          )}

                          {!company?.isYouthLed &&
                            !company?.isWomanLed &&
                            !company?.hasIntellectualProperty &&
                            !company?.isInnovative &&
                            !company?.planningExpansion && (
                              <span className="italic text-slate-500">
                                No specific strengths highlighted
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">
                      Financial Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Funding Status
                          </h3>
                          <p className="font-medium ">
                            {company?.fundingStatus || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Amount Raised
                          </h3>
                          <p className="font-medium ">
                            {formatCurrency(company?.amountRaised ?? 0)}
                          </p>
                        </div>
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Funding Needed
                          </h3>
                          <p className="font-medium ">
                            {formatCurrency(company?.fundingNeeded)}
                          </p>
                        </div>
                        {company?.amountRaised && company?.fundingNeeded && (
                          <div>
                            <h3 className="mb-2 text-sm font-medium text-slate-500">
                              Funding Progress
                            </h3>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-500">
                                  {formatCurrency(company.amountRaised)} raised
                                </span>
                                <span className="text-slate-500">
                                  {Math.round(calculateFundingProgress())}% of
                                  goal
                                </span>
                              </div>
                              <Progress
                                value={calculateFundingProgress()}
                                className="h-2"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Business Bank Account
                          </h3>
                          <div className="flex items-center">
                            {/* <Badge
                              variant={
                                company.hasBusinessBankAccount
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                company.hasBusinessBankAccount
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                  : ""
                              }
                            >
                              {company.hasBusinessBankAccount ? "Yes" : "No"}
                            </Badge> */}
                            <Badge
                              variant={
                                company?.hasBusinessBankAccount
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                company?.hasBusinessBankAccount
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                  : ""
                              }
                            >
                              {company?.hasBusinessBankAccount ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <h3 className="mb-1 text-sm font-medium text-slate-500">
                            Financial Records
                          </h3>
                          {company ? (
                            <p className="font-medium ">
                              {company.keepsFinancialRecords || "Not specified"}
                            </p>
                          ) : (
                            <p className="italic text-slate-500">
                              Company data not available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">Annual Turnover</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <Card className="border shadow-sm border-slate-200">
                        <CardHeader className="pb-2">
                          <CardDescription className="text-slate-500">
                            Previous Year
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {company ? (
                            <div className="text-xl font-bold ">
                              {company.annualTurnoverBefore || "Not specified"}
                            </div>
                          ) : (
                            <div className="italic text-slate-500">
                              Company data not available
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      <Card className="border shadow-sm border-slate-200">
                        <CardHeader className="pb-2">
                          <CardDescription className="text-slate-500">
                            Current Year (Est.)
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold ">
                            {company?.annualTurnoverCurrent || "Not specified"}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border shadow-sm border-slate-200">
                        <CardHeader className="pb-2">
                          <CardDescription className="text-slate-500">
                            Next Year (Proj.)
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold ">
                            {company?.annualTurnoverNext || "Not specified"}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">
                      External Funding Sources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {company?.externalFunding &&
                    company.externalFunding.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {company.externalFunding.map((source, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="px-3 py-1 bg-slate-50 text-slate-700 dark:text-white"
                          >
                            {source}
                          </Badge>
                        ))}

                        {company.externalFunding.includes("Other") &&
                          company.otherExternalFunding && (
                            <Badge
                              variant="outline"
                              className="px-3 py-1 bg-slate-50 text-slate-700 dark:text-white"
                            >
                              {company.otherExternalFunding}
                            </Badge>
                          )}
                      </div>
                    ) : (
                      <p className="italic text-slate-500">
                        No external funding sources specified.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">
                      Financial Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {company?.fundingDocuments ? (
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 mr-3 text-slate-400" />
                            <div>
                              <h3 className="font-medium ">
                                Funding Documents
                              </h3>
                              <p className="text-sm text-slate-500">
                                Investment plan and funding details
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={company.fundingDocuments}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      ) : null}

                      {company?.pitchDeck ? (
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 mr-3 text-slate-400" />
                            <div>
                              <h3 className="font-medium ">Pitch Deck</h3>
                              <p className="text-sm text-slate-500 ">
                                Company presentation for investors
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={company.pitchDeck}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      ) : null}

                      {!company?.fundingDocuments && !company?.pitchDeck && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <FileText className="w-12 h-12 mb-4 text-slate-300" />
                          <h3 className="mb-2 text-lg font-medium ">
                            No documents available
                          </h3>
                          <p className="max-w-md text-slate-500">
                            This company hasn't uploaded any financial documents
                            yet.
                          </p>
                        </div>
                      )}

                      {user?.id === company?.userId && (
                        <Button variant="outline" className="w-full mt-4">
                          Upload New Document
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Innovation & Impact Tab */}
          <TabsContent value="innovation" className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">Innovation</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-slate-500">
                              Innovative Business
                            </h3>
                            <Badge
                              variant={
                                company?.isInnovative ? "default" : "outline"
                              }
                              className={
                                company?.isInnovative
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                  : ""
                              }
                            >
                              {company?.isInnovative ? "Yes" : "No"}
                            </Badge>
                          </div>
                          {company?.isInnovative &&
                            company?.innovationExplanation && (
                              <div className="p-4 border rounded-lg bg-slate-50 border-slate-100">
                                <p className="text-sm text-slate-700 dark:text-white">
                                  {company.innovationExplanation}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-slate-500">
                              Uses Digital Tools
                            </h3>
                            <Badge
                              variant={
                                company?.usesDigitalTools
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                company?.usesDigitalTools
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                  : ""
                              }
                            >
                              {company?.usesDigitalTools ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">
                      Social & Environmental Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-slate-500">
                              Employs Vulnerable Groups
                            </h3>
                            <Badge
                              variant={
                                company?.employsVulnerableGroups
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                company?.employsVulnerableGroups
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                  : ""
                              }
                            >
                              {company?.employsVulnerableGroups ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-slate-500">
                              Environmental Sustainability
                            </h3>
                            <Badge
                              variant={
                                company?.addressesEnvironmentalSustainability
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                company?.addressesEnvironmentalSustainability
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                  : ""
                              }
                            >
                              {company?.addressesEnvironmentalSustainability
                                ? "Yes"
                                : "No"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {company &&
                      (company.employsVulnerableGroups ||
                        company.addressesEnvironmentalSustainability) &&
                      company.impactInitiatives && (
                        <div className="pt-6 mt-6 border-t border-slate-100">
                          <h3 className="mb-2 text-sm font-medium text-slate-500">
                            Impact Initiatives
                          </h3>
                          <div className="p-4 border rounded-lg bg-slate-50 border-slate-100">
                            <p className="text-slate-700 dark:bg-inherit">
                              {company.impactInitiatives}
                            </p>
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">
                      Ecosystem Participation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500">
                          Ecosystem Programs Interest
                        </h3>
                        <div className="flex items-center">
                          {company && (
                            <Badge
                              variant={
                                company.joinEcosystemPrograms
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                company.joinEcosystemPrograms
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                  : ""
                              }
                            >
                              {company.joinEcosystemPrograms ? "Yes" : "No"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500">
                          Impact Summary
                        </h3>
                        <div className="space-y-2 dark:bg-inherit">
                          {company && company.employsVulnerableGroups && (
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="text-slate-700 dark:text-white">
                                Employs vulnerable groups
                              </span>
                            </div>
                          )}

                          {company &&
                            company.addressesEnvironmentalSustainability && (
                              <div className="flex items-center space-x-2">
                                <Star className="w-4 h-4 text-amber-500" />
                                <span className="text-slate-700 dark:text-white">
                                  Addresses environmental sustainability
                                </span>
                              </div>
                            )}

                          {company && company.isInnovative && (
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="text-slate-700 dark:text-white">
                                Innovative business approach
                              </span>
                            </div>
                          )}

                          {company?.usesDigitalTools &&
                            Array.isArray(company.digitalTools) &&
                            company.digitalTools.length > 0 && (
                              <div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {company.digitalTools.map((tool, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="bg-slate-50"
                                    >
                                      {tool}
                                    </Badge>
                                  ))}
                                  {company.digitalTools.includes("Other") &&
                                    !!company.otherDigitalTools && (
                                      <Badge
                                        variant="outline"
                                        className="bg-slate-50"
                                      >
                                        {company.otherDigitalTools}
                                      </Badge>
                                    )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      <Separator className="my-2" />

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500">
                          Get Involved
                        </h3>
                        <Button className="w-full">Contact Company</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-8">
            <Card className="overflow-hidden shadow-md dark:border">
              <CardHeader className="border-b bg-accent">
                <CardTitle className="text-xl">Company Documents</CardTitle>
                <CardDescription>
                  Important documents and resources
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {company && company.fundingDocuments ? (
                    <div className="flex items-center justify-between p-4 transition-colors border rounded-lg bg-slate-50 hover:bg-slate-100">
                      <div className="flex items-center">
                        <div className="p-2 mr-4 bg-white border rounded-lg">
                          <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="font-medium ">Funding Documents</h3>
                          <p className="text-sm text-slate-500">
                            Investment plan and funding details
                          </p>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={company.fundingDocuments}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download funding documents</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : null}

                  {company?.pitchDeck ? (
                    <div className="flex items-center justify-between p-4 transition-colors border rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white">
                      <div className="flex items-center">
                        <div className="p-2 mr-4 bg-white border rounded-lg">
                          <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="font-medium ">Pitch Deck</h3>
                          <p className="text-sm text-slate-500">
                            Company presentation for investors
                          </p>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={company.pitchDeck}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download pitch deck</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : null}

                  {!company?.fundingDocuments && !company?.pitchDeck && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="p-6 mb-4 rounded-full bg-slate-50 dark:bg-slate-800">
                        <FileText className="w-16 h-16 text-slate-300" />
                      </div>
                      <h3 className="mb-2 text-xl font-medium ">
                        No documents available
                      </h3>
                      <p className="max-w-md text-slate-500">
                        This company hasn't uploaded any documents yet.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              {user?.id && company?.userId && user.id === company.userId && (
                <CardFooter className="p-6 border-t bg-slate-50 dark:bg-slate-800">
                  <div className="w-full">
                    <h3 className="mb-2 font-medium">
                      Upload Company Documents
                    </h3>
                    <p className="mb-4 text-sm text-slate-500">
                      Share important documents with potential investors and
                      partners.
                    </p>
                    <Button variant="outline" className="w-full">
                      Upload New Document
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="space-y-6">
                        <h3 className="font-semibold ">Company Contact</h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="p-2 mr-4 rounded-lg bg-slate-50">
                              <Mail className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Email</p>
                              {company?.email ? (
                                <a
                                  href={`mailto:${company.email}`}
                                  className="font-medium hover:text-slate-700"
                                >
                                  {company.email}
                                </a>
                              ) : (
                                <span className="text-slate-500">
                                  No email provided
                                </span>
                              )}
                            </div>
                          </div>
                          {company?.phone ? (
                            <div className="flex items-start">
                              <div className="p-2 mr-4 rounded-lg bg-slate-50">
                                <Phone className="w-5 h-5 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">Phone</p>
                                <a
                                  href={`tel:${company.phone}`}
                                  className="font-medium hover:text-slate-700"
                                >
                                  {company.phone}
                                </a>
                              </div>
                            </div>
                          ) : null}

                          {company?.address && company.address.trim() !== "" ? (
                            <div className="flex items-start">
                              <div className="p-2 mr-4 rounded-lg bg-slate-50">
                                <MapPin className="w-5 h-5 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">
                                  Address
                                </p>
                                <p className="font-medium ">
                                  {company.address}
                                </p>
                              </div>
                            </div>
                          ) : null}

                          {company?.website && company.website.trim() !== "" ? (
                            <div className="flex items-start">
                              <div className="p-2 mr-4 rounded-lg bg-slate-50">
                                <Globe className="w-5 h-5 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">
                                  Website
                                </p>
                                <a
                                  href={company.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center font-medium hover:text-slate-700"
                                >
                                  {company.website.replace(/^https?:\/\//, "")}
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="font-semibold ">Social Media</h3>
                        <div className="space-y-4">
                          {Array.isArray(company?.socialLinks) &&
                          company.socialLinks.length > 0 ? (
                            company.socialLinks
                              .filter(
                                (social) =>
                                  social?.name &&
                                  social?.link &&
                                  typeof social.link === "string" &&
                                  social.link.trim() !== ""
                              )
                              .map((social, index) => (
                                <div key={index} className="flex items-start">
                                  <div className="p-2 mr-4 rounded-lg bg-slate-50">
                                    <Globe className="w-5 h-5 text-slate-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm capitalize text-slate-500">
                                      {social.name}
                                    </p>
                                    <a
                                      href={social.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center font-medium hover:text-slate-700"
                                    >
                                      {social.link.replace(/^https?:\/\//, "")}
                                      <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="italic text-slate-500">
                              No social media links provided.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">Contact Form</CardTitle>
                    <CardDescription>
                      Send a message to this company
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label
                            htmlFor="name"
                            className="text-sm font-medium text-slate-700"
                          >
                            Your Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            className="w-full p-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:bg-slate-800 dark:text-white"
                            placeholder="Enter your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium text-slate-700"
                          >
                            Your Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="w-full p-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:bg-slate-800 dark:text-white"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="subject"
                          className="text-sm font-medium text-slate-700"
                        >
                          Subject
                        </label>
                        <input
                          id="subject"
                          type="text"
                          className="w-full p-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:bg-slate-800 dark:text-white"
                          placeholder="Enter message subject"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="text-sm font-medium text-slate-700"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={5}
                          className="w-full p-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:bg-slate-800 dark:text-white"
                          placeholder="Enter your message"
                        ></textarea>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="p-6 border-t bg-slate-50 dark:bg-slate-800">
                    <Button className="w-full md:w-auto">Send Message</Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">Location</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {company?.location?.trim() ? (
                      <div className="space-y-4">
                        <div className="relative overflow-hidden rounded-lg aspect-video bg-slate-100">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-slate-400" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-2 text-sm text-center bg-white bg-opacity-90">
                            {company.location}
                          </div>
                        </div>

                        {company?.address?.trim() && (
                          <div>
                            <h3 className="mb-1 text-sm font-medium text-slate-500">
                              Address
                            </h3>
                            <p className="">{company.address}</p>
                          </div>
                        )}

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            window.open(
                              `https://maps.google.com/?q=${encodeURIComponent(
                                company.address || company.location || ""
                              )}`,
                              "_blank"
                            )
                          }
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          View on Google Maps
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <MapPin className="w-12 h-12 mb-4 text-slate-300" />
                        <h3 className="mb-2 text-lg font-medium ">
                          No location specified
                        </h3>
                        <p className="max-w-md text-slate-500">
                          This company hasn't provided location information.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Funding Rounds Tab */}
          <TabsContent value="funding" className="space-y-8">
            <Card className="overflow-hidden shadow-md dark:border">
              <CardHeader className="border-b bg-accent ">
                <div className="flex  justify-between w-full">
                  <div>
                    <CardTitle className="text-xl">Funding Rounds</CardTitle>
                    <CardDescription>
                      Investment history and funding details
                    </CardDescription>
                  </div>

                  {user?.id === company?.userId && (
                    <Link href={"/rounds/new"}>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Funding Round
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="text-center animate-pulse">
                      <div className="w-32 h-8 mx-auto mb-4 rounded-md bg-slate-200"></div>
                      <p className="text-slate-500">Loading funding data...</p>
                    </div>
                  </div>
                ) : rounds.length > 0 ? (
                  <RoundsTable rounds={rounds} loading={loading} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-6 mb-4 rounded-full bg-slate-50">
                      <FileText className="w-16 h-16 text-slate-300" />
                    </div>
                    <h3 className="mb-2 text-xl font-medium ">
                      No funding rounds
                    </h3>
                    <p className="max-w-md text-slate-500">
                      This company hasn't recorded any funding rounds yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">Funding Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500">
                          Current Funding Status
                        </h3>
                        <div className="flex items-center">
                          <Badge
                            className={`px-3 py-1 text-sm ${
                              company?.fundingStatus
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {company?.fundingStatus || "Not specified"}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500">
                          Funding Progress
                        </h3>
                        {company?.amountRaised && company?.fundingNeeded ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">
                                {formatCurrency(company.amountRaised)} raised of{" "}
                                {formatCurrency(company.fundingNeeded)} goal
                              </span>
                              <span className="text-slate-500">
                                {Math.round(calculateFundingProgress())}%
                                complete
                              </span>
                            </div>
                            <Progress
                              value={calculateFundingProgress()}
                              className="h-2"
                            />
                            <p className="mt-2 text-sm text-slate-500">
                              {company.amountRaised < company.fundingNeeded
                                ? `Still seeking ${formatCurrency(
                                    company.fundingNeeded - company.amountRaised
                                  )} to reach funding goal`
                                : "Funding goal reached"}
                            </p>
                          </div>
                        ) : (
                          <p className="italic text-slate-500">
                            No funding progress information available
                          </p>
                        )}
                      </div>

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500">
                          External Funding Sources
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="overflow-hidden shadow-md dark:border">
                  <CardHeader className="border-b bg-accent">
                    <CardTitle className="text-xl">
                      Investment Opportunity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500">
                          Funding Needed
                        </h3>
                        <p className="font-medium ">
                          {formatCurrency(company?.fundingNeeded ?? 0)}
                        </p>
                      </div>

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500">
                          Business Stage
                        </h3>
                        <Badge
                          className={`px-3 py-1 text-sm ${
                            company?.stage
                              ? getStageBadgeColor(company.stage)
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {company?.stage || "Not specified"}
                        </Badge>
                      </div>

                      <Separator className="my-2" />

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-slate-500">
                          Interested in investing?
                        </h3>
                        <Link href="/Investor-interest-form" passHref>
                          <Button className="w-full">Contact Company</Button>
                        </Link>
                      </div>

                      {company?.pitchDeck && (
                        <div className="pt-2">
                          <Button variant="outline" className="w-full" asChild>
                            <a
                              href={company.pitchDeck}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Pitch Deck
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
