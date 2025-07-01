import { cache } from "react";
import { v4 as uuidv4 } from "uuid";

// Type definitions
export type Company = {
  id: string;
  userId: string;
  name: string;
  sector: string;
  location?: string;
  foundedAt?: string;
  logo?: string;
  registrationNumber?: string;
  type?: string;
  email?: string;
  phone?: string;
  address?: string;
  socialLinks?: { name: string; link: string }[];
  website?: string;
  stage?: string;
  description?: string;
  missionStatement?: string;
  fundingStatus?: string;
  amountRaised?: number;
  foundingDocuments?: string;
  pitchDeck?: string;
  fundingNeeded?: number;
  employeesRange?: string;
  createdAt: string;
  updatedAt: string;
};

export type Investor = {
  id: string;
  userId: string;
  name: string;
  sectorInterested: string[];
  location?: string;
  foundedAt?: string;
  logo?: string;
  registrationNumber?: string;
  type?: string;
  email?: string;
  phone?: string;
  address?: string;
  socialLinks?: { name: string; link: string }[];
  website?: string;
  stage?: string;
  description?: string;
  profileDocuments?: string;
  fundingCapacity?: string;
  amountRaised?: number;
  businessRegistrationDocuments?: string;
  goalExpected?: string;
  createdAt: string;
  updatedAt: string;
};

// Simulated database collections
let companies: Company[] = [];
let investors: Investor[] = [];

// Helper function to get current timestamp
const getCurrentTimestamp = () => new Date().toISOString();

// Company CRUD operations
export async function addCompany(
  data: Omit<Company, "id" | "createdAt" | "updatedAt">
): Promise<Company> {
  const timestamp = getCurrentTimestamp();
  const newCompany: Company = {
    id: uuidv4(),
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  companies.push(newCompany);
  return newCompany;
}

export async function updateCompany(
  id: string,
  data: Partial<Company>
): Promise<Company | null> {
  const index = companies.findIndex((company) => company.id === id);
  if (index === -1) return null;

  companies[index] = {
    ...companies[index],
    ...data,
    updatedAt: getCurrentTimestamp(),
  };

  return companies[index];
}

export async function getAllCompanies(filters?: {
  userId?: string;
  sector?: string;
  stage?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: Company[];
  total: number;
  page: number;
  totalPages: number;
}> {
  let filteredCompanies = [...companies];

  // Apply filters
  if (filters) {
    if (filters.userId) {
      filteredCompanies = filteredCompanies.filter(
        (company) => company.userId === filters.userId
      );
    }

    if (filters.sector) {
      filteredCompanies = filteredCompanies.filter(
        (company) => company.sector === filters.sector
      );
    }

    if (filters.stage) {
      filteredCompanies = filteredCompanies.filter(
        (company) => company.stage === filters.stage
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCompanies = filteredCompanies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchLower) ||
          company.description?.toLowerCase().includes(searchLower)
      );
    }
  }

  // Calculate pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const total = filteredCompanies.length;
  const totalPages = Math.ceil(total / limit);

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  return {
    data: paginatedCompanies,
    total,
    page,
    totalPages,
  };
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const company = companies.find((company) => company.id === id);
  return company || null;
}

export async function deleteCompany(id: string): Promise<boolean> {
  const initialLength = companies.length;
  companies = companies.filter((company) => company.id !== id);
  return companies.length < initialLength;
}

// Investor CRUD operations
export async function addInvestor(
  data: Omit<Investor, "id" | "createdAt" | "updatedAt">
): Promise<Investor> {
  const timestamp = getCurrentTimestamp();
  const newInvestor: Investor = {
    id: uuidv4(),
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  investors.push(newInvestor);
  return newInvestor;
}

export async function updateInvestor(
  id: string,
  data: Partial<Investor>
): Promise<Investor | null> {
  const index = investors.findIndex((investor) => investor.id === id);
  if (index === -1) return null;

  investors[index] = {
    ...investors[index],
    ...data,
    updatedAt: getCurrentTimestamp(),
  };

  return investors[index];
}

export async function getAllInvestors(filters?: {
  userId?: string;
  sectorInterested?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: Investor[];
  total: number;
  page: number;
  totalPages: number;
}> {
  let filteredInvestors = [...investors];

  // Apply filters
  if (filters) {
    if (filters.userId) {
      filteredInvestors = filteredInvestors.filter(
        (investor) => investor.userId === filters.userId
      );
    }

    if (filters.sectorInterested) {
      filteredInvestors = filteredInvestors.filter((investor) =>
        investor.sectorInterested.includes(filters.sectorInterested!)
      );
    }

    if (filters.type) {
      filteredInvestors = filteredInvestors.filter(
        (investor) => investor.type === filters.type
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredInvestors = filteredInvestors.filter(
        (investor) =>
          investor.name.toLowerCase().includes(searchLower) ||
          investor.description?.toLowerCase().includes(searchLower)
      );
    }
  }

  // Calculate pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const total = filteredInvestors.length;
  const totalPages = Math.ceil(total / limit);

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedInvestors = filteredInvestors.slice(startIndex, endIndex);

  return {
    data: paginatedInvestors,
    total,
    page,
    totalPages,
  };
}

export async function getInvestorById(id: string): Promise<Investor | null> {
  const investor = investors.find((investor) => investor.id === id);
  return investor || null;
}

export async function deleteInvestor(id: string): Promise<boolean> {
  const initialLength = investors.length;
  investors = investors.filter((investor) => investor.id !== id);
  return investors.length < initialLength;
}

// Add this function before the cached functions at the end of the file

export async function getFilterOptions(): Promise<{
  sectors: string[];
  locations: string[];
  stages: string[];
  investorTypes: string[];
  fundingRange: { min: number; max: number };
}> {
  // Get unique sectors from all investors
  const sectors = Array.from(
    new Set(investors.flatMap((investor) => investor.sectorInterested || []))
  );

  // Get unique locations
  const locations = Array.from(
    new Set(
      investors.map((investor) => investor.location).filter(Boolean) as string[]
    )
  );

  // Get unique stages
  const stages = Array.from(
    new Set(
      investors.map((investor) => investor.stage).filter(Boolean) as string[]
    )
  );

  // Get unique investor types
  const investorTypes = Array.from(
    new Set(
      investors.map((investor) => investor.type).filter(Boolean) as string[]
    )
  );

  // Calculate funding range
  const amountRaisedValues = investors
    .map((investor) => investor.amountRaised)
    .filter((amount): amount is number => amount !== undefined);

  const fundingRange = {
    min: amountRaisedValues.length > 0 ? Math.min(...amountRaisedValues) : 0,
    max:
      amountRaisedValues.length > 0 ? Math.max(...amountRaisedValues) : 1000000,
  };

  return {
    sectors,
    locations,
    stages,
    investorTypes,
    fundingRange,
  };
}

// Cache the data fetching functions for better performance
export const getCachedCompanyById = cache(getCompanyById);
export const getCachedAllCompanies = cache(getAllCompanies);
export const getCachedInvestorById = cache(getInvestorById);
export const getCachedAllInvestors = cache(getAllInvestors);
export const getCachedFilterOptions = cache(getFilterOptions);
