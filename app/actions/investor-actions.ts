"use server";

import { revalidatePath } from "next/cache";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import Investor from "@/models/Investor";
import { connect } from "@/lib/mongoDB";
import { ObjectId } from "mongodb";
import Company from "@/models/Company";
import { sendNotification } from "./notification";

// Add a new investor
export async function createInvestor(data: any) {
  try {
    await connect();
    console.log(data);
    const { userId } = await auth();

    if (!userId) {
      return { message: "No Logged In User" };
    }

    const newInvestor = await new Investor(data);
    const investor = await newInvestor.save();
    console.log(investor);
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingCompleted: true,
        companyId: investor._id,
        companyName: investor.name,
        role: "investor",
      },
    });

    return JSON.parse(JSON.stringify({ success: true, investor: investor }));
  } catch (error) {
    console.error("Error creating investor:", error);
    return { success: false, error: "Failed to create investor" };
  }
}

// Update an existing investor
export async function updateInvestorAction(id: string, data: any) {
  try {
    // Update the investor
    const investor = Investor.findByIdAndUpdate(id, data, { new: true });

    if (!investor) {
      return { success: false, error: "Investor not found" };
    }

    return { success: true, investor };
  } catch (error) {
    console.error("Error updating investor:", error);
    return { success: false, error: "Failed to update investor" };
  }
}

// Get all investors with filters
export async function getInvestorsAction(filters?: {
  userId?: string;
  sectorInterested?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await connect();
    console.log(filters);
    const result = await Investor.find();

    return JSON.parse(JSON.stringify({ success: true, data: result }));
  } catch (error) {
    console.error("Error fetching investors:", error);
    return {
      success: false,
      error: "Failed to fetch investors",
      data: [],
      total: 0,
      page: 1,
      totalPages: 0,
    };
  }
}

// Get a single investor by ID
export async function getInvestorByIdAction(id: string) {
  try {
    await connect();
    const investor = await Investor.findById(id);

    if (!investor) {
      return { success: false, error: "Investor not found" };
    }

    return JSON.parse(JSON.stringify({ success: true, investor: investor }));
  } catch (error) {
    console.error("Error fetching investor:", error);
    return { success: false, error: "Failed to fetch investor" };
  }
}

// Delete an investor
export async function deleteInvestorAction(id: string) {
  try {
    // In a real app, you would verify the user has permission to delete this investor

    const deleted = {};

    if (!deleted) {
      return {
        success: false,
        error: "Investor not found or could not be deleted",
      };
    }

    // Revalidate the investors list page
    revalidatePath("/investors");

    return { success: true };
  } catch (error) {
    console.error("Error deleting investor:", error);
    return { success: false, error: "Failed to delete investor" };
  }
}

export async function getPendingInvestors() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const userRole = (sessionClaims?.metadata as { role?: string })?.role;

  if (userRole !== "admin") {
    throw new Error("Insufficient permissions");
  }

  try {
    const db = await connect();

    // Fetch investors from MongoDB
    // Adjust the query based on your actual collection and schema
    const investors = await Investor.find({}).sort({ registrationDate: -1 });

    // Transform MongoDB documents to match the expected format
    return investors.map((investor) => ({
      id: investor._id.toString(),
      name: investor.name,
      email: investor.email,
      registrationDate: new Date(investor.registrationDate),
      status: investor.status || "Pending",
      type: investor.type,
      fundingCapacity: investor.fundingCapacity,
    }));
  } catch (error) {
    console.error("Error fetching investors:", error);
    throw new Error("Failed to fetch investors");
  }
}

export async function approveInvestor(investorId: string) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const userRole = (sessionClaims?.metadata as { role?: string })?.role;

  if (userRole !== "admin") {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    const db = await connect();

    // Update investor status in MongoDB
    const result = await Investor.updateOne(
      { _id: new ObjectId(investorId) },
      {
        $set: {
          status: "Approved",
          approvedAt: new Date(),
          approvedBy: userId,
        },
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "Investor not found" };
    }

    revalidatePath("/admin/investor-approvals");
    return { success: true };
  } catch (error) {
    console.error("Error approving investor:", error);
    return { success: false, error: "Failed to approve investor" };
  }
}

