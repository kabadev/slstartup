"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowLeft,
  Building2,
  Check,
  FileText,
  Loader2,
  Trash2,
  Upload,
  X,
  Plus,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateCompany, deleteCompany } from "@/app/actions/company-actions";

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

// Define form validation schema
const companyFormSchema = z.object({
  name: z.string().min(2, { message: "Company name is required" }),
  sector: z.string().min(1, { message: "Sector is required" }),
  otherSector: z.string().optional(),
  type: z.string().optional(),
  stage: z.string().optional(),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z
    .string()
    .url({ message: "Valid URL is required" })
    .optional()
    .or(z.literal("")),
  location: z.string().optional(),
  foundedAt: z.string().optional(),
  registrationNumber: z.string().optional(),
  description: z.string().optional(),
  missionStatement: z.string().optional(),
  employeesRange: z.string().optional(),
  fundingStatus: z.string().optional(),
  amountRaised: z.coerce.number().optional(),
  fundingNeeded: z.coerce.number().optional(),
  headOfficeAddress: z.string().optional(),
  businessModel: z.string().optional(),
  otherBusinessModel: z.string().optional(),
  otherBusinessChallenges: z.string().optional(),
  isYouthLed: z.boolean().default(false),
  isWomanLed: z.boolean().default(false),
  founderName: z.string().optional(),
  founderGender: z.string().optional(),
  founderDob: z.string().optional(),
  founderEducation: z.string().optional(),
  otherExternalFunding: z.string().optional(),
  otherDigitalTools: z.string().optional(),
  sectorLicenses: z.string().optional(),
  hasIntellectualProperty: z.boolean().default(false),
  annualTurnoverBefore: z.string().optional(),
  annualTurnoverCurrent: z.string().optional(),
  annualTurnoverNext: z.string().optional(),
  hasBusinessBankAccount: z.boolean().default(false),
  keepsFinancialRecords: z.string().optional(),
  usesDigitalTools: z.boolean().default(false),
  isInnovative: z.boolean().default(false),
  innovationExplanation: z.string().optional(),
  supportNeeded: z.string().optional(),
  planningExpansion: z.boolean().default(false),
  expansionPlans: z.string().optional(),
  employsVulnerableGroups: z.boolean().default(false),
  addressesEnvironmentalSustainability: z.boolean().default(false),
  impactInitiatives: z.string().optional(),
  joinEcosystemPrograms: z.boolean().default(false),
  consentToDataUsage: z.boolean().default(false),
  additionalComments: z.string().optional(),
});

// Define the business sectors
const businessSectors = [
  "Agriculture",
  "Manufacturing",
  "Technology",
  "Healthcare",
  "Education",
  "Retail",
  "Financial Services",
  "Transportation",
  "Construction",
  "Energy",
  "Hospitality",
  "Entertainment",
  "Other",
];

// Define the business types
const businessTypes = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Company (LLC)",
  "Corporation",
  "Cooperative",
  "Non-profit",
  "Social Enterprise",
  "Other",
];

// Define the business stages
const businessStages = [
  "Idea",
  "Pre-seed",
  "Seed",
  "Early Stage",
  "Growth",
  "Mature",
];

// Define the business models
const businessModels = [
  "B2B (Business to Business)",
  "B2C (Business to Consumer)",
  "B2G (Business to Government)",
  "C2C (Consumer to Consumer)",
  "Subscription",
  "Freemium",
  "Marketplace",
  "E-commerce",
  "SaaS (Software as a Service)",
  "Franchise",
  "Other",
];

// Define the employee ranges
const employeeRanges = [
  "1-5",
  "6-10",
  "11-25",
  "26-50",
  "51-100",
  "101-250",
  "251-500",
  "501-1000",
  "1000+",
];

// Define the funding statuses
const fundingStatuses = [
  "Pre-revenue",
  "Bootstrapped",
  "Seed Funded",
  "Series A",
  "Series B",
  "Series C+",
  "Profitable",
  "Acquired",
  "IPO",
];

// Define the financial record keeping options
const financialRecordOptions = [
  "No formal records",
  "Basic spreadsheets",
  "Accounting software",
  "Professional accountant",
  "Full finance department",
];

// Define the tax compliance options
const taxComplianceOptions = [
  "Business Registration",
  "Tax Identification Number",
  "VAT Registration",
  "Annual Tax Returns",
  "Payroll Tax",
  "Other",
];

// Define the external funding options
const externalFundingOptions = [
  "Angel Investors",
  "Venture Capital",
  "Bank Loans",
  "Government Grants",
  "Crowdfunding",
  "Family & Friends",
  "Accelerator/Incubator",
  "Other",
];

