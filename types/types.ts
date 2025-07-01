// Type definitions for the funding round form data
export interface RoundFormData {
  _id?: string;
  roundTitle: string;
  roundType: string;
  fundingGoal: string;
  valuation?: string;
  equityOffered?: string;
  minimumInvestment?: string;
  useOfFunds: string;
  supportingDocuments?: string;
  openDate: Date;
  closingDate: Date;
  companyStage: string;
  roundStatus: string;
  contactPerson: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
  investors?: Array<{
    name: string;
    amount: string;
  }>;
  companyId?: string;
  companyName?: string;
  raisedAmount?: string;
}

// Type for the context state
export interface RoundsState {
  rounds: any[];
  currentRound: any | null;
  loading: boolean;
  error: string | null;
}

// Type for the context actions
export interface RoundsActions {
  fetchRounds: () => Promise<void>;
  fetchRound: (id: string) => Promise<void>;
  createRound: (data: RoundFormData) => Promise<void>;
  updateRound: (id: string, data: Partial<RoundFormData>) => Promise<void>;
  deleteRound: (id: string) => Promise<void>;
  addInvestor: (
    roundId: string,
    investor: { name: string; amount: string }
  ) => Promise<void>;
  clearCurrentRound: () => void;
  clearError: () => void;
}

// Combined context type
export interface RoundsContextType {
  state: RoundsState;
  actions: RoundsActions;
}
