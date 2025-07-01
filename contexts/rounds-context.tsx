// "use client";

// import {
//   createContext,
//   useContext,
//   useReducer,
//   type ReactNode,
//   useCallback,
// } from "react";
// import type {
//   RoundsContextType,
//   RoundsState,
//   RoundFormData,
// } from "@/types/types.ts";
// // import * as roundActions from "@/actions/round-actions";
// // import * as roundActions from "@/actions/round-actions";
// import * as roundActions from "@/app/actions/round-actions";

// // Initial state
// const initialState: RoundsState = {
//   rounds: [],
//   currentRound: null,
//   loading: false,
//   error: null,
// };

// // Action types
// type Action =
//   | { type: "FETCH_ROUNDS_START" }
//   | { type: "FETCH_ROUNDS_SUCCESS"; payload: any[] }
//   | { type: "FETCH_ROUNDS_ERROR"; payload: string }
//   | { type: "FETCH_ROUND_START" }
//   | { type: "FETCH_ROUND_SUCCESS"; payload: any }
//   | { type: "FETCH_ROUND_ERROR"; payload: string }
//   | { type: "CREATE_ROUND_START" }
//   | { type: "CREATE_ROUND_SUCCESS"; payload: any }
//   | { type: "CREATE_ROUND_ERROR"; payload: string }
//   | { type: "UPDATE_ROUND_START" }
//   | { type: "UPDATE_ROUND_SUCCESS"; payload: any }
//   | { type: "UPDATE_ROUND_ERROR"; payload: string }
//   | { type: "DELETE_ROUND_START" }
//   | { type: "DELETE_ROUND_SUCCESS"; payload: string }
//   | { type: "DELETE_ROUND_ERROR"; payload: string }
//   | { type: "ADD_INVESTOR_START" }
//   | { type: "ADD_INVESTOR_SUCCESS"; payload: any }
//   | { type: "ADD_INVESTOR_ERROR"; payload: string }
//   | { type: "CLEAR_CURRENT_ROUND" }
//   | { type: "CLEAR_ERROR" };

// // Reducer function
// function reducer(state: RoundsState, action: Action): RoundsState {
//   switch (action.type) {
//     // Fetch all rounds
//     case "FETCH_ROUNDS_START":
//       return { ...state, loading: true, error: null };
//     case "FETCH_ROUNDS_SUCCESS":
//       return { ...state, rounds: action.payload, loading: false };
//     case "FETCH_ROUNDS_ERROR":
//       return { ...state, error: action.payload, loading: false };

//     // Fetch single round
//     case "FETCH_ROUND_START":
//       return { ...state, loading: true, error: null };
//     case "FETCH_ROUND_SUCCESS":
//       return { ...state, currentRound: action.payload, loading: false };
//     case "FETCH_ROUND_ERROR":
//       return { ...state, error: action.payload, loading: false };

//     // Create round
//     case "CREATE_ROUND_START":
//       return { ...state, loading: true, error: null };
//     case "CREATE_ROUND_SUCCESS":
//       return {
//         ...state,
//         rounds: [action.payload, ...state.rounds],
//         currentRound: action.payload,
//         loading: false,
//       };
//     case "CREATE_ROUND_ERROR":
//       return { ...state, error: action.payload, loading: false };

//     // Update round
//     case "UPDATE_ROUND_START":
//       return { ...state, loading: true, error: null };
//     case "UPDATE_ROUND_SUCCESS":
//       return {
//         ...state,
//         rounds: state.rounds.map((round) =>
//           round._id === action.payload._id ? action.payload : round
//         ),
//         currentRound: action.payload,
//         loading: false,
//       };
//     case "UPDATE_ROUND_ERROR":
//       return { ...state, error: action.payload, loading: false };

//     // Delete round
//     case "DELETE_ROUND_START":
//       return { ...state, loading: true, error: null };
//     case "DELETE_ROUND_SUCCESS":
//       return {
//         ...state,
//         rounds: state.rounds.filter((round) => round._id !== action.payload),
//         currentRound: null,
//         loading: false,
//       };
//     case "DELETE_ROUND_ERROR":
//       return { ...state, error: action.payload, loading: false };