// Define the digital tools options
const digitalToolsOptions = [
  "Website",
  "Mobile App",
  "Social Media",
  "E-commerce Platform",
  "CRM System",
  "Accounting Software",
  "Project Management Tools",
  "Digital Marketing Tools",
  "Other",
];

// Define the business challenges options
const businessChallengesOptions = [
  "Access to Finance",
  "Market Access",
  "Skilled Workforce",
  "Regulatory Compliance",
  "Technology Adoption",
  "Competition",
  "Infrastructure",
  "Supply Chain",
  "Other",
];

interface CompanyEditFormProps {
  company: Company;
}

export default function CompanyEditForm({ company }: CompanyEditFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Safely initialize state with company data or empty defaults
  const [socialLinks, setSocialLinks] = useState<
    { name: string; link: string }[]
  >([]);
  const [taxCompliance, setTaxCompliance] = useState<string[]>([]);
  const [externalFunding, setExternalFunding] = useState<string[]>([]);
  const [digitalTools, setDigitalTools] = useState<string[]>([]);
  const [businessChallenges, setBusinessChallenges] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [fundingDocFile, setFundingDocFile] = useState<File | null>(null);
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null);
  const [fundingDocName, setFundingDocName] = useState<string | null>(
    company?.fundingDocuments ? "funding-document.pdf" : null
  );
  const [pitchDeckName, setPitchDeckName] = useState<string | null>(
    company?.pitchDeck ? "pitch-deck.pdf" : null
  );

  // Initialize the form
  const form = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name ?? "HSHSH",
      sector: company?.sector ?? "",
      otherSector: company?.otherSector ?? "",
      type: company?.type ?? "",
      stage: company?.stage ?? "",
      email: company?.email ?? "",
      phone: company?.phone ?? "",
      address: company?.address ?? "",
      website: company?.website ?? "",
      location: company?.location ?? "",
      foundedAt: company?.foundedAt
        ? new Date(company.foundedAt).toISOString().split("T")[0]
        : "",
      registrationNumber: company?.registrationNumber ?? "",
      description: company?.description ?? "",
      missionStatement: company?.missionStatement ?? "",
      employeesRange: company?.employeesRange ?? "",
      fundingStatus: company?.fundingStatus ?? "",
      amountRaised: company?.amountRaised ?? 0,
      fundingNeeded: company?.fundingNeeded ?? 0,
      headOfficeAddress: company?.headOfficeAddress ?? "",
      businessModel: company?.businessModel ?? "",
      otherBusinessModel: company?.otherBusinessModel ?? "",
      isYouthLed: company?.isYouthLed ?? false,
      isWomanLed: company?.isWomanLed ?? false,
      founderName: company?.founderName ?? "",
      founderGender: company?.founderGender ?? "",
      founderDob: company?.founderDob
        ? new Date(company.founderDob).toISOString().split("T")[0]
        : "",
      founderEducation: company?.founderEducation ?? "",
      sectorLicenses: company?.sectorLicenses ?? "",
      hasIntellectualProperty: company?.hasIntellectualProperty ?? false,
      annualTurnoverBefore: company?.annualTurnoverBefore ?? "",
      annualTurnoverCurrent: company?.annualTurnoverCurrent ?? "",
      annualTurnoverNext: company?.annualTurnoverNext ?? "",
      hasBusinessBankAccount: company?.hasBusinessBankAccount ?? false,
      keepsFinancialRecords: company?.keepsFinancialRecords ?? "",
      usesDigitalTools: company?.usesDigitalTools ?? false,
      isInnovative: company?.isInnovative ?? false,
      innovationExplanation: company?.innovationExplanation ?? "",
      supportNeeded: company?.supportNeeded ?? "",
      planningExpansion: company?.planningExpansion ?? false,
      expansionPlans: company?.expansionPlans ?? "",
      employsVulnerableGroups: company?.employsVulnerableGroups ?? false,
      addressesEnvironmentalSustainability:
        company?.addressesEnvironmentalSustainability ?? false,
      impactInitiatives: company?.impactInitiatives ?? "",
      joinEcosystemPrograms: company?.joinEcosystemPrograms ?? false,
      consentToDataUsage: company?.consentToDataUsage ?? false,
      additionalComments: company?.additionalComments ?? "",
    },
  });

  // Load initial data when component mounts
  useEffect(() => {
    if (company) {
      // Initialize state values
      setSocialLinks(company.socialLinks || []);
      setTaxCompliance(company.taxCompliance || []);
      setExternalFunding(company.externalFunding || []);
      setDigitalTools(company.digitalTools || []);
      setBusinessChallenges(company.businessChallenges || []);
      setLogoPreview(company.logo || null);

      // Set loading to false once we have the data
      setIsLoading(false);
    }
  }, [company]);

  // Handle social links
  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { name: "", link: "" }]);
  };

  const removeSocialLink = (index: number) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const updateSocialLink = (
    index: number,
    field: "name" | "link",
    value: string
  ) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };

  // Handle checkbox arrays
  const handleCheckboxArrayChange = (
    value: string,
    currentArray: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (currentArray.includes(value)) {
      setArray(currentArray.filter((item) => item !== value));
    } else {
      setArray([...currentArray, value]);
    }
  };

  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Logo file must be less than 2MB",
          variant: "destructive",
        });
        return;
      }

      setLogoFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFundingDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Funding document must be less than 10MB",
          variant: "destructive",
        });
        return;
      }

      setFundingDocFile(file);
      setFundingDocName(file.name);
    }
  };

  const handlePitchDeckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Pitch deck must be less than 20MB",
          variant: "destructive",
        });
        return;
      }

      setPitchDeckFile(file);
      setPitchDeckName(file.name);
    }
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof companyFormSchema>) => {
    try {
      setIsSubmitting(true);

      // Create a FormData object to handle file uploads
      const formData = new FormData();

      // Add the logo file if it exists
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      // Add funding documents if they exist
      if (fundingDocFile) {
        formData.append("fundingDocuments", fundingDocFile);
      }

      // Add pitch deck if it exists
      if (pitchDeckFile) {
        formData.append("pitchDeck", pitchDeckFile);
      }

      // Add all form data
      const completeData = {
        ...data,
        _id: company._id,
        socialLinks,
        taxCompliance,
        externalFunding,
        digitalTools,
        businessChallenges,
      };

      // Call the server action with the complete data
      const result = await updateCompany(
        completeData,
        company._id,
        logoFile ? formData : undefined
      );

      if (result.success) {
        toast({
          title: "Company updated",
          description:
            "Your company information has been successfully updated.",
        });

        // Redirect to the company details page
        router.push(`/companies/${company._id}`);
        router.refresh();
      } else {
        throw new Error(result.message || "Failed to update company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast({
        title: "Error",
        description: "Failed to update company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle company deletion
  const handleDeleteCompany = async () => {
    try {
      setIsSubmitting(true);

      const result = await deleteCompany(company._id);

      if (result.success) {
        toast({
          title: "Company deleted",
          description: "Your company has been successfully deleted.",
        });

        // Redirect to the companies list
        router.push("/companies");
        router.refresh();
      } else {
        throw new Error(result?.error || "Failed to delete company");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast({
        title: "Error",
        description: "Failed to delete company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-slate-700" />
        <span className="ml-2 text-lg">Loading company data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 py-8 mx-auto max-w-7xl dark:bg-slate-900">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 dark:text-white">
            <Link
              href={`/companies/${company._id}`}
              className="inline-flex items-center text-sm font-medium transition-colors text-slate-600 hover:text-slate-900 dark:text-white dark:hover:text-slate-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2 dark:text-white" />
              Back to Company
            </Link>

            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Company
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your company and all associated data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteCompany}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete Company"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-slate-900">
            Edit Company
          </h1>
          <p className="text-slate-600">
            Update your company information and profile details
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Tabs Navigation */}
            <div className="overflow-x-auto border-b">
              <Tabs defaultValue="basic">
                <TabsList className="justify-start w-full h-12 gap-2 bg-transparent rounded-none">
                  <TabsTrigger
                    value="basic"
                    onClick={() => setActiveTab("basic")}
                    className={`data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-4 ${
                      activeTab === "basic" ? "border-b-2 border-slate-900" : ""
                    }`}
                  >
                    Basic Information
                  </TabsTrigger>
                  <TabsTrigger
                    value="business"
                    onClick={() => setActiveTab("business")}
                    className={`data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-4 ${
                      activeTab === "business"
                        ? "border-b-2 border-slate-900"
                        : ""
                    }`}
                  >
                    Business Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="financial"
                    onClick={() => setActiveTab("financial")}
                    className={`data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-4 ${
                      activeTab === "financial"
                        ? "border-b-2 border-slate-900"
                        : ""
                    }`}
                  >
                    Financial
                  </TabsTrigger>
                  <TabsTrigger
                    value="innovation"
                    onClick={() => setActiveTab("innovation")}
                    className={`data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-4 ${
                      activeTab === "innovation"
                        ? "border-b-2 border-slate-900"
                        : ""
                    }`}
                  >
                    Innovation & Impact
                  </TabsTrigger>
                  <TabsTrigger
                    value="contact"
                    onClick={() => setActiveTab("contact")}
                    className={`data-[state=active]:border-b-2 data-[state=active]:border-slate-900 data-[state=active]:shadow-none rounded-none h-12 px-4 ${
                      activeTab === "contact"
                        ? "border-b-2 border-slate-900"
                        : ""
                    }`}
                  >
                    Contact & Social
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="space-y-8">
                <Card className="overflow-hidden shadow-md border-1">
                  <CardHeader className="border-b dark:text-white dark:bg-slate-800">
                    <CardTitle className="text-xl text-slate-600 dark:text-slate-400">
                      Company Identity
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Basic information about your company
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col gap-8 md:flex-row">
                      {/* Logo Upload */}
                      <div className="w-full md:w-1/3">
                        <FormLabel className="block mb-2 text-base font-medium text-slate-900 dark:text-slate-500">
                          Company Logo
                        </FormLabel>
                        <div className="flex flex-col items-center justify-center">
                          <div className="relative flex items-center justify-center w-40 h-40 mb-4 overflow-hidden bg-white border shadow-sm rounded-xl">
                            {logoPreview ? (
                              <Image
                                src={logoPreview || "/placeholder.svg"}
                                alt="Company logo preview"
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  // If image fails to load, show the placeholder
                                  e.currentTarget.src = "";
                                  setLogoPreview(null);
                                }}
                              />
                            ) : (
                              <Building2 className="w-20 h-20 text-slate-300" />
                            )}
                          </div>
                          <div className="flex flex-col items-center">
                            <label
                              htmlFor="logo-upload"
                              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-md shadow cursor-pointer h-9 bg-slate-900 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Logo
                            </label>
                            <input
                              id="logo-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleLogoChange}
                            />
                            <p className="mt-2 text-xs text-slate-500">
                              Recommended: 400x400px, max 2MB
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Company Name and Basic Info */}
                      <div className="w-full space-y-4 md:w-2/3">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Company Name*
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter company name"
                                  {...field}
                                  className="border-slate-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="sector"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                  Business Sector*
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="border-slate-300">
                                      <SelectValue placeholder="Select a sector" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {businessSectors.map((sector) => (
                                      <SelectItem key={sector} value={sector}>
                                        {sector}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("sector") === "Other" && (
                            <FormField
                              control={form.control}
                              name="otherSector"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                    Specify Other Sector
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter sector"
                                      {...field}
                                      className="border-slate-300"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                  Company Type
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="border-slate-300">
                                      <SelectValue placeholder="Select company type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {businessTypes.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="stage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                  Business Stage
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="border-slate-300">
                                      <SelectValue placeholder="Select business stage" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {businessStages.map((stage) => (
                                      <SelectItem key={stage} value={stage}>
                                        {stage}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="foundedAt"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                  Founded Date
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    {...field}
                                    className="border-slate-300"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="registrationNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                  Registration Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter registration number"
                                    {...field}
                                    className="border-slate-300"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="missionStatement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Mission Statement
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your company's mission statement"
                                {...field}
                                className="border-slate-300 min-h-[80px]"
                              />
                            </FormControl>
                            <FormDescription>
                              A concise statement that describes the purpose and
                              goals of your company
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Company Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter a detailed description of your company"
                                {...field}
                                className="border-slate-300 min-h-[150px]"
                              />
                            </FormControl>
                            <FormDescription>
                              Provide a comprehensive overview of your company,
                              its history, products/services, and value
                              proposition
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="border-b bg-gradient-to-r dark:from-slate-800 dark:to-slate-900">
                    <CardTitle className="text-xl">
                      Founder Information
                    </CardTitle>
                    <CardDescription>
                      Details about the company founder
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="founderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Founder Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter founder's name"
                                {...field}
                                className="border-slate-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="founderGender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Founder Gender
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-slate-300">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Non-binary">
                                  Non-binary
                                </SelectItem>
                                <SelectItem value="Prefer not to say">
                                  Prefer not to say
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="founderDob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Founder Date of Birth
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="border-slate-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="founderEducation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Founder Education
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-slate-300">
                                  <SelectValue placeholder="Select education level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="High School">
                                  High School
                                </SelectItem>
                                <SelectItem value="Certificate/Diploma">
                                  Certificate/Diploma
                                </SelectItem>
                                <SelectItem value="Bachelor's Degree">
                                  Bachelor's Degree
                                </SelectItem>
                                <SelectItem value="Master's Degree">
                                  Master's Degree
                                </SelectItem>
                                <SelectItem value="Doctorate">
                                  Doctorate
                                </SelectItem>
                                <SelectItem value="Self-taught">
                                  Self-taught
                                </SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="isYouthLed"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Youth-led Business
                              </FormLabel>
                              <FormDescription>
                                The business is primarily led by young
                                entrepreneurs (under 35)
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isWomanLed"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Woman-led Business
                              </FormLabel>
                              <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                                The business is primarily led by women
                                entrepreneurs
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Business Details Tab */}
            {activeTab === "business" && (
              <div className="space-y-8">
                <Card className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="border-b bg-gradient-to-r dark:from-slate-800 dark:to-slate-900">
                    <CardTitle className="text-xl">
                      Business Model & Operations
                    </CardTitle>
                    <CardDescription>
                      Details about your business model and operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="businessModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Business Model
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-slate-300">
                                  <SelectValue placeholder="Select business model" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {businessModels.map((model) => (
                                  <SelectItem key={model} value={model}>
                                    {model}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("businessModel") === "Other" && (
                        <FormField
                          control={form.control}
                          name="otherBusinessModel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Specify Other Business Model
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter business model"
                                  {...field}
                                  className="border-slate-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="employeesRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Number of Employees
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-slate-300">
                                  <SelectValue placeholder="Select employee range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {employeeRanges.map((range) => (
                                  <SelectItem key={range} value={range}>
                                    {range}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Primary Location
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter city, country"
                                {...field}
                                className="border-slate-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4"></div>
                    <h3 className="text-base font-medium text-slate-900 dark:text-slate-500">
                      Tax Compliance
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {taxComplianceOptions.map((option) => (
                        <div
                          key={option}
                          className="flex items-center p-3 space-x-2 border rounded-md"
                        >
                          <Checkbox
                            id={`tax-${option}`}
                            checked={taxCompliance.includes(option)}
                            onCheckedChange={() =>
                              handleCheckboxArrayChange(
                                option,
                                taxCompliance,
                                setTaxCompliance
                              )
                            }
                          />
                          <label
                            htmlFor={`tax-${option}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="sectorLicenses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Sector-specific Licenses
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter any sector-specific licenses"
                                {...field}
                                className="border-slate-300"
                              />
                            </FormControl>
                            <FormDescription>
                              List any industry-specific licenses or
                              certifications
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasIntellectualProperty"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Intellectual Property
                              </FormLabel>
                              <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                                The business has patents, trademarks, or other
                                intellectual property
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="border-b bg-gradient-to-r dark:from-slate-800 dark:to-slate-900 dark:text-slate-500">
                    <CardTitle className="text-xl dark:text-slate-500">
                      Business Challenges & Expansion
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Current challenges and future plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-slate-900 dark:text-slate-500">
                        Business Challenges
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {businessChallengesOptions.map((option) => (
                          <div
                            key={option}
                            className="flex items-center p-3 space-x-2 border rounded-md"
                          >
                            <Checkbox
                              id={`challenge-${option}`}
                              checked={businessChallenges.includes(option)}
                              onCheckedChange={() =>
                                handleCheckboxArrayChange(
                                  option,
                                  businessChallenges,
                                  setBusinessChallenges
                                )
                              }
                            />
                            <label
                              htmlFor={`challenge-${option}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>

                      {businessChallenges.includes("Other") && (
                        <FormField
                          control={form.control}
                          name="otherBusinessChallenges"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Specify Other Challenges
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter other challenges"
                                  {...field}
                                  className="border-slate-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="supportNeeded"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Support Needed
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the support your business needs"
                                {...field}
                                className="border-slate-300 min-h-[100px]"
                              />
                            </FormControl>
                            <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                              Describe what kind of support would help your
                              business overcome its challenges
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="planningExpansion"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Planning Expansion
                              </FormLabel>
                              <FormDescription>
                                The business is planning to expand in the near
                                future
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {form.watch("planningExpansion") && (
                        <FormField
                          control={form.control}
                          name="expansionPlans"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Expansion Plans
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your expansion plans"
                                  {...field}
                                  className="border-slate-300 min-h-[100px]"
                                />
                              </FormControl>
                              <FormDescription>
                                Provide details about your expansion plans,
                                including timeline, markets, and resources
                                needed
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Financial Tab */}
            {activeTab === "financial" && (
              <div className="space-y-8">
                <Card className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="border-b bg-gradient-to-r dark:from-slate-800 dark:to-slate-900">
                    <CardTitle className="text-xl">
                      Financial Overview
                    </CardTitle>
                    <CardDescription>
                      Financial information about your company
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fundingStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Funding Status
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-slate-300">
                                  <SelectValue placeholder="Select funding status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fundingStatuses.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hasBusinessBankAccount"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Business Bank Account
                              </FormLabel>
                              <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                                The business has a dedicated business bank
                                account
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amountRaised"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Amount Raised (USD)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                className="border-slate-300"
                              />
                            </FormControl>
                            <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                              Total funding raised to date
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fundingNeeded"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Funding Needed (USD)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                className="border-slate-300"
                              />
                            </FormControl>
                            <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                              Additional funding required
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-slate-900">
                        Annual Turnover
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name="annualTurnoverBefore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-500">
                                Previous Year
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-slate-300">
                                    <SelectValue placeholder="Select turnover range" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Pre-revenue">
                                    Pre-revenue
                                  </SelectItem>
                                  <SelectItem value="Less than $10,000">
                                    Less than $10,000
                                  </SelectItem>
                                  <SelectItem value="$10,000 - $50,000">
                                    $10,000 - $50,000
                                  </SelectItem>
                                  <SelectItem value="$50,000 - $100,000">
                                    $50,000 - $100,000
                                  </SelectItem>
                                  <SelectItem value="$100,000 - $500,000">
                                    $100,000 - $500,000
                                  </SelectItem>
                                  <SelectItem value="$500,000 - $1 million">
                                    $500,000 - $1 million
                                  </SelectItem>
                                  <SelectItem value="$1 million - $5 million">
                                    $1 million - $5 million
                                  </SelectItem>
                                  <SelectItem value="$5 million - $10 million">
                                    $5 million - $10 million
                                  </SelectItem>
                                  <SelectItem value="$10 million+">
                                    $10 million+
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="annualTurnoverCurrent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-500">
                                Current Year (Est.)
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-slate-300">
                                    <SelectValue placeholder="Select turnover range" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Pre-revenue">
                                    Pre-revenue
                                  </SelectItem>
                                  <SelectItem value="Less than $10,000">
                                    Less than $10,000
                                  </SelectItem>
                                  <SelectItem value="$10,000 - $50,000">
                                    $10,000 - $50,000
                                  </SelectItem>
                                  <SelectItem value="$50,000 - $100,000">
                                    $50,000 - $100,000
                                  </SelectItem>
                                  <SelectItem value="$100,000 - $500,000">
                                    $100,000 - $500,000
                                  </SelectItem>
                                  <SelectItem value="$500,000 - $1 million">
                                    $500,000 - $1 million
                                  </SelectItem>
                                  <SelectItem value="$1 million - $5 million">
                                    $1 million - $5 million
                                  </SelectItem>
                                  <SelectItem value="$5 million - $10 million">
                                    $5 million - $10 million
                                  </SelectItem>
                                  <SelectItem value="$10 million+">
                                    $10 million+
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="annualTurnoverNext"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-500">
                                Next Year (Proj.)
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-slate-300">
                                    <SelectValue placeholder="Select turnover range" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Pre-revenue">
                                    Pre-revenue
                                  </SelectItem>
                                  <SelectItem value="Less than $10,000">
                                    Less than $10,000
                                  </SelectItem>
                                  <SelectItem value="$10,000 - $50,000">
                                    $10,000 - $50,000
                                  </SelectItem>
                                  <SelectItem value="$50,000 - $100,000">
                                    $50,000 - $100,000
                                  </SelectItem>
                                  <SelectItem value="$100,000 - $500,000">
                                    $100,000 - $500,000
                                  </SelectItem>
                                  <SelectItem value="$500,000 - $1 million">
                                    $500,000 - $1 million
                                  </SelectItem>
                                  <SelectItem value="$1 million - $5 million">
                                    $1 million - $5 million
                                  </SelectItem>
                                  <SelectItem value="$5 million - $10 million">
                                    $5 million - $10 million
                                  </SelectItem>
                                  <SelectItem value="$10 million+">
                                    $10 million+
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-slate-900 dark:text-slate-500">
                          External Funding Sources
                        </h3>
                        <Badge
                          variant="outline"
                          className="font-normal dark:text-slate-500"
                        >
                          Select all that apply
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {externalFundingOptions.map((option) => (
                          <div
                            key={option}
                            className="flex items-center p-3 space-x-2 border rounded-md"
                          >
                            <Checkbox
                              id={`funding-${option}`}
                              checked={externalFunding.includes(option)}
                              onCheckedChange={() =>
                                handleCheckboxArrayChange(
                                  option,
                                  externalFunding,
                                  setExternalFunding
                                )
                              }
                            />
                            <label
                              htmlFor={`funding-${option}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>

                      {externalFunding.includes("Other") && (
                        <FormField
                          control={form.control}
                          name="otherExternalFunding"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Specify Other Funding Source
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter other funding source"
                                  {...field}
                                  className="border-slate-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="keepsFinancialRecords"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Financial Record Keeping
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-slate-300">
                                  <SelectValue placeholder="Select record keeping method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {financialRecordOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="border-b bg-gradient-to-r dark:from-slate-800 dark:to-slate-900">
                    <CardTitle className="text-xl dark:text-slate-500">
                      Financial Documents
                    </CardTitle>
                    <CardDescription className="dark:text-slate-500">
                      Upload financial documents and presentations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <h3 className="text-base font-medium text-slate-900 dark:text-slate-500">
                          Funding Documents
                        </h3>
                        <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed rounded-lg border-slate-200">
                          <FileText className="w-10 h-10 mb-4 text-slate-300" />
                          <h4 className="mb-1 text-sm font-medium text-slate-900">
                            {company?.fundingDocuments
                              ? "Replace funding documents"
                              : "Upload funding documents"}
                          </h4>
                          <p className="mb-4 text-xs text-slate-500 dark:text-slate-500">
                            PDF, DOC, or DOCX up to 10MB
                          </p>
                          <label
                            htmlFor="funding-docs-upload"
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-md shadow cursor-pointer h-9 bg-slate-900 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:text-slate-500"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </label>
                          <input
                            id="funding-docs-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleFundingDocChange}
                          />
                          {fundingDocName && (
                            <div className="flex items-center mt-4 text-sm text-slate-500">
                              <Check className="w-4 h-4 mr-2 text-green-500" />
                              Current file:{" "}
                              <span className="ml-1 font-medium">
                                {fundingDocName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-base font-medium text-slate-900 dark:text-slate-500">
                          Pitch Deck
                        </h3>
                        <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed rounded-lg border-slate-200">
                          <FileText className="w-10 h-10 mb-4 text-slate-300" />
                          <h4 className="mb-1 text-sm font-medium text-slate-900">
                            {company?.pitchDeck
                              ? "Replace pitch deck"
                              : "Upload pitch deck"}
                          </h4>
                          <p className="mb-4 text-xs text-slate-500 dark:text-slate-500">
                            PDF, PPT, or PPTX up to 20MB
                          </p>
                          <label
                            htmlFor="pitch-deck-upload"
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-md shadow cursor-pointer h-9 bg-slate-900 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:text-slate-500"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </label>
                          <input
                            id="pitch-deck-upload"
                            type="file"
                            accept=".pdf,.ppt,.pptx"
                            className="hidden"
                            onChange={handlePitchDeckChange}
                          />
                          {pitchDeckName && (
                            <div className="flex items-center mt-4 text-sm text-slate-500 dark:text-slate-500">
                              <Check className="w-4 h-4 mr-2 text-green-500" />
                              Current file:{" "}
                              <span className="ml-1 font-medium">
                                {pitchDeckName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Innovation & Impact Tab */}
            {activeTab === "innovation" && (
              <div className="space-y-8">
                <Card className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="border-b bg-gradient-to-r dark:from-slate-800 dark:to-slate-900">
                    <CardTitle className="text-xl dark:text-slate-500">
                      Innovation
                    </CardTitle>
                    <CardDescription className="dark:text-slate-500">
                      Information about your company's innovation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="isInnovative"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Innovative Business
                              </FormLabel>
                              <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                                The business has an innovative approach,
                                product, or service
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="usesDigitalTools"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Uses Digital Tools
                              </FormLabel>
                              <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                                The business uses digital tools and technologies
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {form.watch("isInnovative") && (
                      <FormField
                        control={form.control}
                        name="innovationExplanation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Innovation Explanation
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Explain what makes your business innovative"
                                {...field}
                                className="border-slate-300 min-h-[100px]"
                              />
                            </FormControl>
                            <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                              Describe what makes your business innovative and
                              how it differentiates from competitors
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {form.watch("usesDigitalTools") && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-medium text-slate-900 dark:text-slate-500">
                            Digital Tools Used
                          </h3>
                          <Badge
                            variant="outline"
                            className="font-normal dark:text-slate-500"
                          >
                            Select all that apply
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                          {digitalToolsOptions.map((option) => (
                            <div
                              key={option}
                              className="flex items-center p-3 space-x-2 border rounded-md dark:text-slate-500"
                            >
                              <Checkbox
                                id={`tool-${option}`}
                                checked={digitalTools.includes(option)}
                                onCheckedChange={() =>
                                  handleCheckboxArrayChange(
                                    option,
                                    digitalTools,
                                    setDigitalTools
                                  )
                                }
                              />
                              <label
                                htmlFor={`tool-${option}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>

                        {digitalTools.includes("Other") && (
                          <FormField
                            control={form.control}
                            name="otherDigitalTools"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                  Specify Other Digital Tools
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter other digital tools"
                                    {...field}
                                    className="border-slate-300 dark:text-slate-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="border-b bg-gradient-to-r dark:from-slate-800 dark:to-slate-900">
                    <CardTitle className="text-xl dark:text-slate-500">
                      Social & Environmental Impact
                    </CardTitle>
                    <CardDescription className="dark:text-slate-500">
                      Information about your company's social and environmental
                      impact
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="employsVulnerableGroups"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Employs Vulnerable Groups
                              </FormLabel>
                              <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                                The business employs people from vulnerable or
                                marginalized groups
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addressesEnvironmentalSustainability"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                                Environmental Sustainability
                              </FormLabel>
                              <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                                The business addresses environmental
                                sustainability in its operations
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {(form.watch("employsVulnerableGroups") ||
                      form.watch("addressesEnvironmentalSustainability")) && (
                      <FormField
                        control={form.control}
                        name="impactInitiatives"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Impact Initiatives
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your impact initiatives"
                                {...field}
                                className="border-slate-300 min-h-[100px]"
                              />
                            </FormControl>
                            <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                              Describe your social and environmental impact
                              initiatives in detail
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <Separator className="my-6" />

                    <FormField
                      control={form.control}
                      name="joinEcosystemPrograms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Ecosystem Programs Interest
                            </FormLabel>
                            <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                              The business is interested in joining ecosystem
                              support programs
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalComments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                            Additional Comments
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional information you'd like to share"
                              {...field}
                              className="border-slate-300 min-h-[100px] dark:text-slate-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Contact & Social Tab */}
            {activeTab === "contact" && (
              <div className="space-y-8">
                <Card className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="border-b bg-gradient-to-r dark:from-slate-800 dark:to-slate-900">
                    <CardTitle className="text-xl dark:text-slate-500">
                      Contact Information
                    </CardTitle>
                    <CardDescription className="dark:text-slate-500">
                      Contact details for your company
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Email Address*
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter email address"
                                {...field}
                                className="border-slate-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter phone number"
                                {...field}
                                className="border-slate-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Website
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com"
                                {...field}
                                className="border-slate-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter address"
                                {...field}
                                className="border-slate-300"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="headOfficeAddress"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-base font-medium text-slate-900 dark:text-slate-500">
                              Head Office Address
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter head office address"
                                {...field}
                                className="border-slate-300 min-h-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-0 shadow-md">
                  <CardHeader className="border-b bg-gradient-to-r dark:from-slate-800 dark:to-slate-900">
                    <CardTitle className="text-xl dark:text-slate-500">
                      Social Media
                    </CardTitle>
                    <CardDescription className="dark:text-slate-500">
                      Social media profiles for your company
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      {socialLinks.map((link, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 dark:text-slate-500"
                        >
                          <div className="flex-1">
                            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-500">
                              Platform
                            </label>
                            <select
                              value={link.name}
                              onChange={(e) =>
                                updateSocialLink(index, "name", e.target.value)
                              }
                              className="w-full p-2 text-sm border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-slate-500"
                            >
                              <option value="">Select platform</option>
                              <option value="LinkedIn">LinkedIn</option>
                              <option value="Twitter">Twitter</option>
                              <option value="Facebook">Facebook</option>
                              <option value="Instagram">Instagram</option>
                              <option value="YouTube">YouTube</option>
                              <option value="TikTok">TikTok</option>
                              <option value="GitHub">GitHub</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="flex-[2]">
                            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-500">
                              URL
                            </label>
                            <Input
                              value={link.link}
                              onChange={(e) =>
                                updateSocialLink(index, "link", e.target.value)
                              }
                              placeholder="https://example.com"
                              className="border-slate-300 dark:text-slate-500"
                            />
                          </div>
                          <div className="flex items-end pb-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSocialLink(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-slate-500"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSocialLink}
                        className="mt-2 dark:text-slate-500"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Social Media
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t dark:text-slate-500">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/companies/${company._id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin dark:text-slate-500" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2 dark:text-slate-500" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
