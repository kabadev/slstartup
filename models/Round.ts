import mongoose, { Schema, type Document, type Model } from "mongoose";

// Define the interface for the Round document
export interface IRound extends Document {
  roundTitle: string;
  roundType: string;
  fundingGoal: string;
  raisedAmount: string;
  progress: number;
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
  investors: Array<{
    id: string;
    name: string;
    amount: string;
    date: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Round schema
const RoundSchema = new Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    companyId: {
      type: String,
      require: true,
    },
    roundTitle: {
      type: String,
      required: [true, "Round title is required"],
      trim: true,
    },
    roundType: {
      type: String,
      required: [true, "Round type is required"],
      enum: [
        "Pre-Seed",
        "Seed",
        "Series A",
        "Series B",
        "Bridge / Convertible",
        "Other",
      ],
    },
    fundingGoal: {
      type: String,
      required: [true, "Funding goal is required"],
      trim: true,
    },
    raisedAmount: {
      type: String,
      default: "USD 0",
      trim: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    valuation: {
      type: String,
      trim: true,
    },
    equityOffered: {
      type: String,
      trim: true,
    },
    minimumInvestment: {
      type: String,
      trim: true,
    },
    useOfFunds: {
      type: String,
      required: [true, "Use of funds is required"],
      trim: true,
      minlength: [10, "Use of funds must be at least 10 characters"],
    },
    supportingDocuments: {
      type: String,
      trim: true,
    },
    openDate: {
      type: Date,
      required: [true, "Open date is required"],
    },
    closingDate: {
      type: Date,
      required: [true, "Closing date is required"],
    },
    companyStage: {
      type: String,
      required: [true, "Company stage is required"],
      enum: ["Idea", "MVP", "Revenue", "Scaling"],
    },
    roundStatus: {
      type: String,
      required: [true, "Round status is required"],
      enum: ["Draft", "Under Review", "Open", "Closed"],
      default: "Draft",
    },
    contactPerson: {
      type: String,
      required: [true, "Contact person is required"],
      trim: true,
    },
    investors: [
      {
        id: String,
        name: String,
        amount: String,
        date: String,
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Calculate progress before saving
RoundSchema.pre("save", function (next) {
  if (this.fundingGoal && this.raisedAmount) {
    const raisedAmount = Number.parseInt(
      this.raisedAmount.replace(/[^0-9]/g, "")
    );
    const goalAmount = Number.parseInt(this.fundingGoal.replace(/[^0-9]/g, ""));
    if (goalAmount > 0) {
      this.progress = Math.round((raisedAmount / goalAmount) * 100);
    }
  }
  next();
});

// Create or retrieve the model
let Round: Model<IRound>;

try {
  // Try to retrieve existing model to prevent OverwriteModelError
  Round = mongoose.model<IRound>("Round");
} catch {
  // If model doesn't exist, create it
  Round = mongoose.model<IRound>("Round", RoundSchema);
}

export default Round;
