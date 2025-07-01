"use server";

import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";

import Company from "@/models/Company";
import { connect } from "@/lib/mongoDB";
// import mongoose from "mongoose";

interface CompanyType {
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
  isYouthLed?: boolean | string;
  isWomanLed?: boolean | string;
  founderName?: string;
  founderGender?: string;
  founderDob?: string;
  founderEducation?: string;
  taxCompliance?: string[];
  sectorLicenses?: string;
  hasIntellectualProperty?: boolean | string;
  annualTurnoverBefore?: string;
  annualTurnoverCurrent?: string;
  annualTurnoverNext?: string;
  hasBusinessBankAccount?: boolean | string;
  externalFunding?: string[];
  otherExternalFunding?: string;
  keepsFinancialRecords?: string;
  usesDigitalTools?: boolean | string;
  digitalTools?: string[];
  otherDigitalTools?: string;
  isInnovative?: boolean | string;
  innovationExplanation?: string;
  businessChallenges?: string[];
  otherBusinessChallenges?: string;
  supportNeeded?: string;
  planningExpansion?: boolean | string;
  expansionPlans?: string;
  employsVulnerableGroups?: boolean | string;
  addressesEnvironmentalSustainability?: boolean | string;
  impactInitiatives?: string;
  joinEcosystemPrograms?: boolean | string;
  consentToDataUsage?: boolean | string;
  additionalComments?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getCompanies = async () => {
  try {
    await connect();
    const companies = await Company.find();
    return companies;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw new Error("Failed to fetch companies!");
  }
};

export const getCompany = async (id: string) => {
  try {
    await connect();
    const company = await Company.findById(id);
    return JSON.parse(JSON.stringify(company));
  } catch (error) {
    console.error("Error fetching company:", error);
    throw new Error("Failed to fetch company!");
  }
};

export async function loadCompanyProgress(userId: string) {
  try {
    await connect();
    const data = await OnboardingProgress.findOne({ userId });
    if (!data) return null;

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error loading or creating company progress:", error);
    return null;
  }
}
export async function saveCompanyProgress(userId: string, formData: any) {
  try {
    await connect();

    const existing = await OnboardingProgress.findOne({ userId });

    if (existing) {
      // Update existing progress
      existing.entityType = formData.entityType;
      existing.step = formData.step;
      existing.selectedSectors = formData.selectedSectors;
      existing.socialLinks = formData.socialLinks;
      existing.companyData = formData.companyData;
      existing.investorData = formData.investorData;

      await existing.save();
    } else {
      // Create new progress document
      await OnboardingProgress.create(formData);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error saving company progress:", error);
    return { success: false, message: error.message };
  }
}

// Add a new company
export async function createCompany(data: any) {
  try {
    await connect();
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "No Logged In User" };
    }

    // Convert Yes/No string values to boolean values
    const processedData = {
      ...data,
      userId: userId, // Use the userId from Clerk directly
      isYouthLed: data.isYouthLed === "Yes" || data.isYouthLed === true,
      isWomanLed: data.isWomanLed === "Yes" || data.isWomanLed === true,
      usesDigitalTools:
        data.usesDigitalTools === "Yes" || data.usesDigitalTools === true,
      isInnovative: data.isInnovative === "Yes" || data.isInnovative === true,
      employsVulnerableGroups:
        data.employsVulnerableGroups === "Yes" ||
        data.employsVulnerableGroups === true,
      addressesEnvironmentalSustainability:
        data.addressesEnvironmentalSustainability === "Yes" ||
        data.addressesEnvironmentalSustainability === true,
      joinEcosystemPrograms:
        data.joinEcosystemPrograms === "Yes" ||
        data.joinEcosystemPrograms === true,
      hasIntellectualProperty:
        data.hasIntellectualProperty === "Yes" ||
        data.hasIntellectualProperty === true,
      hasBusinessBankAccount:
        data.hasBusinessBankAccount === "Yes" ||
        data.hasBusinessBankAccount === true,
      planningExpansion:
        data.planningExpansion === "Yes" || data.planningExpansion === true,
      consentToDataUsage:
        data.consentToDataUsage === "Yes" || data.consentToDataUsage === true,
    };

    const newCompany = await new Company(processedData);
    const company = await newCompany.save();

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingCompleted: true,
        companyId: company._id,
        companyName: company.name,
        role: "company",
      },
    });

    const investors = await Investor.find({
      sectorInterested: { $in: [company.sector] },
    });

    await Promise.all(
      investors.map((investor) =>
        sendNotification({
          title: `New company registered in ${company.sector} sector`,
          desc: `${company.name} has registered in the ${company.sector} sector.`,
          from: company.userId,
          to: investor.userId,
          url: `/companies/${company._id}`,
        })
      )
    );

    // const recipientIds = investors
    //   .map((inv) => inv.userId)
    //   .filter(Boolean);

    // if (recipientIds.length > 0) {
    //   await sendNotification({
    //     title: `New company registered in ${company.sector} sector`,
    //     desc: `${company.name} has registered in the ${company.sector} sector.`,
    //     from: company.userId,
    //     to: recipientIds,
    //     url: `/companies/${company._id}`,
    //   });
    // }

    return JSON.parse(JSON.stringify({ success: true, company: company }));
  } catch (error) {
    console.error("Error creating company:", error);
    return { success: false, error: "Failed to create company" };
  }
}

