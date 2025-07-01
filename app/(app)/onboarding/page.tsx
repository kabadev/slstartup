"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Building2,
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Globe,
  HelpCircle,
  Info,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { debounce } from "lodash";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

import { toast } from "@/components/ui/use-toast";
import { sectorsData } from "@/data/sectors";
import { useCompany } from "@/contexts/company-context";
import { useInvestor } from "@/contexts/investor-context";
import {
  companyRanges,
  companyStages,
  companyTypes,
  fundingStatus,
  investorTypes,
} from "@/data";
import { useUser } from "@clerk/nextjs";
import {
  loadCompanyProgress,
  saveCompanyProgress,
} from "@/app/actions/company-actions";
const investmentTypes: any = [];
// Enhanced Company form schema with all new fields
const companyFormSchema = z.object({
  // Step 1: Basic Information
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name is too long"),
  sector: z.string().min(1, "Sector is required"),
  otherSector: z.string().optional(),
  type: z.string().optional(),
  stage: z.string().optional(),

  // Step 2: Contact Information
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is too short").optional(),
  address: z.string().min(5, "Address is too short").optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  socialLinks: z
    .array(
      z.object({
        name: z.string(),
        link: z.string().url("Invalid URL").or(z.literal("")),
      })
    )
    .optional(),

  // Step 3: Company Details
  location: z.string().optional(),
  foundedAt: z.date().optional(),
  registrationNumber: z.string().optional(),
  description: z
    .string()
    .min(10, "Please provide a more detailed description")
    .max(1000, "Description is too long")
    .optional(),
  missionStatement: z
    .string()
    .max(500, "Mission statement is too long")
    .optional(),
  employeesRange: z.string().optional(),

  // Step 4: Funding Information
  fundingStatus: z.string().optional(),
  amountRaised: z.number().nonnegative("Amount must be positive").optional(),
  fundingNeeded: z.number().nonnegative("Amount must be positive").optional(),
  fundingDocuments: z.string().optional(),
  pitchDeck: z.string().optional(),

  // Step 5: General Business Information
  headOfficeAddress: z.string().min(1, "Head office address is required"),
  businessModel: z.enum(["B2B", "B2C", "B2G", "Other"]),
  otherBusinessModel: z.string().optional(),
  isYouthLed: z.enum(["Yes", "No"]),
  isWomanLed: z.enum(["Yes", "No"]),

  // Step 6: Ownership & Management
  founderName: z.string().min(1, "Founder name is required"),
  founderGender: z.enum(["Male", "Female", "Prefer not to say"]),
  founderDob: z.date().refine((date) => {
    return date <= new Date();
  }, "Date of birth cannot be in the future"),
  founderEducation: z.enum([
    "Primary",
    "Secondary",
    "Tertiary",
    "Technical/vocational",
    "University",
    "Post Graduate",
    "Informal",
    "None",
  ]),
  taxCompliance: z.array(
    z.enum(["NRA registration", "Nassit Registration", "None of the above"])
  ),
  sectorLicenses: z.enum([
    "Yes, I hold",
    "Yes, but I do not hold",
    "No, I do not require",
  ]),
  hasIntellectualProperty: z.enum(["Yes", "No"]),

  // Step 7: Financial & Banking

  annualTurnoverBefore: z.string().min(1, "Annual turnover before is required"),
  annualTurnoverCurrent: z
    .string()
    .min(1, "Current annual turnover is required"),
  annualTurnoverNext: z
    .string()
    .min(1, "Projected annual turnover is required"),
  hasBusinessBankAccount: z.enum(["Yes", "No"]),
  externalFunding: z.array(
    z.enum([
      "Friends/family",
      "Angel Investment",
      "Grants",
      "Venture Capital",
      "Loans",
      "Crowdfunding",
      "None",
      "Other",
    ])
  ),
  otherExternalFunding: z.string().optional(),
  keepsFinancialRecords: z.enum(["Yes", "No", "Not Yet"]),

  // Step 8: Innovation & Digital Tools
  usesDigitalTools: z.enum(["Yes", "No"]),
  digitalTools: z
    .array(
      z.enum([
        "Mobile Money",
        "Accounting Software",
        "POS",
        "E-commerce Platforms",
        "Social Media Marketing",
        "CRM / ERP Tools",
        "Other",
      ])
    )
    .optional(),
  otherDigitalTools: z.string().optional(),
  isInnovative: z.enum(["Yes", "No"]),
  innovationExplanation: z.string().optional(),

  // Step 9: Challenges & Growth
  businessChallenges: z.array(
    z.enum([
      "Access to Finance",
      "Market Access",
      "Skilled Labour",
      "Raw Materials",
      "Infrastructure",
      "Regulation / Compliance",
      "Digital Skills",
      "Other",
    ])
  ),
  otherBusinessChallenges: z.string().optional(),
  supportNeeded: z
    .string()
    .min(1, "Please describe the support your business needs"),
  planningExpansion: z.enum(["Yes", "No"]),
  expansionPlans: z.string().optional(),

  // Step 10: Social & Environmental Impact
  employsVulnerableGroups: z.enum(["Yes", "No"]),
  addressesEnvironmentalSustainability: z.enum(["Yes", "No"]),
  impactInitiatives: z.string().optional(),

  // Step 11: Consent & Follow Up
  joinEcosystemPrograms: z.enum(["Yes", "No"]),
  consentToDataUsage: z.enum(["Yes", "No"]),
  additionalComments: z.string().optional(),

  // Registration verification fields
  isRegistered: z.enum(["Yes", "No"]),
  registrationNumberInput: z.string().optional(),
});

// Entity type selection schema
const entityTypeSchema = z.object({
  entityType: z.enum(["company", "investor"]),
});

// Investor form schema (keeping this for reference)
const investorFormSchema = z.object({
  // Step 1: Basic Information
  name: z.string().min(2, "Investor name must be at least 2 characters"),
  type: z.string().optional(),
  sectorInterested: z.array(z.string()).min(1, "Select at least one sector"),

  // Step 2: Contact Information
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  socialLinks: z
    .array(
      z.object({
        name: z.string(),
        link: z.string().url("Invalid URL").or(z.literal("")),
      })
    )
    .optional(),

  // Step 3: Investment Details
  location: z.string().optional(),
  foundedAt: z.date().optional(),
  registrationNumber: z.string().optional(),
  description: z.string().optional(),
  fundingCapacity: z.string().optional(),
  stage: z.string().optional(),

  // Step 4: Documents & Additional Info
  amountRaised: z.number().nonnegative().optional(),
  businessRegistrationDocuments: z.string().optional(),
  investmentBroucher: z.string().optional(),
  goalExpected: z.string().optional(),
});

type EntityType = z.infer<typeof entityTypeSchema>["entityType"];
type CompanyFormData = z.infer<typeof companyFormSchema>;
type InvestorFormData = z.infer<typeof investorFormSchema>;