//     // Add investor
//     case "ADD_INVESTOR_START":
//       return { ...state, loading: true, error: null };
//     case "ADD_INVESTOR_SUCCESS":
//       return {
//         ...state,
//         rounds: state.rounds.map((round) =>
//           round._id === action.payload._id ? action.payload : round
//         ),
//         currentRound: action.payload,
//         loading: false,
//       };
//     case "ADD_INVESTOR_ERROR":
//       return { ...state, error: action.payload, loading: false };

//     // Utility actions
//     case "CLEAR_CURRENT_ROUND":
//       return { ...state, currentRound: null };
//     case "CLEAR_ERROR":
//       return { ...state, error: null };

//     default:
//       return state;
//   }
// }

// // Create context
// const RoundsContext = createContext<RoundsContextType | undefined>(undefined);

// // Provider component
// export function RoundsProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   // Action creators
//   const fetchRounds = useCallback(async () => {
//     dispatch({ type: "FETCH_ROUNDS_START" });
//     try {
//       const rounds = await roundActions.getAllRounds();
//       dispatch({ type: "FETCH_ROUNDS_SUCCESS", payload: rounds });
//     } catch (error: any) {
//       dispatch({ type: "FETCH_ROUNDS_ERROR", payload: error.message });
//     }
//   }, []);

//   const fetchRound = useCallback(async (id: string) => {
//     dispatch({ type: "FETCH_ROUND_START" });
//     try {
//       const round = await roundActions.getRoundById(id);
//       if (round) {
//         dispatch({ type: "FETCH_ROUND_SUCCESS", payload: round });
//       } else {
//         dispatch({ type: "FETCH_ROUND_ERROR", payload: "Round not found" });
//       }
//     } catch (error: any) {
//       dispatch({ type: "FETCH_ROUND_ERROR", payload: error.message });
//     }
//   }, []);

//   const createRound = useCallback(async (data: RoundFormData) => {
//     dispatch({ type: "CREATE_ROUND_START" });
//     try {
//       const round = await roundActions.createRound(data);
//       dispatch({ type: "CREATE_ROUND_SUCCESS", payload: round });
//     } catch (error: any) {
//       dispatch({ type: "CREATE_ROUND_ERROR", payload: error.message });
//     }
//   }, []);

//   const updateRound = useCallback(
//     async (id: string, data: Partial<RoundFormData>) => {
//       dispatch({ type: "UPDATE_ROUND_START" });
//       try {
//         const round = await roundActions.updateRound(id, data);
//         if (round) {
//           dispatch({ type: "UPDATE_ROUND_SUCCESS", payload: round });
//         } else {
//           dispatch({ type: "UPDATE_ROUND_ERROR", payload: "Round not found" });
//         }
//       } catch (error: any) {
//         dispatch({ type: "UPDATE_ROUND_ERROR", payload: error.message });
//       }
//     },
//     []
//   );

//   const deleteRound = useCallback(async (id: string) => {
//     dispatch({ type: "DELETE_ROUND_START" });
//     try {
//       await roundActions.deleteRound(id);
//       dispatch({ type: "DELETE_ROUND_SUCCESS", payload: id });
//     } catch (error: any) {
//       dispatch({ type: "DELETE_ROUND_ERROR", payload: error.message });
//     }
//   }, []);

//   const addInvestor = useCallback(
//     async (roundId: string, investor: { name: string; amount: string }) => {
//       dispatch({ type: "ADD_INVESTOR_START" });
//       try {
//         const round = await roundActions.addInvestor(roundId, investor);
//         if (round) {
//           dispatch({ type: "ADD_INVESTOR_SUCCESS", payload: round });
//         } else {
//           dispatch({ type: "ADD_INVESTOR_ERROR", payload: "Round not found" });
//         }
//       } catch (error: any) {
//         dispatch({ type: "ADD_INVESTOR_ERROR", payload: error.message });
//       }
//     },
//     []
//   );

//   const clearCurrentRound = useCallback(() => {
//     dispatch({ type: "CLEAR_CURRENT_ROUND" });
//   }, []);

//   const clearError = useCallback(() => {
//     dispatch({ type: "CLEAR_ERROR" });
//   }, []);

//   const actions = {
//     fetchRounds,
//     fetchRound,
//     createRound,
//     updateRound,
//     deleteRound,
//     addInvestor,
//     clearCurrentRound,
//     clearError,
//   };

//   return (
//     <RoundsContext.Provider value={{ state, actions }}>
//       {children}
//     </RoundsContext.Provider>
//   );
// }