// Helper function for updating a company
async function updateCompanyHelper(id: string, data: Partial<CompanyType>) {
  await connect();

  // Convert Yes/No string values to boolean if they exist in the update data
  const processedData = { ...data };

  if (data.isYouthLed !== undefined)
    processedData.isYouthLed =
      data.isYouthLed === "Yes" || data.isYouthLed === true;
  if (data.isWomanLed !== undefined)
    processedData.isWomanLed =
      data.isWomanLed === "Yes" || data.isWomanLed === true;
  if (data.usesDigitalTools !== undefined)
    processedData.usesDigitalTools =
      data.usesDigitalTools === "Yes" || data.usesDigitalTools === true;
  if (data.isInnovative !== undefined)
    processedData.isInnovative =
      data.isInnovative === "Yes" || data.isInnovative === true;
  if (data.employsVulnerableGroups !== undefined)
    processedData.employsVulnerableGroups =
      data.employsVulnerableGroups === "Yes" ||
      data.employsVulnerableGroups === true;
  if (data.addressesEnvironmentalSustainability !== undefined)
    processedData.addressesEnvironmentalSustainability =
      data.addressesEnvironmentalSustainability === "Yes" ||
      data.addressesEnvironmentalSustainability === true;
  if (data.joinEcosystemPrograms !== undefined)
    processedData.joinEcosystemPrograms =
      data.joinEcosystemPrograms === "Yes" ||
      data.joinEcosystemPrograms === true;
  if (data.hasIntellectualProperty !== undefined)
    processedData.hasIntellectualProperty =
      data.hasIntellectualProperty === "Yes" ||
      data.hasIntellectualProperty === true;
  if (data.hasBusinessBankAccount !== undefined)
    processedData.hasBusinessBankAccount =
      data.hasBusinessBankAccount === "Yes" ||
      data.hasBusinessBankAccount === true;
  if (data.planningExpansion !== undefined)
    processedData.planningExpansion =
      data.planningExpansion === "Yes" || data.planningExpansion === true;
  if (data.consentToDataUsage !== undefined)
    processedData.consentToDataUsage =
      data.consentToDataUsage === "Yes" || data.consentToDataUsage === true;

  return await Company.findByIdAndUpdate(id, processedData, { new: true });
}

// Update an existing company
export async function updateCompanyAction(
  id: string,
  data: Partial<CompanyType>
) {
  try {
    // Update the company
    const company = await updateCompanyHelper(id, data);

    if (!company) {
      return { success: false, error: "Company not found" };
    }

    // Revalidate the company detail and list pages
    revalidatePath(`/companies/${id}`);
    revalidatePath("/companies");

    return { success: true, company };
  } catch (error) {
    console.error("Error updating company:", error);
    return { success: false, error: "Failed to update company" };
  }
}

// Get all companies with filters
export async function getCompaniesAction(filters?: {
  userId?: string;
  sector?: string;
  stage?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await connect();
    const result = await Company.find().sort({ createdAt: -1 });
    const companies = JSON.parse(JSON.stringify(result));

    return { success: true, companies: companies };
  } catch (error) {
    console.error("Error fetching companies:", error);
    return {
      success: false,
      error: "Failed to fetch companies",
      data: [],
      total: 0,
      page: 1,
      totalPages: 0,
    };
  }
}

import mongoose from "mongoose";
import { stringify } from "querystring";
import OnboardingProgress from "@/models/onboarding";
import { sendNotification } from "./notification";
import Investor from "@/models/Investor";
// Removed duplicate import of Company

