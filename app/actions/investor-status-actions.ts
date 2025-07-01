"use server";

import { connect } from "@/lib/mongoDB";
import Investor from "@/models/Investor";
import { revalidatePath } from "next/cache";

export interface StatusActionData {
  investorId: string;
  action: "approved" | "rejected" | "suspended" | "deleted";
  reason: string;
  actionBy: string;
}

export async function updateInvestorStatus(data: StatusActionData) {
  try {
    await connect();

    const { investorId, action, reason, actionBy } = data;

    if (action === "deleted") {
      // For delete, we'll soft delete by updating status and adding to history
      const investor = await Investor.findByIdAndUpdate(
        investorId,
        {
          $set: {
            status: "deleted",
            lastActionBy: actionBy,
            lastActionDate: new Date(),
          },
          $push: {
            statusHistory: {
              action,
              reason,
              actionBy,
              actionDate: new Date(),
            },
          },
        },
        { new: true }
      ).lean();

      if (!investor) {
        return { success: false, error: "Investor not found" };
      }
    } else {
      // For other actions, update status
      const investor = await Investor.findByIdAndUpdate(
        investorId,
        {
          $set: {
            status: action,
            lastActionBy: actionBy,
            lastActionDate: new Date(),
          },
          $push: {
            statusHistory: {
              action,
              reason,
              actionBy,
              actionDate: new Date(),
            },
          },
        },
        { new: true }
      ).lean();

      if (!investor) {
        return { success: false, error: "Investor not found" };
      }
    }

    revalidatePath("/investors");
    return { success: true, message: `Investor ${data.action} successfully` };
  } catch (error) {
    console.error(`Error updating investor status:`, error);
    return { success: false, error: `Failed to ${data.action} investor` };
  }
}

export async function getInvestorById(id: string) {
  try {
    await connect();

    const investor = await Investor.findById(id).lean();

    if (!investor) {
      return { success: false, error: "Investor not found" };
    }

    return {
      success: true,
      investor: JSON.parse(JSON.stringify(investor)),
    };
  } catch (error) {
    console.error("Error fetching investor:", error);
    return { success: false, error: "Failed to fetch investor details" };
  }
}
