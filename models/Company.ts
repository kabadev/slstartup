import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    // Changed userId to String type
    userId: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    sector: { type: String, required: true },
    location: { type: String },
    foundedAt: { type: Date },
    logo: { type: String },
    registrationNumber: { type: String },
    type: { type: String },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: { type: String },
    address: { type: String },
    socialLinks: [
      {
        name: String,
        link: String,
      },
    ],
    website: {
      type: String,
      match: [
        /^https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?.*$/,
        "Please provide a valid URL",
      ],
    },
    stage: { type: String },
    description: { type: String },
    missionStatement: { type: String },
    fundingStatus: { type: String },
    amountRaised: { type: Number },
    foundingDocuments: { type: String },
    pitchDeck: { type: String },
    fundingNeeded: { type: Number },
    employeesRange: { type: String },

    // General Business Information
    headOfficeAddress: { type: String },
    businessPhone: { type: String },
    businessDescription: { type: String },
    isYouthLed: { type: Boolean, default: false },
    isWomanLed: { type: Boolean, default: false },
    businessModel: { type: String },
    otherBusinessModel: { type: String },

    // Ownership & Management
    founderName: { type: String },
    founderGender: { type: String },
    founderDob: { type: Date },
    founderEducation: { type: String },

    // Tax Compliance
    taxCompliance: [{ type: String }],
    sectorLicenses: { type: String },
    intellectualProperty: { type: Boolean, default: false },

    // Financial & Banking
    annualTurnoverCurrent: { type: String },
    annualTurnoverNext: { type: String },
    annualTurnoverBefore: { type: String },
    businessBankAccount: { type: Boolean, default: false },
    externalFunding: [{ type: String }],
    financialRecords: { type: Boolean, default: false },

    // Innovation & Digital Tools
    usesDigitalTools: { type: Boolean, default: false },
    digitalTools: [{ type: String }],
    isInnovative: { type: Boolean, default: false },
    innovationDescription: { type: String },

    // Challenges
    businessChallenges: [{ type: String }],
    supportNeeded: { type: String },
    planToExpand: { type: Boolean, default: false },
    expansionPlans: { type: String },

    // Social & Environmental Impact
    employsVulnerableGroups: { type: Boolean, default: false },
    addressesEnvironmentalSustainability: { type: Boolean, default: false },
    impactInitiatives: { type: String },

    // Consent & Follow Up
    joinEcosystemPrograms: { type: Boolean, default: false },
    agreeToDataStorage: { type: Boolean, default: false },
    additionalComments: { type: String },
    followers: [{ type: String }],
  },
  { timestamps: true }
);

const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);
export default Company;
