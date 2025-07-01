import mongoose from "mongoose";

const investorInterestSchema = new mongoose.Schema(
  {
    // 1. Investor Identity (Auto-filled or Verified)
    investorId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
    roundId: {
      type: String,
    },
    companyId: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    fullName: { type: String },
    company: { type: String },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      required: true,
    },

    phone: { type: String },
    investorType: {
      type: String,
      required: true,
    },

    investmentExperience: { type: String },
    investmentRange: { type: String },
    timeframe: { type: String },
    investmentGoals: { type: Array },
    investmentThesis: { type: String },
    questions: { type: String },
    hasPreviousInvestments: { type: Boolean },
    previousInvestments: { type: String },
    termsAgreed: { type: Boolean },
    contactPreference: { type: String },
    responseMessage: { type: String },
    termSheet: { type: String },
  },
  { timestamps: true }
);

const InvestorInterest =
  mongoose.models.InvestorInterest ||
  mongoose.model("InvestorInterest", investorInterestSchema);

export default InvestorInterest;