export async function rejectInvestor(investorId: string) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const userRole = (sessionClaims?.metadata as { role?: string })?.role;

  if (userRole !== "admin") {
    return { success: false, error: "Insufficient permissions" };
  }

  try {
    const db = await connect();

    // Update investor status in MongoDB
    const result = await Investor.updateOne(
      { _id: new ObjectId(investorId) },
      {
        $set: {
          status: "Rejected",
          rejectedAt: new Date(),
          rejectedBy: userId,
        },
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "Investor not found" };
    }

    revalidatePath("/admin/investor-approvals");
    return { success: true };
  } catch (error) {
    console.error("Error rejecting investor:", error);
    return { success: false, error: "Failed to reject investor" };
  }
}

export async function followUnfollowCompany(userId: string) {
  try {
    await connect();

    const user = await currentUser();
    if (!user || !user.id || !user.publicMetadata?.companyId) {
      return {
        success: false,
        message: "User not authenticated or invalid metadata.",
      };
    }

    const company = await Company.findOne({ userId });

    if (!company) {
      return { success: false, message: "Company not found." };
    }

    const investor = await Investor.findById(user.publicMetadata.companyId);
    if (!investor) {
      return { success: false, message: "Investor not found." };
    }

    const userIdStr = String(user.id);

    const isFollowing = company.followers.includes(userIdStr);

    if (!isFollowing) {
      await company.updateOne({ $push: { followers: userIdStr } });
      await investor.updateOne({ $push: { following: userId } });
      await sendNotification({
        title: "You have new follower",
        desc: `${company?.name} start to follow you.`,
        from: user.id,
        to: company.userId,
        url: `/companies/${company.id}`,
      });
      return { success: true, message: "Followed successfully." };
    } else {
      await company.updateOne({ $pull: { followers: userIdStr } });
      await investor.updateOne({ $pull: { following: userId } });
      return { success: true, message: "Unfollowed successfully." };
    }
  } catch (error) {
    console.error("Follow/Unfollow error:", error);
    return {
      success: false,
      message: "An error occurred during follow/unfollow.",
    };
  }
}

export async function isFollow(userId: string): Promise<boolean> {
  try {
    await connect();

    const user = await currentUser();
    if (!user || !user.id) {
      return false;
    }

    const company = await Company.findOne({ userId });
    if (!company || !Array.isArray(company.followers)) {
      return false;
    }

    return company.followers.includes(user.id);
  } catch (error) {
    console.error("isFollow error:", error);
    return false;
  }
}

export interface InvestorFilters {
  search?: string;
  sector?: string;
  type?: string;
  stage?: string;
  location?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface InvestorResponse {
  investors: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  filters: {
    sectors: string[];
    types: string[];
    stages: string[];
    locations: string[];
  };
}

export async function getInvestors(
  filters: InvestorFilters = {}
): Promise<InvestorResponse> {
  try {
    await connect();

    const {
      search = "",
      sector = "all",
      type = "all",
      stage = "all",
      location = "all",
      sortField = "name",
      sortDirection = "asc",
      page = 1,
      limit = 10,
    } = filters;

    // Build query
    const query: any = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sector filter
    if (sector !== "all") {
      query.sectorInterested = { $in: [sector] };
    }

    // Type filter
    if (type !== "all") {
      query.type = type;
    }

    // Stage filter
    if (stage !== "all") {
      query.stage = stage;
    }

    // Location filter
    if (location !== "all") {
      query.location = location;
    }

    // Get total count for pagination
    const totalCount = await Investor.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObj: any = {};
    sortObj[sortField] = sortDirection === "asc" ? 1 : -1;

    // Execute query with pagination and sorting
    const investors = await Investor.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get filter options
    const [sectors, types, stages, locations] = await Promise.all([
      Investor.distinct("sectorInterested"),
      Investor.distinct("type"),
      Investor.distinct("stage"),
      Investor.distinct("location"),
    ]);

    return {
      investors: JSON.parse(JSON.stringify(investors)),
      totalCount,
      totalPages,
      currentPage: page,
      filters: {
        sectors: sectors.filter(Boolean).sort(),
        types: types.filter(Boolean).sort(),
        stages: stages.filter(Boolean).sort(),
        locations: locations.filter(Boolean).sort(),
      },
    };
  } catch (error) {
    console.error("Error fetching investors:", error);
    throw new Error("Failed to fetch investors");
  }
}