// // Custom hook to use the rounds context
// export function useRounds() {
//   const context = useContext(RoundsContext);
//   if (context === undefined) {
//     throw new Error("useRounds must be used within a RoundsProvider");
//   }
//   return context;
// }

"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  useCallback,
} from "react";
import * as roundActions from "@/app/actions/round-actions";

// Define types for the context state and actions
interface RoundsState {
  rounds: any[];
  currentRound: any | null;
  loading: boolean;
  error: string | null;
}

interface RoundsActions {
  fetchRounds: () => Promise<void>;
  fetchRound: (id: string) => Promise<void>;
  createRound: (data: any) => Promise<void>;
  updateRound: (id: string, data: any) => Promise<void>;
  deleteRound: (id: string) => Promise<void>;
  addInvestor: (
    roundId: string,
    investor: { name: string; amount: string }
  ) => Promise<void>;
  clearCurrentRound: () => void;
  clearError: () => void;
}

interface RoundsContextType {
  state: RoundsState;
  actions: RoundsActions;
}

// Initial state
const initialState: RoundsState = {
  rounds: [],
  currentRound: null,
  loading: false,
  error: null,
};

// Action types
type Action =
  | { type: "FETCH_ROUNDS_START" }
  | { type: "FETCH_ROUNDS_SUCCESS"; payload: any[] }
  | { type: "FETCH_ROUNDS_ERROR"; payload: string }
  | { type: "FETCH_ROUND_START" }
  | { type: "FETCH_ROUND_SUCCESS"; payload: any }
  | { type: "FETCH_ROUND_ERROR"; payload: string }
  | { type: "CREATE_ROUND_START" }
  | { type: "CREATE_ROUND_SUCCESS"; payload: any }
  | { type: "CREATE_ROUND_ERROR"; payload: string }
  | { type: "UPDATE_ROUND_START" }
  | { type: "UPDATE_ROUND_SUCCESS"; payload: any }
  | { type: "UPDATE_ROUND_ERROR"; payload: string }
  | { type: "DELETE_ROUND_START" }
  | { type: "DELETE_ROUND_SUCCESS"; payload: string }
  | { type: "DELETE_ROUND_ERROR"; payload: string }
  | { type: "ADD_INVESTOR_START" }
  | { type: "ADD_INVESTOR_SUCCESS"; payload: any }
  | { type: "ADD_INVESTOR_ERROR"; payload: string }
  | { type: "CLEAR_CURRENT_ROUND" }
  | { type: "CLEAR_ERROR" };

