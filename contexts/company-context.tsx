"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Company } from "@/lib/db-simulation";
import {
  createCompany,
  updateCompanyAction,
  getCompaniesAction,
  getCompanyByIdAction,
  deleteCompanyAction,
} from "@/app/actions/company-actions";

type CompanyContextType = {
  companies: Company[];
  totalCompanies: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  selectedCompany: Company | null;
  addCompany: (
    data: Omit<Company, "id" | "createdAt" | "updatedAt">
  ) => Promise<{ success: boolean; company?: Company; error?: string }>;
  updateCompany: (
    id: string,
    data: Partial<Company>
  ) => Promise<{ success: boolean; company?: Company; error?: string }>;
  fetchCompanies: (filters?: {
    userId?: string;
    sector?: string;
    stage?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  fetchCompanyById: (id: string) => Promise<void>;
  deleteCompany: (id: string) => Promise<{ success: boolean; error?: string }>;
  clearSelectedCompany: () => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const addCompany = useCallback(
    async (data: Omit<Company, "id" | "createdAt" | "updatedAt">) => {
      setLoading(true);
      setError(null);

      try {
        const result = await createCompany(data);

        if (result.success && result.company) {
          return { success: true, companyId: result.company._id };
        } else {
          setError(result.error || "Failed to create company");
          return { success: false, error: result.error };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateCompany = useCallback(
    async (id: string, data: Partial<Company>) => {
      setLoading(true);
      setError(null);

      try {
        const result = await updateCompanyAction(id, data);

        if (result.success && result.company) {
          // Update the local state
          setCompanies((prev) =>
            prev.map((company) =>
              company.id === id ? result.company! : company
            )
          );

          if (selectedCompany?.id === id) {
            setSelectedCompany(result.company);
          }

          return { success: true, company: result.company };
        } else {
          setError(result.error || "Failed to update company");
          return { success: false, error: result.error };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [selectedCompany]
  );

  const fetchCompanies = useCallback(
    async (filters?: {
      userId?: string;
      sector?: string;
      stage?: string;
      search?: string;
      page?: number;
      limit?: number;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const result = await getCompaniesAction(filters);

        if (result.success) {
          setCompanies(result.data || []);
          setTotalCompanies(result.total ?? 0);
          setCurrentPage(result.page ?? 1);
          setTotalPages(result.totalPages ?? 1);
        } else {
          setError(result.error || "Failed to fetch companies");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchCompanyById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getCompanyByIdAction(id);

      if (result.success && result.company) {
        setSelectedCompany(result.company);
      } else {
        setError(result.error || "Failed to fetch company");
        setSelectedCompany(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setSelectedCompany(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCompany = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await deleteCompanyAction(id);

        if (result.success) {
          // Update the local state
          setCompanies((prev) => prev.filter((company) => company.id !== id));
          setTotalCompanies((prev) => prev - 1);

          if (selectedCompany?.id === id) {
            setSelectedCompany(null);
          }

          return { success: true };
        } else {
          setError(result.error || "Failed to delete company");
          return { success: false, error: result.error };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [selectedCompany]
  );

  const clearSelectedCompany = useCallback(() => {
    setSelectedCompany(null);
  }, []);

  const value = {
    companies,
    totalCompanies,
    currentPage,
    totalPages,
    loading,
    error,
    selectedCompany,
    addCompany,
    updateCompany,
    fetchCompanies,
    fetchCompanyById,
    deleteCompany,
    clearSelectedCompany,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