export async function getCompanyByIdAction(id: string) {
  try {
    await connect();

    // Validate the MongoDB ObjectId
    if (!id) {
      throw new Error("Invalid company ID");
    }

    const company = await Company.findById(id);

    if (!company) {
      throw new Error("Company not found");
    }

    return JSON.parse(JSON.stringify(company));
  } catch (error: any) {
    console.error("Error in getCompanyByIdAction:", error.message);
  }
}

// Helper function for deleting a company
async function deleteCompanyHelper(id: string) {
  await connect();
  return await Company.findByIdAndDelete(id);
}

// Delete a company - server action implementation
export async function deleteCompanyAction(id: string) {
  try {
    // In a real app, you would verify the user has permission to delete this company
    await connect();
    const deleted = await Company.findByIdAndDelete(id);

    if (!deleted) {
      return {
        success: false,
        error: "Company not found or could not be deleted",
      };
    }

    // Revalidate the companies list page
    revalidatePath("/companies");

    return { success: true };
  } catch (error) {
    console.error("Error deleting company:", error);
    return { success: false, error: "Failed to delete company" };
  }
}

// Main updateCompany function that's exported and used by the UI
export async function updateCompany(
  data: any,
  id: string,
  formData?: FormData
) {
  try {
    await connect();

    // Process boolean values
    const updateData = {
      ...data,
      isYouthLed: data.isYouthLed === "Yes" || data.isYouthLed === true,
      isWomanLed: data.isWomanLed === "Yes" || data.isWomanLed === true,
      usesDigitalTools:
        data.usesDigitalTools === "Yes" || data.usesDigitalTools === true,
      isInnovative: data.isInnovative === "Yes" || data.isInnovative === true,
      employsVulnerableGroups:
        data.employsVulnerableGroups === "Yes" ||
        data.employsVulnerableGroups === true,
      addressesEnvironmentalSustainability:
        data.addressesEnvironmentalSustainability === "Yes" ||
        data.addressesEnvironmentalSustainability === true,
      joinEcosystemPrograms:
        data.joinEcosystemPrograms === "Yes" ||
        data.joinEcosystemPrograms === true,
      hasIntellectualProperty:
        data.hasIntellectualProperty === "Yes" ||
        data.hasIntellectualProperty === true,
      hasBusinessBankAccount:
        data.hasBusinessBankAccount === "Yes" ||
        data.hasBusinessBankAccount === true,
      planningExpansion:
        data.planningExpansion === "Yes" || data.planningExpansion === true,
      consentToDataUsage:
        data.consentToDataUsage === "Yes" || data.consentToDataUsage === true,
    };

    // Handle file uploads if formData is provided
    if (formData) {
      // Process file uploads here
      // This would typically involve storing the files and updating the data with file URLs
      const logoFile = formData.get("logo") as File;
      const fundingDocFile = formData.get("fundingDocuments") as File;
      const pitchDeckFile = formData.get("pitchDeck") as File;

      // Here you would upload these files to your storage and get URLs
      // For now, we'll just log that we received them
      if (logoFile) {
        console.log("Logo file received:", logoFile.name);
        // updateData.logo = await uploadFile(logoFile); // You would implement uploadFile
      }

      if (fundingDocFile) {
        console.log("Funding doc received:", fundingDocFile.name);
        // updateData.fundingDocuments = await uploadFile(fundingDocFile);
      }

      if (pitchDeckFile) {
        console.log("Pitch deck received:", pitchDeckFile.name);
        // updateData.pitchDeck = await uploadFile(pitchDeckFile);
      }
    }

    const result = await Company.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!result) {
      return { success: false, message: "Company not found or update failed" };
    }

    // Revalidate paths
    revalidatePath(`/companies/${id}`);
    revalidatePath("/companies");

    return { success: true };
  } catch (error) {
    console.error("Error updating company:", error);
    return { success: false, message: "Failed to update company!" };
  }
}

// Delete company function that's exported and used by the UI
export async function deleteCompany(id: string) {
  try {
    await connect();
    const deleted = await Company.findByIdAndDelete(id);

    if (!deleted) {
      return { success: false, error: "Company not found" };
    }
    revalidatePath("/companies");
    console.log("Deete");
    console.log(deleted);
    return { success: true };
  } catch (error) {
    console.error("Error deleting company:", error);
    return { success: false, error: "Failed to delete company!" };
  }
}