// Reducer function
function reducer(state: RoundsState, action: Action): RoundsState {
  switch (action.type) {
    // Fetch all rounds
    case "FETCH_ROUNDS_START":
      return { ...state, loading: true, error: null };
    case "FETCH_ROUNDS_SUCCESS":
      return { ...state, rounds: action.payload, loading: false };
    case "FETCH_ROUNDS_ERROR":
      return { ...state, error: action.payload, loading: false };

    // Fetch single round
    case "FETCH_ROUND_START":
      return { ...state, loading: true, error: null };
    case "FETCH_ROUND_SUCCESS":
      return { ...state, currentRound: action.payload, loading: false };
    case "FETCH_ROUND_ERROR":
      return { ...state, error: action.payload, loading: false };

    // Create round
    case "CREATE_ROUND_START":
      return { ...state, loading: true, error: null };
    case "CREATE_ROUND_SUCCESS":
      return {
        ...state,
        rounds: [action.payload, ...state.rounds],
        currentRound: action.payload,
        loading: false,
      };
    case "CREATE_ROUND_ERROR":
      return { ...state, error: action.payload, loading: false };

    // Update round
    case "UPDATE_ROUND_START":
      return { ...state, loading: true, error: null };
    case "UPDATE_ROUND_SUCCESS":
      return {
        ...state,
        rounds: state.rounds.map((round) =>
          round._id === action.payload._id ? action.payload : round
        ),
        currentRound: action.payload,
        loading: false,
      };
    case "UPDATE_ROUND_ERROR":
      return { ...state, error: action.payload, loading: false };

    // Delete round
    case "DELETE_ROUND_START":
      return { ...state, loading: true, error: null };
    case "DELETE_ROUND_SUCCESS":
      return {
        ...state,
        rounds: state.rounds.filter((round) => round._id !== action.payload),
        currentRound: null,
        loading: false,
      };
    case "DELETE_ROUND_ERROR":
      return { ...state, error: action.payload, loading: false };

    // Add investor
    case "ADD_INVESTOR_START":
      return { ...state, loading: true, error: null };
    case "ADD_INVESTOR_SUCCESS":
      return {
        ...state,
        rounds: state.rounds.map((round) =>
          round._id === action.payload._id ? action.payload : round
        ),
        currentRound: action.payload,
        loading: false,
      };
    case "ADD_INVESTOR_ERROR":
      return { ...state, error: action.payload, loading: false };

    // Utility actions
    case "CLEAR_CURRENT_ROUND":
      return { ...state, currentRound: null };
    case "CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
}

// Create context
const RoundsContext = createContext<RoundsContextType | undefined>(undefined);

// Provider component
export function RoundsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Action creators
  const fetchRounds = useCallback(async () => {
    dispatch({ type: "FETCH_ROUNDS_START" });
    try {
      const rounds = await roundActions.getAllRounds();
      dispatch({ type: "FETCH_ROUNDS_SUCCESS", payload: rounds });
    } catch (error: any) {
      dispatch({ type: "FETCH_ROUNDS_ERROR", payload: error.message });
    }
  }, []);

  const fetchRound = useCallback(async (id: string) => {
    dispatch({ type: "FETCH_ROUND_START" });
    try {
      const round = await roundActions.getRoundById(id);
      if (round) {
        dispatch({ type: "FETCH_ROUND_SUCCESS", payload: round });
      } else {
        dispatch({ type: "FETCH_ROUND_ERROR", payload: "Round not found" });
      }
    } catch (error: any) {
      dispatch({ type: "FETCH_ROUND_ERROR", payload: error.message });
    }
  }, []);

  const createRound = useCallback(async (data: any) => {
    dispatch({ type: "CREATE_ROUND_START" });
    try {
      const round = await roundActions.createRound(data);
      dispatch({ type: "CREATE_ROUND_SUCCESS", payload: round });
    } catch (error: any) {
      dispatch({ type: "CREATE_ROUND_ERROR", payload: error.message });
    }
  }, []);

  const updateRound = useCallback(async (id: string, data: any) => {
    dispatch({ type: "UPDATE_ROUND_START" });
    try {
      const round = await roundActions.updateRound(id, data);
      if (round) {
        dispatch({ type: "UPDATE_ROUND_SUCCESS", payload: round });
      } else {
        dispatch({ type: "UPDATE_ROUND_ERROR", payload: "Round not found" });
      }
    } catch (error: any) {
      dispatch({ type: "UPDATE_ROUND_ERROR", payload: error.message });
    }
  }, []);

  const deleteRound = useCallback(async (id: string) => {
    dispatch({ type: "DELETE_ROUND_START" });
    try {
      await roundActions.deleteRound(id);
      dispatch({ type: "DELETE_ROUND_SUCCESS", payload: id });
    } catch (error: any) {
      dispatch({ type: "DELETE_ROUND_ERROR", payload: error.message });
    }
  }, []);

  const addInvestor = useCallback(
    async (roundId: string, investor: { name: string; amount: string }) => {
      dispatch({ type: "ADD_INVESTOR_START" });
      try {
        const round = await roundActions.addInvestor(roundId, investor);
        if (round) {
          dispatch({ type: "ADD_INVESTOR_SUCCESS", payload: round });
        } else {
          dispatch({ type: "ADD_INVESTOR_ERROR", payload: "Round not found" });
        }
      } catch (error: any) {
        dispatch({ type: "ADD_INVESTOR_ERROR", payload: error.message });
      }
    },
    []
  );

  const clearCurrentRound = useCallback(() => {
    dispatch({ type: "CLEAR_CURRENT_ROUND" });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const actions = {
    fetchRounds,
    fetchRound,
    createRound,
    updateRound,
    deleteRound,
    addInvestor,
    clearCurrentRound,
    clearError,
  };

  return (
    <RoundsContext.Provider value={{ state, actions }}>
      {children}
    </RoundsContext.Provider>
  );
}

// Custom hook to use the rounds context
export function useRounds() {
  const context = useContext(RoundsContext);
  if (context === undefined) {
    throw new Error("useRounds must be used within a RoundsProvider");
  }
  return context;
}