// Turnover ranges
const turnoverRanges = [
  "Less than $10,000",
  "$10,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000 - $500,000",
  "$500,000 - $1 million",
  "$1 million - $5 million",
  "More than $5 million",
  "Prefer not to say",
  "Not applicable",
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const { addCompany, loading: companyLoading } = useCompany();
  const { addInvestor, loading: investorLoading } = useInvestor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [step, setStep] = useState(0); // 0 = entity selection, 1+ = form steps
  const [socialLinks, setSocialLinks] = useState([{ name: "", link: "" }]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [totalSteps] = useState(12); // Increased to 12 steps for company form
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  // Load saved progress on component mount
  useEffect(() => {
    loadProgress();
  }, [user]);

  // Company form with enhanced default values
  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      sector: "",
      otherSector: "",
      type: "",
      stage: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      socialLinks: [{ name: "", link: "" }],
      location: "",
      foundedAt: undefined,
      registrationNumber: "",
      description: "",
      missionStatement: "",
      employeesRange: "",
      fundingStatus: "",
      amountRaised: undefined,
      fundingNeeded: undefined,
      fundingDocuments: "",
      pitchDeck: "",
      headOfficeAddress: "",
      businessModel: "B2B",
      otherBusinessModel: "",
      isYouthLed: "No",
      isWomanLed: "No",
      founderName: "",
      founderGender: "Prefer not to say",
      founderDob: undefined,
      founderEducation: "University",
      taxCompliance: [],
      sectorLicenses: "No, I do not require",
      hasIntellectualProperty: "No",
      annualTurnoverBefore: "",
      annualTurnoverCurrent: "",
      annualTurnoverNext: "",
      hasBusinessBankAccount: "No",
      externalFunding: [],
      otherExternalFunding: "",
      keepsFinancialRecords: "No",
      usesDigitalTools: "No",
      digitalTools: [],
      otherDigitalTools: "",
      isInnovative: "No",
      innovationExplanation: "",
      businessChallenges: [],
      otherBusinessChallenges: "",
      supportNeeded: "",
      planningExpansion: "No",
      expansionPlans: "",
      employsVulnerableGroups: "No",
      addressesEnvironmentalSustainability: "No",
      impactInitiatives: "",
      joinEcosystemPrograms: "No",
      consentToDataUsage: "No",
      additionalComments: "",
      isRegistered: "No",
      registrationNumberInput: "",
    },
  });

  // Investor form (keeping this for reference)
  const investorForm = useForm<InvestorFormData>({
    resolver: zodResolver(investorFormSchema),
    defaultValues: {
      name: "",
      type: "",
      sectorInterested: [],
      email: "",
      phone: "",
      address: "",
      website: "",
      socialLinks: [{ name: "", link: "" }],
      location: "",
      foundedAt: undefined,
      registrationNumber: "",
      description: "",
      fundingCapacity: "",
      stage: "",
      amountRaised: undefined,
      businessRegistrationDocuments: "",
      investmentBroucher: "",
      goalExpected: "",
    },
  });

  // Watch for form values to conditionally show/hide fields
  const selectedSector = companyForm.watch("sector");
  const selectedBusinessModel = companyForm.watch("businessModel");
  const usesDigitalToolsValue = companyForm.watch("usesDigitalTools");
  const isInnovativeValue = companyForm.watch("isInnovative");
  const planningExpansionValue = companyForm.watch("planningExpansion");
  const externalFundingValues = companyForm.watch("externalFunding");
  const businessChallengesValues = companyForm.watch("businessChallenges");
  const digitalToolsValues = companyForm.watch("digitalTools");

  // Calculate form progress
  useEffect(() => {
    if (entityType === "company") {
      // Calculate progress based on current step (step 0 is entity selection)
      const progress = step === 0 ? 0 : Math.round((step / totalSteps) * 100);
      setFormProgress(progress);
    } else if (entityType === "investor") {
      // For investor form (4 steps)
      const progress = step === 0 ? 0 : Math.round((step / 4) * 100);
      setFormProgress(progress);
    }
  }, [step, totalSteps, entityType]);

  const selectEntityType = (type: EntityType) => {
    setEntityType(type);
    setStep(1); // Move to first step of the form
  };

  const nextStep = () => {
    // Validate current step fields before proceeding
    if (entityType === "company") {
      if (step === 1) {
        const isRegistered = companyForm.getValues("isRegistered");
        if (isRegistered === "No") {
          // Don't allow progression if not registered
          return;
        }
        companyForm
          .trigger(["isRegistered", "registrationNumberInput"])
          .then((isValid) => {
            if (isValid) {
              // Copy registration number to the main field
              const regNumber = companyForm.getValues(
                "registrationNumberInput"
              );
              companyForm.setValue("registrationNumber", regNumber);
              setStep(step + 1);
              saveProgress();
            }
          });
      } else if (step === 2) {
        companyForm
          .trigger(["name", "sector", "otherSector", "type", "stage"])
          .then((isValid) => {
            if (isValid) {
              setStep(step + 1);
              saveProgress();
            }
          });
      } else if (step === 3) {
        companyForm
          .trigger(["email", "phone", "address", "website"])
          .then((isValid) => {
            if (isValid) {
              setStep(step + 1);
              saveProgress();
            }
          });
      } else if (step === 4) {
        companyForm
          .trigger([
            "location",
            "foundedAt",
            "registrationNumber",
            "description",
            "missionStatement",
            "employeesRange",
          ])
          .then((isValid) => {
            if (isValid) {
              setStep(step + 1);
              saveProgress();
            }
          });
      } else if (step === 5) {
        companyForm
          .trigger([
            "fundingStatus",
            "amountRaised",
            "fundingNeeded",
            "fundingDocuments",
            "pitchDeck",
          ])
          .then((isValid) => {
            if (isValid) {
              setStep(step + 1);
              saveProgress();
            }
          });
      } else if (step === 6) {
        companyForm
          .trigger([
            "headOfficeAddress",
            "businessModel",
            "otherBusinessModel",
            "isYouthLed",
            "isWomanLed",
          ])
          .then((isValid) => {
            if (isValid) {
              setStep(step + 1);
              saveProgress();
            }
          });
      } else if (step === 7) {
        companyForm
          .trigger([
            "founderName",
            "founderGender",
            "founderDob",
            "founderEducation",
            "taxCompliance",
            "sectorLicenses",
            "hasIntellectualProperty",
          ])
          .then((isValid) => {
            if (isValid) {
              setStep(step + 1);
              saveProgress();
            }
          });
      } else if (step === 8) {
        companyForm
          .trigger([
            "annualTurnoverBefore",
            "annualTurnoverCurrent",
            "annualTurnoverNext",
            "hasBusinessBankAccount",
            "externalFunding",
            "otherExternalFunding",
            "keepsFinancialRecords",
          ])
          .then((isValid) => {
            if (isValid) {
              setStep(step + 1);
              saveProgress();
            }
          });
      } else if (step === 9) {
        companyForm
          .trigger([
            "usesDigitalTools",
            "digitalTools",
            "otherDigitalTools",
            "isInnovative",
            "innovationExplanation",
          ])
          .then((isValid) => {
            if (isValid) {
              setStep(step + 1);
              saveProgress();
            }
          });
      } else if (step === 10) {
        companyForm
          .trigger([
            "businessChallenges",
            "otherBusinessChallenges",
            "supportNeeded",
            "planningExpansion",
            "expansionPlans",
          ])
          .then((isValid) => {
            if (isValid) {
              setStep(step + 1);
              saveProgress();
            }
          });
      } else if (step === 11) {
        companyForm
          .trigger([
            "employsVulnerableGroups",
            "addressesEnvironmentalSustainability",
            "impactInitiatives",
          ])
          .then((isValid) => {
            if (isValid) {
              setStep(step + 1);
              saveProgress();
            }
          });
      } else {
        setStep(Math.min(step + 1, totalSteps));
        saveProgress();
      }
    } else if (entityType === "investor") {
      if (step === 1) {
        // Update sectorInterested in the form
        investorForm.setValue("sectorInterested", selectedSectors);
        investorForm
          .trigger(["name", "type", "sectorInterested"])
          .then((isValid) => {
            if (isValid) {
              setStep(step + 1);
              saveProgress();
            }
          });
      } else if (step === 2) {
        investorForm
          .trigger(["email", "phone", "address", "website"])
          .then((isValid) => {
            if (isValid) {
              setStep(step + 1);
              saveProgress();
            }
          });
      } else if (step === 3) {
        investorForm
          .trigger([
            "location",
            "foundedAt",
            "registrationNumber",
            "description",
            "fundingCapacity",
          ])
          .then((isValid) => {
            if (isValid) {
              setStep(step + 1);
              saveProgress();
            }
          });
      } else {
        setStep(Math.min(step + 1, 4)); // Investor form has 4 steps
        saveProgress();
      }
    }
  };

  const prevStep = () => {
    if (step === 1) {
      // Go back to entity selection
      setEntityType(null);
      setStep(0);
    } else {
      setStep(Math.max(step - 1, 1));
    }
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { name: "", link: "" }]);
  };

  const updateSocialLink = (
    index: number,
    field: "name" | "link",
    value: string
  ) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][field] = value;
    setSocialLinks(updatedLinks);

    if (entityType === "company") {
      companyForm.setValue("socialLinks", updatedLinks);
    } else if (entityType === "investor") {
      investorForm.setValue("socialLinks", updatedLinks);
    }
  };

  const removeSocialLink = (index: number) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);

    if (entityType === "company") {
      companyForm.setValue("socialLinks", updatedLinks);
    } else if (entityType === "investor") {
      investorForm.setValue("socialLinks", updatedLinks);
    }
  };

  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  };

  const clearProgress = () => {
    localStorage.removeItem("onboarding_entityType");
    localStorage.removeItem("onboarding_step");
    localStorage.removeItem("onboarding_selectedSectors");
    localStorage.removeItem("onboarding_socialLinks");
    localStorage.removeItem("onboarding_companyData");
    localStorage.removeItem("onboarding_investorData");
  };

  const saveProgressDebounced = debounce(() => {
    // saveProgress();
  }, 1500);
  // Save after 1.5 seconds of inactivity

  // Auto-save company form changes
  useEffect(() => {
    if (entityType === "company" && step > 0) {
      saveProgressDebounced();
    }

    return () => {
      saveProgressDebounced.cancel();
    };
  }, [companyForm.watch(), entityType, step]);

  // Auto-save investor form changes
  useEffect(() => {
    if (entityType === "investor" && step > 0) {
      saveProgressDebounced();
    }

    return () => {
      saveProgressDebounced.cancel();
    };
  }, [investorForm.watch(), entityType, step]);

  // Auto-save when sectors or social links change
  useEffect(() => {
    if (step > 0) {
      saveProgressDebounced();
    }

    return () => {
      saveProgressDebounced.cancel();
    };
  }, [selectedSectors, socialLinks, step]);

  const saveProgress = async () => {
    try {
      setIsSaving(true);
      const cdata: any = {
        userId: user?.id,
        entityType: entityType,
        step: step,
        selectedSectors: selectedSectors,
        socialLinks: socialLinks,
      };

      // Save form data based on entity type
      if (entityType === "company") {
        cdata.companyData = JSON.stringify(companyForm.getValues());
      } else if (entityType === "investor") {
        cdata.investorData = JSON.stringify(investorForm.getValues());
      }

      await saveCompanyProgress(user?.id!, cdata);

      // Update last saved timestamp
      const now = new Date();
      setLastSaved(now);

      // Only show toast for manual saves
      // if (saveProgressDebounced.flush) {
      //   toast({
      //     title: "Progress saved",
      //     description: "You can continue from this point later.",
      //   });
      // }
      setIsSaving(false);
      // setTimeout(() => setIsSaving(false), 500);
    } catch (error) {
      console.error("Error saving progress:", error);
      setIsSaving(false);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive",
      });
    }
  };

  const loadProgress = async () => {
    const companyProgress = await loadCompanyProgress(user?.id!);

    try {
      // Load entity type
      // const savedEntityType = localStorage.getItem("onboarding_entityType");
      const savedEntityType = companyProgress.entityType;
      if (savedEntityType) {
        setEntityType(savedEntityType as EntityType);
      }

      // Load current step
      // const savedStep = localStorage.getItem("onboarding_step");
      const savedStep = companyProgress.step;
      if (savedStep) {
        setStep(savedStep);
      }

      // Load selected sectors for investor
      // const savedSectors = localStorage.getItem("onboarding_selectedSectors");
      const savedSectors = companyProgress.selectedSectors;
      if (savedSectors) {
        // setSelectedSectors(JSON.parse(savedSectors));
        setSelectedSectors(savedSectors);
      }

      // Load social links
      // const savedSocialLinks = localStorage.getItem("onboarding_socialLinks");
      const savedSocialLinks = companyProgress.socialLinks;
      if (savedSocialLinks) {
        // setSocialLinks(JSON.parse(savedSocialLinks));
        setSocialLinks(savedSocialLinks);
      }

      // Load form data based on entity type
      if (savedEntityType === "company") {
        // const savedCompanyData = localStorage.getItem("onboarding_companyData");
        const savedCompanyData = companyProgress.companyData;
        if (savedCompanyData) {
          const parsedData = JSON.parse(savedCompanyData);
          // const parsedData = savedCompanyData;

          // Handle date conversion for foundedAt and founderDob
          if (parsedData.foundedAt) {
            parsedData.foundedAt = new Date(parsedData.foundedAt);
          }
          if (parsedData.founderDob) {
            parsedData.founderDob = new Date(parsedData.founderDob);
          }

          companyForm.reset(parsedData);
        }
      } else if (savedEntityType === "investor") {
        // const savedInvestorData = localStorage.getItem(
        //   "onboarding_investorData"
        // );
        const savedInvestorData = companyProgress.investorData;
        if (savedInvestorData) {
          const parsedData = JSON.parse(savedInvestorData);

          // Handle date conversion for foundedAt
          if (parsedData.foundedAt) {
            parsedData.foundedAt = new Date(parsedData.foundedAt);
          }

          investorForm.reset(parsedData);
        }
      }
    } catch (error) {
      console.error("Error loading progress:", error);
      toast({
        title: "Error",
        description: "Failed to load saved progress",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      // Update social links in the form data
      if (entityType === "company") {
        data.socialLinks = socialLinks.filter((link) => link.name && link.link);

        // Add company using context
        const result: any = await addCompany({
          ...data,
          userId: user?.id,
          isYouthLed: data.isYouthLed === "Yes",
          isWomanLed: data.isWomanLed === "Yes",
          usesDigitalTools: data.usesDigitalTools === "Yes",
          isInnovative: data.isInnovative === "Yes",
          employsVulnerableGroups: data.employsVulnerableGroups === "Yes",
          addressesEnvironmentalSustainability:
            data.addressesEnvironmentalSustainability === "Yes",
          joinEcosystemPrograms: data.joinEcosystemPrograms === "Yes",
        });
        if (result.success) {
          router.push(`/companies/${result?.companyId}`);
        } else {
          alert("failrf");
        }
      } else if (entityType === "investor") {
        data.socialLinks = socialLinks.filter((link) => link.name && link.link);
        data.sectorInterested = selectedSectors;

        // Add investor using context
        const result: any = await addInvestor({
          ...data,
          userId: user?.id,
        });

        if (result.success) {
          router.push(`/investors/${result.investorId}`);
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create investor profile",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Get the current form based on entity type
  const getCurrentForm = () => {
    switch (entityType) {
      case "company":
        return companyForm;
      case "investor":
        return investorForm;
      default:
        return companyForm;
    }
  };

  // Get step title based on entity type and step
  const getStepTitle = () => {
    if (entityType === "company") {
      return step === 1
        ? "Registration Verification"
        : step === 2
        ? "Basic Information"
        : step === 3
        ? "Contact Information"
        : step === 4
        ? "Company Details"
        : step === 5
        ? "Funding Information"
        : step === 6
        ? "General Business Information"
        : step === 7
        ? "Ownership & Management"
        : step === 8
        ? "Financial & Banking"
        : step === 9
        ? "Innovation & Digital Tools"
        : step === 10
        ? "Challenges & Growth"
        : step === 11
        ? "Social & Environmental Impact"
        : "Consent & Follow Up";
    } else if (entityType === "investor") {
      return step === 1
        ? "Basic Information"
        : step === 2
        ? "Contact Information"
        : step === 3
        ? "Investment Details"
        : "Describe your typical Requirements";
    } else {
      return "";
    }
  };

  // Get step description based on entity type and step
  const getStepDescription = () => {
    if (entityType === "company") {
      return step === 1
        ? "Please confirm your company registration status"
        : step === 2
        ? "Let's start with the essentials about your company"
        : step === 3
        ? "How can people reach your company?"
        : step === 4
        ? "Tell us more about your company's background"
        : step === 5
        ? "Share details about your company's financial situation"
        : step === 6
        ? "Tell us about your business model and sector"
        : step === 7
        ? "Information about the company's founder and compliance"
        : step === 8
        ? "Details about your company's financial status and banking"
        : step === 9
        ? "Tell us about your use of technology and innovation"
        : step === 10
        ? "What challenges does your business face and how do you plan to grow?"
        : step === 11
        ? "Tell us about your social and environmental impact"
        : "Final steps and consent information";
    } else if (entityType === "investor") {
      return step === 1
        ? "Let's start with the essentials about your investment firm"
        : step === 2
        ? "How can people reach you?"
        : step === 3
        ? "Tell us more about your investment preferences"
        : "Share additional documents and information";
    } else {
      return "";
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const isLoading = companyLoading || investorLoading;

  return (
    <div className="py-10">
      <div className="p-4 sm:p-6 lg:p-8">
        {step === 0 ? (
          // Entity Type Selection
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Select Your Entity Type</CardTitle>
              <CardDescription>
                Choose the type of entity you're registering to continue with
                the appropriate onboarding process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary",
                    entityType === "company" && "border-2 border-primary"
                  )}
                  onClick={() => selectEntityType("company")}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Company</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      For businesses, startups, and corporations
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary",
                    entityType === "investor" && "border-2 border-primary"
                  )}
                  onClick={() => selectEntityType("investor")}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Investor</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      For venture capital, angel investors, and investment firms
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Multi-step form based on entity type
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold">
                {entityType === "company"
                  ? "Complete Your Company Profile"
                  : "Complete Your Investor Profile"}
              </h1>
              <p className="mt-2 text-muted-foreground">
                Let's get to know your {entityType} better. This information
                will help us tailor our services to your needs.
              </p>

              {/* Form progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {entityType === "company"
                      ? `Step ${step} of ${totalSteps}`
                      : entityType === "investor"
                      ? `Step ${step} of 4`
                      : ""}
                  </span>
                  <span className="text-sm font-medium">{formProgress}%</span>
                </div>
                <Progress value={formProgress} className="h-2 mt-2" />
              </div>

              {/* Progress indicator */}
              <div className="justify-between hidden mt-8 md:flex">
                {Array.from({
                  length: entityType === "company" ? 12 : 4,
                }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2",
                        step > index + 1
                          ? "border-green-500 bg-green-500 text-white"
                          : step === index + 1
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 text-gray-400"
                      )}
                    >
                      {step > index + 1 ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={cn(
                        "mt-2 text-xs",
                        step === index + 1
                          ? "font-medium text-primary"
                          : "text-gray-500"
                      )}
                    >
                      {entityType === "company"
                        ? index === 0
                          ? "Registration"
                          : index === 1
                          ? "Basic Info"
                          : index === 2
                          ? "Contact"
                          : index === 3
                          ? "Details"
                          : index === 4
                          ? "Funding"
                          : index === 5
                          ? "Business Info"
                          : index === 6
                          ? "Ownership"
                          : index === 7
                          ? "Financial"
                          : index === 8
                          ? "Innovation"
                          : index === 9
                          ? "Challenges"
                          : index === 10
                          ? "Impact"
                          : "Consent"
                        : index === 0
                        ? "Basic Info"
                        : index === 1
                        ? "Contact"
                        : index === 2
                        ? "Investment"
                        : "Documents"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile step indicator */}
              <div className="flex items-center justify-between mt-4 md:hidden">
                <span className="text-sm font-medium">
                  Step {step} of {entityType === "company" ? totalSteps : 4}
                </span>
                <span className="text-sm font-medium">{getStepTitle()}</span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{getStepTitle()}</CardTitle>
                <CardDescription>{getStepDescription()}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Company Form Steps */}
                {entityType === "company" && (
                  <form
                    onSubmit={companyForm.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Step 1: Registration Verification */}
                    {step === 1 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="isRegistered">
                              Are you registered?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "isRegistered",
                                  value as "Yes" | "No"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "isRegistered"
                              )}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Yes"
                                  id="registered-yes"
                                />
                                <Label htmlFor="registered-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="registered-no" />
                                <Label htmlFor="registered-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {companyForm.watch("isRegistered") === "No" && (
                            <Alert className="border-red-200 bg-red-50">
                              <Info className="w-4 h-4 text-red-600" />
                              <AlertDescription className="text-red-800">
                                You need to be a registered company with the
                                following: Corporate Affairs Commission, City
                                Council, or Local Council before proceeding with
                                this onboarding form.
                              </AlertDescription>
                            </Alert>
                          )}

                          {companyForm.watch("isRegistered") === "Yes" && (
                            <div className="space-y-2">
                              <Label htmlFor="registrationNumberInput">
                                Registration Number{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="registrationNumberInput"
                                {...companyForm.register(
                                  "registrationNumberInput"
                                )}
                                placeholder="Enter your registration number"
                              />
                              {companyForm.formState.errors
                                .registrationNumberInput && (
                                <p className="text-sm text-red-500">
                                  {
                                    companyForm.formState.errors
                                      .registrationNumberInput.message
                                  }
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Step 2: Basic Information */}
                    {step === 2 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="name">
                                Company Name{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-80">
                                      Enter your company's legal name as it
                                      appears on official documents.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                              <Input
                                id="name"
                                {...companyForm.register("name")}
                                placeholder="Enter your company name"
                              />
                            </div>
                            {companyForm.formState.errors.name && (
                              <p className="text-sm text-red-500">
                                {companyForm.formState.errors.name.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sector">
                              Sector <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                companyForm.setValue("sector", value)
                              }
                              defaultValue={companyForm.getValues("sector")}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select your company sector" />
                              </SelectTrigger>
                              <SelectContent>
                                {sectorsData.map((sector) => (
                                  <SelectItem
                                    key={sector.title}
                                    value={sector.title}
                                  >
                                    {sector.title}
                                  </SelectItem>
                                ))}
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            {companyForm.formState.errors.sector && (
                              <p className="text-sm text-red-500">
                                {companyForm.formState.errors.sector.message}
                              </p>
                            )}
                          </div>

                          {selectedSector === "Other" && (
                            <div className="space-y-2">
                              <Label htmlFor="otherSector">
                                Specify Sector{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="otherSector"
                                {...companyForm.register("otherSector")}
                                placeholder="Please specify your sector"
                              />
                              {companyForm.formState.errors.otherSector && (
                                <p className="text-sm text-red-500">
                                  {
                                    companyForm.formState.errors.otherSector
                                      .message
                                  }
                                </p>
                              )}
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="type">Company Type</Label>
                            <Select
                              onValueChange={(value) =>
                                companyForm.setValue("type", value)
                              }
                              defaultValue={companyForm.getValues("type")}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select your company type" />
                              </SelectTrigger>
                              <SelectContent>
                                {companyTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="stage">Company Stage</Label>
                            <Select
                              onValueChange={(value) =>
                                companyForm.setValue("stage", value)
                              }
                              defaultValue={companyForm.getValues("stage")}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select your company stage" />
                              </SelectTrigger>
                              <SelectContent>
                                {companyStages.map((stage) => (
                                  <SelectItem key={stage} value={stage}>
                                    {stage}
                                  </SelectItem>
                                ))}
                                {!companyStages.includes("Series C") && (
                                  <SelectItem value="Series C">
                                    Series C
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 3: Contact Information */}
                    {step === 3 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">
                              Email Address{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <Input
                                id="email"
                                type="email"
                                {...companyForm.register("email")}
                                placeholder="company@example.com"
                              />
                            </div>
                            {companyForm.formState.errors.email && (
                              <p className="text-sm text-red-500">
                                {companyForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <Input
                                id="phone"
                                {...companyForm.register("phone")}
                                placeholder="+1 (555) 123-4567"
                              />
                            </div>
                            {companyForm.formState.errors.phone && (
                              <p className="text-sm text-red-500">
                                {companyForm.formState.errors.phone.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <Textarea
                                id="address"
                                {...companyForm.register("address")}
                                placeholder="123 Business St, City, Country"
                              />
                            </div>
                            {companyForm.formState.errors.address && (
                              <p className="text-sm text-red-500">
                                {companyForm.formState.errors.address.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-muted-foreground" />
                              <Input
                                id="website"
                                {...companyForm.register("website")}
                                placeholder="https://yourcompany.com"
                              />
                            </div>
                            {companyForm.formState.errors.website && (
                              <p className="text-sm text-red-500">
                                {companyForm.formState.errors.website.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Social Links</Label>
                            {socialLinks.map((link, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-6 gap-2"
                              >
                                <Select
                                  onValueChange={(value) =>
                                    updateSocialLink(index, "name", value)
                                  }
                                  value={link.name}
                                >
                                  <SelectTrigger className="col-span-2">
                                    <SelectValue placeholder="Platform" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="linkedin">
                                      LinkedIn
                                    </SelectItem>
                                    <SelectItem value="twitter">X</SelectItem>
                                    <SelectItem value="facebook">
                                      Facebook
                                    </SelectItem>
                                    <SelectItem value="instagram">
                                      Instagram
                                    </SelectItem>
                                    <SelectItem value="youtube">
                                      YouTube
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  className="col-span-3"
                                  placeholder="https://..."
                                  value={link.link}
                                  onChange={(e) =>
                                    updateSocialLink(
                                      index,
                                      "link",
                                      e.target.value
                                    )
                                  }
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeSocialLink(index)}
                                  className="col-span-1"
                                >
                                  ✕
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addSocialLink}
                            >
                              Add Social Link
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 4: Company Details */}
                    {step === 4 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              {...companyForm.register("location")}
                              placeholder="City, Country"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="foundedAt">Founded Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="justify-start w-full font-normal text-left"
                                >
                                  <CalendarIcon className="w-4 h-4 mr-2" />
                                  {companyForm.getValues("foundedAt") ? (
                                    format(
                                      companyForm.getValues(
                                        "foundedAt"
                                      ) as Date,
                                      "PPP"
                                    )
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={
                                    companyForm.getValues("foundedAt") as Date
                                  }
                                  onSelect={(date) =>
                                    companyForm.setValue(
                                      "foundedAt",
                                      date as Date
                                    )
                                  }
                                  initialFocus
                                  disabled={(date) => date > new Date()}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="registrationNumber">
                              Registration Number
                            </Label>
                            <Input
                              id="registrationNumber"
                              {...companyForm.register("registrationNumber")}
                              placeholder="Company registration number"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="description">
                                Company Description
                              </Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-80">
                                      Provide a clear description of what your
                                      company does, its products/services, and
                                      target market.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Textarea
                              id="description"
                              {...companyForm.register("description")}
                              placeholder="Describe what your company does..."
                              className="min-h-[100px]"
                            />
                            {companyForm.formState.errors.description && (
                              <p className="text-sm text-red-500">
                                {
                                  companyForm.formState.errors.description
                                    .message
                                }
                              </p>
                            )}
                            <div className="flex justify-end">
                              <p className="text-xs text-muted-foreground">
                                {companyForm.watch("description")?.length || 0}
                                /1000 characters
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="missionStatement">
                              Mission Statement
                            </Label>
                            <Textarea
                              id="missionStatement"
                              {...companyForm.register("missionStatement")}
                              placeholder="Your company's mission statement..."
                            />
                            {companyForm.formState.errors.missionStatement && (
                              <p className="text-sm text-red-500">
                                {
                                  companyForm.formState.errors.missionStatement
                                    .message
                                }
                              </p>
                            )}
                            <div className="flex justify-end">
                              <p className="text-xs text-muted-foreground">
                                {companyForm.watch("missionStatement")
                                  ?.length || 0}
                                /500 characters
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="employeesRange">
                              Number of Employees
                            </Label>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <Select
                                onValueChange={(value) =>
                                  companyForm.setValue("employeesRange", value)
                                }
                                defaultValue={companyForm.getValues(
                                  "employeesRange"
                                )}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select employee range" />
                                </SelectTrigger>
                                <SelectContent>
                                  {companyRanges.map((range) => (
                                    <SelectItem key={range} value={range}>
                                      {range}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 5: Funding Information */}
                    {step === 5 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="fundingStatus">Types of Fund</Label>
                            <Select
                              onValueChange={(value) =>
                                companyForm.setValue("fundingStatus", value)
                              }
                              defaultValue={companyForm.getValues(
                                "fundingStatus"
                              )}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select funding status" />
                              </SelectTrigger>
                              <SelectContent>
                                {fundingStatus.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                                {!fundingStatus.includes("Series C") && (
                                  <SelectItem value="Series C">
                                    Series C
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="amountRaised">
                              Amount Raised (USD)
                            </Label>
                            <Input
                              id="amountRaised"
                              type="number"
                              {...companyForm.register("amountRaised", {
                                setValueAs: (v) =>
                                  v === "" ? undefined : Number.parseFloat(v),
                              })}
                              placeholder="0"
                            />
                            {companyForm.formState.errors.amountRaised && (
                              <p className="text-sm text-red-500">
                                {
                                  companyForm.formState.errors.amountRaised
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="fundingNeeded">
                              Funding Needed (USD)
                            </Label>
                            <Input
                              id="fundingNeeded"
                              type="number"
                              {...companyForm.register("fundingNeeded", {
                                setValueAs: (v) =>
                                  v === "" ? undefined : Number.parseFloat(v),
                              })}
                              placeholder="0"
                            />
                            {companyForm.formState.errors.fundingNeeded && (
                              <p className="text-sm text-red-500">
                                {
                                  companyForm.formState.errors.fundingNeeded
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="fundingDocuments">
                              Funding Documents (Investment Plan) .pdf
                            </Label>
                            <Input
                              id="fundingDocuments"
                              type="file"
                              className="cursor-pointer"
                              accept=".pdf"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  // In a real app, you'd upload this to storage and save the URL
                                  companyForm.setValue(
                                    "fundingDocuments",
                                    e.target.files[0].name
                                  );
                                }
                              }}
                            />
                            <p className="text-xs text-muted-foreground">
                              PDF files only
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pitchDeck">Pitch Deck</Label>
                            <Input
                              id="pitchDeck"
                              type="file"
                              className="cursor-pointer"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  // In a real app, you'd upload this to storage and save the URL
                                  companyForm.setValue(
                                    "pitchDeck",
                                    e.target.files[0].name
                                  );
                                }
                              }}
                            />
                            <p className="text-xs text-muted-foreground">
                              Upload your company pitch deck (PDF preferred)
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 6: General Business Information */}
                    {step === 6 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="headOfficeAddress">
                              Head Office Address{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="headOfficeAddress"
                              {...companyForm.register("headOfficeAddress")}
                              placeholder="Enter your head office address"
                            />
                            {companyForm.formState.errors.headOfficeAddress && (
                              <p className="text-sm text-red-500">
                                {
                                  companyForm.formState.errors.headOfficeAddress
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="businessModel">
                              What is your business model{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "businessModel",
                                  value as "B2B" | "B2C" | "B2G" | "Other"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "businessModel"
                              )}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="B2B" id="b2b" />
                                <Label htmlFor="b2b">B2B</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="B2C" id="b2c" />
                                <Label htmlFor="b2c">B2C</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="B2G" id="b2g" />
                                <Label htmlFor="b2g">B2G</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Other"
                                  id="other-business-model"
                                />
                                <Label htmlFor="other-business-model">
                                  Other
                                </Label>
                              </div>
                            </RadioGroup>
                            {companyForm.formState.errors.businessModel && (
                              <p className="text-sm text-red-500">
                                {
                                  companyForm.formState.errors.businessModel
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          {selectedBusinessModel === "Other" && (
                            <div className="space-y-2">
                              <Label htmlFor="otherBusinessModel">
                                Specify Business Model{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="otherBusinessModel"
                                {...companyForm.register("otherBusinessModel")}
                                placeholder="Please specify your business model"
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="isYouthLed">
                              Is your business youth-led (under 35)?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "isYouthLed",
                                  value as "Yes" | "No"
                                )
                              }
                              defaultValue={companyForm.getValues("isYouthLed")}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Yes"
                                  id="youth-led-yes"
                                />
                                <Label htmlFor="youth-led-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="youth-led-no" />
                                <Label htmlFor="youth-led-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="isWomanLed">
                              Is your business woman-led?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "isWomanLed",
                                  value as "Yes" | "No"
                                )
                              }
                              defaultValue={companyForm.getValues("isWomanLed")}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Yes"
                                  id="woman-led-yes"
                                />
                                <Label htmlFor="woman-led-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="woman-led-no" />
                                <Label htmlFor="woman-led-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 7: Ownership & Management */}
                    {step === 7 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="founderName">
                              Name of Founder (CEO){" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="founderName"
                              {...companyForm.register("founderName")}
                              placeholder="Enter founder's name"
                            />
                            {companyForm.formState.errors.founderName && (
                              <p className="text-sm text-red-500">
                                {
                                  companyForm.formState.errors.founderName
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="founderGender">
                              Gender of Founder{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "founderGender",
                                  value as
                                    | "Male"
                                    | "Female"
                                    | "Prefer not to say"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "founderGender"
                              )}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Male" id="gender-male" />
                                <Label htmlFor="gender-male">Male</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Female"
                                  id="gender-female"
                                />
                                <Label htmlFor="gender-female">Female</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Prefer not to say"
                                  id="gender-prefer-not-say"
                                />
                                <Label htmlFor="gender-prefer-not-say">
                                  Prefer not to say
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="founderDob">
                              Date of Birth{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="justify-start w-full font-normal text-left"
                                >
                                  <CalendarIcon className="w-4 h-4 mr-2" />
                                  {companyForm.getValues("founderDob") ? (
                                    format(
                                      companyForm.getValues(
                                        "founderDob"
                                      ) as Date,
                                      "PPP"
                                    )
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={
                                    companyForm.getValues("founderDob") as Date
                                  }
                                  onSelect={(date) =>
                                    companyForm.setValue(
                                      "founderDob",
                                      date as Date
                                    )
                                  }
                                  initialFocus
                                  disabled={(date) => date > new Date()}
                                />
                              </PopoverContent>
                            </Popover>
                            {companyForm.formState.errors.founderDob && (
                              <p className="text-sm text-red-500">
                                {
                                  companyForm.formState.errors.founderDob
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="founderEducation">
                              Educational Background of Founder{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "founderEducation",
                                  value as any
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "founderEducation"
                              )}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select education level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Primary">Primary</SelectItem>
                                <SelectItem value="Secondary">
                                  Secondary
                                </SelectItem>
                                <SelectItem value="Tertiary">
                                  Tertiary
                                </SelectItem>
                                <SelectItem value="Technical/vocational">
                                  Technical/vocational
                                </SelectItem>
                                <SelectItem value="University">
                                  University
                                </SelectItem>
                                <SelectItem value="Post Graduate">
                                  Post Graduate
                                </SelectItem>
                                <SelectItem value="Informal">
                                  Informal
                                </SelectItem>
                                <SelectItem value="None">None</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="taxCompliance">
                              Tax and Nassit Compliance{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="nra-registration"
                                  checked={companyForm
                                    .watch("taxCompliance")
                                    ?.includes("NRA registration")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("taxCompliance") || [];
                                    if (checked) {
                                      companyForm.setValue("taxCompliance", [
                                        ...current,
                                        "NRA registration",
                                      ] as any);
                                    } else {
                                      companyForm.setValue(
                                        "taxCompliance",
                                        current.filter(
                                          (item) => item !== "NRA registration"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="nra-registration">
                                  NRA registration
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="nassit-registration"
                                  checked={companyForm
                                    .watch("taxCompliance")
                                    ?.includes("Nassit Registration")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("taxCompliance") || [];
                                    if (checked) {
                                      companyForm.setValue("taxCompliance", [
                                        ...current,
                                        "Nassit Registration",
                                      ] as any);
                                    } else {
                                      companyForm.setValue(
                                        "taxCompliance",
                                        current.filter(
                                          (item) =>
                                            item !== "Nassit Registration"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="nassit-registration">
                                  Nassit Registration
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="none-of-above"
                                  checked={companyForm
                                    .watch("taxCompliance")
                                    ?.includes("None of the above")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("taxCompliance") || [];
                                    if (checked) {
                                      companyForm.setValue("taxCompliance", [
                                        "None of the above",
                                      ] as any);
                                    } else {
                                      companyForm.setValue(
                                        "taxCompliance",
                                        current.filter(
                                          (item) => item !== "None of the above"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="none-of-above">
                                  None of the above
                                </Label>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="sectorLicenses">
                              Do you hold / require sector specific licenses?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "sectorLicenses",
                                  value as
                                    | "Yes, I hold"
                                    | "Yes, but I do not hold"
                                    | "No, I do not require"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "sectorLicenses"
                              )}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Yes, I hold"
                                  id="license-yes-hold"
                                />
                                <Label htmlFor="license-yes-hold">
                                  Yes, I hold
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Yes, but I do not hold"
                                  id="license-yes-not-hold"
                                />
                                <Label htmlFor="license-yes-not-hold">
                                  Yes, but I do not hold
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="No, I do not require"
                                  id="license-no"
                                />
                                <Label htmlFor="license-no">
                                  No, I do not require
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="hasIntellectualProperty">
                              Do you hold any Intellectual Property Rights
                              (Patents, Trademarks)?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "hasIntellectualProperty",
                                  value as "Yes" | "No"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "hasIntellectualProperty"
                              )}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Yes" id="ip-yes" />
                                <Label htmlFor="ip-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="ip-no" />
                                <Label htmlFor="ip-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 8: Financial & Banking */}
                    {step === 8 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="annualTurnoverBefore">
                              Annual Turnover Year Before{" "}
                              <span className="text-red-500">*</span>
                            </Label>

                            <Select
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "annualTurnoverBefore",
                                  value
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "annualTurnoverBefore"
                              )}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select turnover range" />
                              </SelectTrigger>
                              <SelectContent>
                                {turnoverRanges.map((range) => (
                                  <SelectItem key={range} value={range}>
                                    {range}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {companyForm.formState.errors
                              .annualTurnoverBefore && (
                              <p className="text-sm text-red-500">
                                {
                                  companyForm.formState.errors
                                    .annualTurnoverBefore.message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="annualTurnoverCurrent">
                              Annual Turnover (Estimate){" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "annualTurnoverCurrent",
                                  value
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "annualTurnoverCurrent"
                              )}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select turnover range" />
                              </SelectTrigger>
                              <SelectContent>
                                {turnoverRanges.map((range) => (
                                  <SelectItem key={range} value={range}>
                                    {range}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {companyForm.formState.errors
                              .annualTurnoverCurrent && (
                              <p className="text-sm text-red-500">
                                {
                                  companyForm.formState.errors
                                    .annualTurnoverCurrent.message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="annualTurnoverNext">
                              Annual turnover in the next two years (Estimate){" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "annualTurnoverNext",
                                  value
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "annualTurnoverNext"
                              )}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select turnover range" />
                              </SelectTrigger>
                              <SelectContent>
                                {turnoverRanges.map((range) => (
                                  <SelectItem key={range} value={range}>
                                    {range}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {companyForm.formState.errors
                              .annualTurnoverNext && (
                              <p className="text-sm text-red-500">
                                {
                                  companyForm.formState.errors
                                    .annualTurnoverNext.message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="hasBusinessBankAccount">
                              Do you have a business bank account?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "hasBusinessBankAccount",
                                  value as "Yes" | "No"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "hasBusinessBankAccount"
                              )}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Yes"
                                  id="bank-account-yes"
                                />
                                <Label htmlFor="bank-account-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="No"
                                  id="bank-account-no"
                                />
                                <Label htmlFor="bank-account-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="externalFunding">
                              Have you accessed any external funding?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="funding-friends-family"
                                  checked={companyForm
                                    .watch("externalFunding")
                                    ?.includes("Friends/family")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("externalFunding") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue("externalFunding", [
                                        ...current,
                                        "Friends/family",
                                      ] as any);
                                    } else {
                                      companyForm.setValue(
                                        "externalFunding",
                                        current.filter(
                                          (item) => item !== "Friends/family"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="funding-friends-family">
                                  Friends/family
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="funding-angel"
                                  checked={companyForm
                                    .watch("externalFunding")
                                    ?.includes("Angel Investment")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("externalFunding") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue("externalFunding", [
                                        ...current,
                                        "Angel Investment",
                                      ] as any);
                                    } else {
                                      companyForm.setValue(
                                        "externalFunding",
                                        current.filter(
                                          (item) => item !== "Angel Investment"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="funding-angel">
                                  Angel Investment
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="funding-grants"
                                  checked={companyForm
                                    .watch("externalFunding")
                                    ?.includes("Grants")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("externalFunding") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue("externalFunding", [
                                        ...current,
                                        "Grants",
                                      ] as any);
                                    } else {
                                      companyForm.setValue(
                                        "externalFunding",
                                        current.filter(
                                          (item) => item !== "Grants"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="funding-grants">Grants</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="funding-vc"
                                  checked={companyForm
                                    .watch("externalFunding")
                                    ?.includes("Venture Capital")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("externalFunding") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue("externalFunding", [
                                        ...current,
                                        "Venture Capital",
                                      ] as any);
                                    } else {
                                      companyForm.setValue(
                                        "externalFunding",
                                        current.filter(
                                          (item) => item !== "Venture Capital"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="funding-vc">
                                  Venture Capital
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="funding-loans"
                                  checked={companyForm
                                    .watch("externalFunding")
                                    ?.includes("Loans")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("externalFunding") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue("externalFunding", [
                                        ...current,
                                        "Loans",
                                      ] as any);
                                    } else {
                                      companyForm.setValue(
                                        "externalFunding",
                                        current.filter(
                                          (item) => item !== "Loans"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="funding-loans">Loans</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="funding-crowdfunding"
                                  checked={companyForm
                                    .watch("externalFunding")
                                    ?.includes("Crowdfunding")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("externalFunding") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue("externalFunding", [
                                        ...current,
                                        "Crowdfunding",
                                      ] as any);
                                    } else {
                                      companyForm.setValue(
                                        "externalFunding",
                                        current.filter(
                                          (item) => item !== "Crowdfunding"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="funding-crowdfunding">
                                  Crowdfunding
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="funding-none"
                                  checked={companyForm
                                    .watch("externalFunding")
                                    ?.includes("None")}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      companyForm.setValue("externalFunding", [
                                        "None",
                                      ] as any);
                                    } else {
                                      companyForm.setValue(
                                        "externalFunding",
                                        [] as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="funding-none">None</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="funding-other"
                                  checked={companyForm
                                    .watch("externalFunding")
                                    ?.includes("Other")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("externalFunding") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue("externalFunding", [
                                        ...current,
                                        "Other",
                                      ] as any);
                                    } else {
                                      companyForm.setValue(
                                        "externalFunding",
                                        current.filter(
                                          (item) => item !== "Other"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="funding-other">Other</Label>
                              </div>
                            </div>
                          </div>

                          {externalFundingValues?.includes("Other") && (
                            <div className="space-y-2">
                              <Label htmlFor="otherExternalFunding">
                                Specify Other Funding
                              </Label>
                              <Input
                                id="otherExternalFunding"
                                {...companyForm.register(
                                  "otherExternalFunding"
                                )}
                                placeholder="Please specify other funding sources"
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="keepsFinancialRecords">
                              Do you keep financial records?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "keepsFinancialRecords",
                                  value as "Yes" | "No" | "Not Yet"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "keepsFinancialRecords"
                              )}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Yes"
                                  id="financial-records-yes"
                                />
                                <Label htmlFor="financial-records-yes">
                                  Yes
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="No"
                                  id="financial-records-no"
                                />
                                <Label htmlFor="financial-records-no">No</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Not Yet"
                                  id="financial-records-not-yet"
                                />
                                <Label htmlFor="financial-records-not-yet">
                                  Not Yet
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 9: Innovation & Digital Tools */}
                    {step === 9 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="usesDigitalTools">
                              Do you use digital tools in your business?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "usesDigitalTools",
                                  value as "Yes" | "No"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "usesDigitalTools"
                              )}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Yes"
                                  id="digital-tools-yes"
                                />
                                <Label htmlFor="digital-tools-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="No"
                                  id="digital-tools-no"
                                />
                                <Label htmlFor="digital-tools-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {usesDigitalToolsValue === "Yes" && (
                            <div className="space-y-2">
                              <Label htmlFor="digitalTools">
                                If yes, select from the dropdown items?{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="digital-mobile-money"
                                    checked={companyForm
                                      .watch("digitalTools")
                                      ?.includes("Mobile Money")}
                                    onCheckedChange={(checked) => {
                                      const current =
                                        companyForm.watch("digitalTools") || [];
                                      if (checked) {
                                        companyForm.setValue("digitalTools", [
                                          ...current,
                                          "Mobile Money",
                                        ] as any);
                                      } else {
                                        companyForm.setValue(
                                          "digitalTools",
                                          current.filter(
                                            (item) => item !== "Mobile Money"
                                          ) as any
                                        );
                                      }
                                    }}
                                  />
                                  <Label htmlFor="digital-mobile-money">
                                    Mobile Money
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="digital-accounting"
                                    checked={companyForm
                                      .watch("digitalTools")
                                      ?.includes("Accounting Software")}
                                    onCheckedChange={(checked) => {
                                      const current =
                                        companyForm.watch("digitalTools") || [];
                                      if (checked) {
                                        companyForm.setValue("digitalTools", [
                                          ...current,
                                          "Accounting Software",
                                        ] as any);
                                      } else {
                                        companyForm.setValue(
                                          "digitalTools",
                                          current.filter(
                                            (item) =>
                                              item !== "Accounting Software"
                                          ) as any
                                        );
                                      }
                                    }}
                                  />
                                  <Label htmlFor="digital-accounting">
                                    Accounting Software
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="digital-pos"
                                    checked={companyForm
                                      .watch("digitalTools")
                                      ?.includes("POS")}
                                    onCheckedChange={(checked) => {
                                      const current =
                                        companyForm.watch("digitalTools") || [];
                                      if (checked) {
                                        companyForm.setValue("digitalTools", [
                                          ...current,
                                          "POS",
                                        ] as any);
                                      } else {
                                        companyForm.setValue(
                                          "digitalTools",
                                          current.filter(
                                            (item) => item !== "POS"
                                          ) as any
                                        );
                                      }
                                    }}
                                  />
                                  <Label htmlFor="digital-pos">POS</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="digital-ecommerce"
                                    checked={companyForm
                                      .watch("digitalTools")
                                      ?.includes("E-commerce Platforms")}
                                    onCheckedChange={(checked) => {
                                      const current =
                                        companyForm.watch("digitalTools") || [];
                                      if (checked) {
                                        companyForm.setValue("digitalTools", [
                                          ...current,
                                          "E-commerce Platforms",
                                        ] as any);
                                      } else {
                                        companyForm.setValue(
                                          "digitalTools",
                                          current.filter(
                                            (item) =>
                                              item !== "E-commerce Platforms"
                                          ) as any
                                        );
                                      }
                                    }}
                                  />
                                  <Label htmlFor="digital-ecommerce">
                                    E-commerce Platforms
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="digital-social-media"
                                    checked={companyForm
                                      .watch("digitalTools")
                                      ?.includes("Social Media Marketing")}
                                    onCheckedChange={(checked) => {
                                      const current =
                                        companyForm.watch("digitalTools") || [];
                                      if (checked) {
                                        companyForm.setValue("digitalTools", [
                                          ...current,
                                          "Social Media Marketing",
                                        ] as any);
                                      } else {
                                        companyForm.setValue(
                                          "digitalTools",
                                          current.filter(
                                            (item) =>
                                              item !== "Social Media Marketing"
                                          ) as any
                                        );
                                      }
                                    }}
                                  />
                                  <Label htmlFor="digital-social-media">
                                    Social Media Marketing
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="digital-crm"
                                    checked={companyForm
                                      .watch("digitalTools")
                                      ?.includes("CRM / ERP Tools")}
                                    onCheckedChange={(checked) => {
                                      const current =
                                        companyForm.watch("digitalTools") || [];
                                      if (checked) {
                                        companyForm.setValue("digitalTools", [
                                          ...current,
                                          "CRM / ERP Tools",
                                        ] as any);
                                      } else {
                                        companyForm.setValue(
                                          "digitalTools",
                                          current.filter(
                                            (item) => item !== "CRM / ERP Tools"
                                          ) as any
                                        );
                                      }
                                    }}
                                  />
                                  <Label htmlFor="digital-crm">
                                    CRM / ERP Tools
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="digital-other"
                                    checked={companyForm
                                      .watch("digitalTools")
                                      ?.includes("Other")}
                                    onCheckedChange={(checked) => {
                                      const current =
                                        companyForm.watch("digitalTools") || [];
                                      if (checked) {
                                        companyForm.setValue("digitalTools", [
                                          ...current,
                                          "Other",
                                        ] as any);
                                      } else {
                                        companyForm.setValue(
                                          "digitalTools",
                                          current.filter(
                                            (item) => item !== "Other"
                                          ) as any
                                        );
                                      }
                                    }}
                                  />
                                  <Label htmlFor="digital-other">Other</Label>
                                </div>
                              </div>
                            </div>
                          )}

                          {usesDigitalToolsValue === "Yes" &&
                            digitalToolsValues?.includes("Other") && (
                              <div className="space-y-2">
                                <Label htmlFor="otherDigitalTools">
                                  Specify Other Digital Tools
                                </Label>
                                <Input
                                  id="otherDigitalTools"
                                  {...companyForm.register("otherDigitalTools")}
                                  placeholder="Please specify other digital tools"
                                />
                              </div>
                            )}

                          <div className="space-y-2">
                            <Label htmlFor="isInnovative">
                              Do you consider your business innovative?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "isInnovative",
                                  value as "Yes" | "No"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "isInnovative"
                              )}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Yes"
                                  id="innovative-yes"
                                />
                                <Label htmlFor="innovative-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="innovative-no" />
                                <Label htmlFor="innovative-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {isInnovativeValue === "Yes" && (
                            <div className="space-y-2">
                              <Label htmlFor="innovationExplanation">
                                Explain how your business is innovative{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="innovationExplanation"
                                {...companyForm.register(
                                  "innovationExplanation"
                                )}
                                placeholder="Describe what makes your business innovative"
                                className="min-h-[100px]"
                              />
                              {companyForm.formState.errors
                                .innovationExplanation && (
                                <p className="text-sm text-red-500">
                                  {
                                    companyForm.formState.errors
                                      .innovationExplanation.message
                                  }
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Step 10: Challenges & Growth */}
                    {step === 10 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="businessChallenges">
                              CHALLENGES FACED BY YOUR BUSINESS{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="challenge-finance"
                                  checked={companyForm
                                    .watch("businessChallenges")
                                    ?.includes("Access to Finance")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("businessChallenges") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        [...current, "Access to Finance"] as any
                                      );
                                    } else {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        current.filter(
                                          (item) => item !== "Access to Finance"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="challenge-finance">
                                  Access to Finance
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="challenge-market"
                                  checked={companyForm
                                    .watch("businessChallenges")
                                    ?.includes("Market Access")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("businessChallenges") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        [...current, "Market Access"] as any
                                      );
                                    } else {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        current.filter(
                                          (item) => item !== "Market Access"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="challenge-market">
                                  Market Access
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="challenge-labor"
                                  checked={companyForm
                                    .watch("businessChallenges")
                                    ?.includes("Skilled Labour")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("businessChallenges") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        [...current, "Skilled Labour"] as any
                                      );
                                    } else {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        current.filter(
                                          (item) => item !== "Skilled Labour"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="challenge-labor">
                                  Skilled Labour
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="challenge-materials"
                                  checked={companyForm
                                    .watch("businessChallenges")
                                    ?.includes("Raw Materials")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("businessChallenges") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        [...current, "Raw Materials"] as any
                                      );
                                    } else {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        current.filter(
                                          (item) => item !== "Raw Materials"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="challenge-materials">
                                  Raw Materials
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="challenge-infrastructure"
                                  checked={companyForm
                                    .watch("businessChallenges")
                                    ?.includes("Infrastructure")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("businessChallenges") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        [...current, "Infrastructure"] as any
                                      );
                                    } else {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        current.filter(
                                          (item) => item !== "Infrastructure"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="challenge-infrastructure">
                                  Infrastructure
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="challenge-regulation"
                                  checked={companyForm
                                    .watch("businessChallenges")
                                    ?.includes("Regulation / Compliance")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("businessChallenges") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        [
                                          ...current,
                                          "Regulation / Compliance",
                                        ] as any
                                      );
                                    } else {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        current.filter(
                                          (item) =>
                                            item !== "Regulation / Compliance"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="challenge-regulation">
                                  Regulation / Compliance
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="challenge-digital"
                                  checked={companyForm
                                    .watch("businessChallenges")
                                    ?.includes("Digital Skills")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("businessChallenges") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        [...current, "Digital Skills"] as any
                                      );
                                    } else {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        current.filter(
                                          (item) => item !== "Digital Skills"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="challenge-digital">
                                  Digital Skills
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="challenge-other"
                                  checked={companyForm
                                    .watch("businessChallenges")
                                    ?.includes("Other")}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      companyForm.watch("businessChallenges") ||
                                      [];
                                    if (checked) {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        [...current, "Other"] as any
                                      );
                                    } else {
                                      companyForm.setValue(
                                        "businessChallenges",
                                        current.filter(
                                          (item) => item !== "Other"
                                        ) as any
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor="challenge-other">Other</Label>
                              </div>
                            </div>
                          </div>

                          {businessChallengesValues?.includes("Other") && (
                            <div className="space-y-2">
                              <Label htmlFor="otherBusinessChallenges">
                                Specify Other Challenges
                              </Label>
                              <Input
                                id="otherBusinessChallenges"
                                {...companyForm.register(
                                  "otherBusinessChallenges"
                                )}
                                placeholder="Please specify other challenges"
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="supportNeeded">
                              What support does your business need?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="supportNeeded"
                              {...companyForm.register("supportNeeded")}
                              placeholder="Describe the support your business needs"
                              className="min-h-[100px]"
                            />
                            {companyForm.formState.errors.supportNeeded && (
                              <p className="text-sm text-red-500">
                                {
                                  companyForm.formState.errors.supportNeeded
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="planningExpansion">
                              Do you plan to expand in the next 12 months?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "planningExpansion",
                                  value as "Yes" | "No"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "planningExpansion"
                              )}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Yes"
                                  id="expansion-yes"
                                />
                                <Label htmlFor="expansion-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="expansion-no" />
                                <Label htmlFor="expansion-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {planningExpansionValue === "Yes" && (
                            <div className="space-y-2">
                              <Label htmlFor="expansionPlans">
                                If yes, how do you plan to grow?{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="expansionPlans"
                                {...companyForm.register("expansionPlans")}
                                placeholder="Describe your expansion plans"
                                className="min-h-[100px]"
                              />
                              {companyForm.formState.errors.expansionPlans && (
                                <p className="text-sm text-red-500">
                                  {
                                    companyForm.formState.errors.expansionPlans
                                      .message
                                  }
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Step 11: Social & Environmental Impact */}
                    {step === 11 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="employsVulnerableGroups">
                              Do you create employment for vulnerable groups
                              (youth, women, PWD)?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "employsVulnerableGroups",
                                  value as "Yes" | "No"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "employsVulnerableGroups"
                              )}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Yes"
                                  id="vulnerable-yes"
                                />
                                <Label htmlFor="vulnerable-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="vulnerable-no" />
                                <Label htmlFor="vulnerable-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="addressesEnvironmentalSustainability">
                              Do you actively address environmental
                              sustainability?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "addressesEnvironmentalSustainability",
                                  value as "Yes" | "No"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "addressesEnvironmentalSustainability"
                              )}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Yes"
                                  id="environmental-yes"
                                />
                                <Label htmlFor="environmental-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="No"
                                  id="environmental-no"
                                />
                                <Label htmlFor="environmental-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="impactInitiatives">
                              Please describe any impact initiatives{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="impactInitiatives"
                              {...companyForm.register("impactInitiatives")}
                              placeholder="Describe your social or environmental impact initiatives"
                              className="min-h-[100px]"
                            />
                            {companyForm.formState.errors.impactInitiatives && (
                              <p className="text-sm text-red-500">
                                {
                                  companyForm.formState.errors.impactInitiatives
                                    .message
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 12: Consent & Follow Up */}
                    {step === 12 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="joinEcosystemPrograms">
                              Would you like to be part of Innovation SL's
                              ecosystem support programs?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "joinEcosystemPrograms",
                                  value as "Yes" | "No"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "joinEcosystemPrograms"
                              )}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Yes"
                                  id="ecosystem-yes"
                                />
                                <Label htmlFor="ecosystem-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="ecosystem-no" />
                                <Label htmlFor="ecosystem-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="consentToDataUsage">
                              Do you give us consent for storing and analyzing
                              your data for ecosystem development purposes?{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                              onValueChange={(value) =>
                                companyForm.setValue(
                                  "consentToDataUsage",
                                  value as "Yes" | "No"
                                )
                              }
                              defaultValue={companyForm.getValues(
                                "consentToDataUsage"
                              )}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Yes" id="consent-yes" />
                                <Label htmlFor="consent-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="consent-no" />
                                <Label htmlFor="consent-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="additionalComments">
                              Any other comments or suggestions?
                            </Label>
                            <Textarea
                              id="additionalComments"
                              {...companyForm.register("additionalComments")}
                              placeholder="Share any additional comments or suggestions"
                              className="min-h-[100px]"
                            />
                          </div>

                          <Alert className="bg-muted/50">
                            <Info className="w-4 h-4" />
                            <AlertDescription>
                              By submitting this form, you confirm that all
                              information provided is accurate to the best of
                              your knowledge. This information will be used to
                              better support your business and the wider
                              entrepreneurial ecosystem.
                            </AlertDescription>
                          </Alert>
                        </div>
                      </>
                    )}
                  </form>
                )}

                {/* Investor Form Steps - keeping this for reference */}
                {entityType === "investor" && (
                  <form
                    onSubmit={investorForm.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Step 1: Basic Information */}
                    {step === 1 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">
                              Investor Name{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="name"
                              {...investorForm.register("name")}
                              placeholder="Enter your investment firm name"
                            />
                            {investorForm.formState.errors.name && (
                              <p className="text-sm text-red-500">
                                {investorForm.formState.errors.name.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="type">Investor Type</Label>
                            <Select
                              onValueChange={(value) =>
                                investorForm.setValue("type", value)
                              }
                              defaultValue={investorForm.getValues("type")}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select your investor type" />
                              </SelectTrigger>
                              <SelectContent>
                                {investorTypes.map((type: any) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>
                              Sectors Interested{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                              {sectorsData.map((sector) => (
                                <div
                                  key={sector.title}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`sector-${sector}`}
                                    checked={selectedSectors.includes(
                                      sector.title
                                    )}
                                    onCheckedChange={() =>
                                      toggleSector(sector.title)
                                    }
                                  />
                                  <Label
                                    htmlFor={`sector-${sector}`}
                                    className="font-normal capitalize"
                                  >
                                    {sector.title.replace("_", " ")}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            {investorForm.formState.errors.sectorInterested && (
                              <p className="text-sm text-red-500">
                                Please select at least one sector
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 2: Contact Information */}
                    {step === 2 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              {...investorForm.register("email")}
                              placeholder="investor@example.com"
                            />
                            {investorForm.formState.errors.email && (
                              <p className="text-sm text-red-500">
                                {investorForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              {...investorForm.register("phone")}
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                              id="address"
                              {...investorForm.register("address")}
                              placeholder="123 Investment St, City, Country"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              {...investorForm.register("website")}
                              placeholder="https://yourinvestmentfirm.com"
                            />
                            {investorForm.formState.errors.website && (
                              <p className="text-sm text-red-500">
                                {investorForm.formState.errors.website.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Social Links</Label>
                            {socialLinks.map((link, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-5 gap-2"
                              >
                                <Select
                                  onValueChange={(value) =>
                                    updateSocialLink(index, "name", value)
                                  }
                                  value={link.name}
                                >
                                  <SelectTrigger className="col-span-2">
                                    <SelectValue placeholder="Platform" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="linkedin">
                                      LinkedIn
                                    </SelectItem>
                                    <SelectItem value="x">X</SelectItem>
                                    <SelectItem value="facebook">
                                      Facebook
                                    </SelectItem>
                                    <SelectItem value="instagram">
                                      Instagram
                                    </SelectItem>
                                    <SelectItem value="youtube">
                                      YouTube
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  className="col-span-3"
                                  placeholder="https://..."
                                  value={link.link}
                                  onChange={(e) =>
                                    updateSocialLink(
                                      index,
                                      "link",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addSocialLink}
                            >
                              Add Another Social Link
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 3: Investment Details */}
                    {step === 3 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              {...investorForm.register("location")}
                              placeholder="City, Country"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="foundedAt">Founded Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="justify-start w-full font-normal text-left"
                                >
                                  <CalendarIcon className="w-4 h-4 mr-2" />
                                  {investorForm.getValues("foundedAt") ? (
                                    format(
                                      investorForm.getValues(
                                        "foundedAt"
                                      ) as Date,
                                      "PPP"
                                    )
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={
                                    investorForm.getValues("foundedAt") as Date
                                  }
                                  onSelect={(date) =>
                                    investorForm.setValue(
                                      "foundedAt",
                                      date as Date
                                    )
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">
                              Investor Description
                            </Label>
                            <Textarea
                              id="description"
                              {...investorForm.register("description")}
                              placeholder="Describe your investment philosophy and focus..."
                              className="min-h-[100px]"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="fundingCapacity">
                              Tickect Size
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                investorForm.setValue("fundingCapacity", value)
                              }
                              defaultValue={investorForm.getValues(
                                "fundingCapacity"
                              )}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select funding capacity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="under_100k">
                                  Under $100K
                                </SelectItem>
                                <SelectItem value="100k_500k">
                                  $100K - $500K
                                </SelectItem>
                                <SelectItem value="500k_1m">
                                  $500K - $1M
                                </SelectItem>
                                <SelectItem value="1m_5m">$1M - $5M</SelectItem>
                                <SelectItem value="5m_10m">
                                  $5M - $10M
                                </SelectItem>
                                <SelectItem value="10m_plus">$10M+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="stage">
                              Investment Stage Preference
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                investorForm.setValue("stage", value)
                              }
                              defaultValue={investorForm.getValues("stage")}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select preferred investment stage" />
                              </SelectTrigger>
                              <SelectContent>
                                {fundingStatus.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                                {!fundingStatus.includes("Series C") && (
                                  <SelectItem value="Series C">
                                    Series C
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 4: Documents & Additional Info */}
                    {step === 4 && (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="amountRaised">
                              Assets Under Management (USD)
                            </Label>
                            <Input
                              id="amountRaised"
                              type="number"
                              {...investorForm.register("amountRaised", {
                                setValueAs: (v) =>
                                  v === "" ? undefined : Number.parseFloat(v),
                              })}
                              placeholder="0"
                            />
                          </div>

                          {/* <div className="space-y-2">
                            <Label htmlFor="businessRegistrationDocuments">
                              Business Registration Documents
                            </Label>
                            <Input
                              id="businessRegistrationDocuments"
                              type="file"
                              className="cursor-pointer"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  // In a real app, you'd upload this to storage and save the URL
                                  investorForm.setValue(
                                    "businessRegistrationDocuments",
                                    e.target.files[0].name
                                  );
                                }
                              }}
                            />
                            <p className="text-xs text-muted-foreground">
                              Upload business registration documents
                            </p>
                          </div> */}

                          <div className="space-y-2">
                            <Label htmlFor="investmentBroucher">
                              Investment Broucher .pdf
                            </Label>
                            <Input
                              id="investmentBroucher"
                              type="file"
                              className="cursor-pointer"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  // In a real app, you'd upload this to storage and save the URL
                                  investorForm.setValue(
                                    "investmentBroucher",
                                    e.target.files[0].name
                                  );
                                }
                              }}
                            />
                            <p className="text-xs text-muted-foreground">
                              Upload investment profile or portfolio documents
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="goalExpected">
                              Investment Goals
                            </Label>
                            <Textarea
                              id="goalExpected"
                              {...investorForm.register("goalExpected")}
                              placeholder="Describe your investment goals and expectations..."
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </form>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
                <div className="flex flex-col justify-between w-full gap-4 sm:flex-row">
                  <div className="flex items-center">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ChevronLeftIcon className="w-4 h-4 mr-2" />
                      {step === 1 ? "Back to Selection" : "Previous"}
                    </Button>

                    {/* {lastSaved && !isSaving && (
                      <p className="ml-4 text-xs text-muted-foreground">
                        Last saved: {lastSaved.toLocaleTimeString()}
                      </p>
                    )} */}
                    {/* {isSaving && (
                      <p className="ml-4 text-xs text-muted-foreground animate-pulse">
                        Saving...
                      </p>
                    )} */}
                  </div>

                  <div className="flex gap-2">
                    {step > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={saveProgress}
                      >
                        {isSaving ? " Saving Progress" : " Save Progress"}
                      </Button>
                    )}

                    {step < (entityType === "company" ? totalSteps : 4) ? (
                      <Button type="button" onClick={nextStep}>
                        Next
                        <ChevronRightIcon className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={isLoading}
                        onClick={
                          entityType === "company"
                            ? companyForm.handleSubmit(onSubmit)
                            : investorForm.handleSubmit(onSubmit)
                        }
                      >
                        {isLoading ? "Saving..." : "Complete Profile"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
