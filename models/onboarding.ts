import mongoose from "mongoose";

const onboardingProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  entityType: { type: String },
  step: { type: Number },
  selectedSectors: { type: [String] },
  socialLinks: { type: Array },
  companyData: { type: Object },
  investorData: { type: Object },
  updatedAt: { type: Date, default: Date.now },
});

const OnboardingProgress =
  mongoose.models.OnboardingProgress ||
  mongoose.model("OnboardingProgress", onboardingProgressSchema);
export default OnboardingProgress;
