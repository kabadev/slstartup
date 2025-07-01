"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Investor } from "@/lib/db-simulation";
import {
  createInvestor,
  updateInvestorAction,
  getInvestorsAction,
  getInvestorByIdAction,
  deleteInvestorAction,
} from "@/app/actions/investor-actions";

type InvestorContextType = {
  investors: Investor[];
  totalInvestors: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  selectedInvestor: Investor | null;
  addInvestor: (
    data: Omit<Investor, "id" | "createdAt" | "updatedAt">
  ) => Promise<{ success: boolean; investor?: Investor; error?: string }>;
  updateInvestor: (
    id: string,
    data: Partial<Investor>
  ) => Promise<{ success: boolean; investor?: Investor; error?: string }>;
  fetchInvestors: (filters?: {
    userId?: string;
    sectorInterested?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  fetchInvestorById: (id: string) => Promise<void>;
  deleteInvestor: (id: string) => Promise<{ success: boolean; error?: string }>;
  clearSelectedInvestor: () => void;
};

const InvestorContext = createContext<InvestorContextType | undefined>(
  undefined
);

export function InvestorProvider({ children }: { children: ReactNode }) {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [totalInvestors, setTotalInvestors] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(
    null
  );

  const addInvestor = useCallback(
    async (data: Omit<Investor, "id" | "createdAt" | "updatedAt">) => {
      setLoading(true);
      setError(null);

      try {
        const result = await createInvestor(data);

        if (result.success && result.investor) {
          return { success: true, investorId: result.investor._id };
        } else {
          setError(result.error || "Failed to create investor");
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

  const updateInvestor = useCallback(
    async (id: string, data: Partial<Investor>) => {
      setLoading(true);
      setError(null);

      try {
        const result = await updateInvestorAction(id, data);

        if (result.success && result.investor) {
          // Update the local state
          // setInvestors((prev) =>
          //   prev.map((investor) =>
          //     investor.id === id ? result.investor! : investor
          //   )
          // );

          // if (selectedInvestor?.id === id) {
          //   setSelectedInvestor(result.investor);
          // }

          return { success: true, investor: result.investor };
        } else {
          setError(result.error || "Failed to update investor");
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
    [selectedInvestor]
  );

  const fetchInvestors = useCallback(
    async (filters?: {
      userId?: string;
      sectorInterested?: string;
      type?: string;
      search?: string;
      page?: number;
      limit?: number;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const result = await getInvestorsAction(filters);

        if (result.success) {
          setInvestors(result.data);
          setTotalInvestors(result.total);
          setCurrentPage(result.page);
          setTotalPages(result.totalPages);
        } else {
          setError(result.error || "Failed to fetch investors");
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

  const fetchInvestorById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getInvestorByIdAction(id);

      if (result.success && result.investor) {
        setSelectedInvestor(result.investor);
      } else {
        setError(result.error || "Failed to fetch investor");
        setSelectedInvestor(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setSelectedInvestor(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInvestor = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await deleteInvestorAction(id);

        if (result.success) {
          // Update the local state
          setInvestors((prev) => prev.filter((investor) => investor.id !== id));
          setTotalInvestors((prev) => prev - 1);

          if (selectedInvestor?.id === id) {
            setSelectedInvestor(null);
          }

          return { success: true };
        } else {
          setError(result.error || "Failed to delete investor");
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
    [selectedInvestor]
  );

  const clearSelectedInvestor = useCallback(() => {
    setSelectedInvestor(null);
  }, []);

  const value: any = {
    investors,
    totalInvestors,
    currentPage,
    totalPages,
    loading,
    error,
    selectedInvestor,
    addInvestor,
    updateInvestor,
    fetchInvestors,
    fetchInvestorById,
    deleteInvestor,
    clearSelectedInvestor,
  };

  return (
    <InvestorContext.Provider value={value}>
      {children}
    </InvestorContext.Provider>
  );
}

export function useInvestor() {
  const context = useContext(InvestorContext);
  if (context === undefined) {
    throw new Error("useInvestor must be used within an InvestorProvider");
  }
  return context;
}
