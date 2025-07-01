"use server";

import { revalidatePath } from "next/cache";
import { connect } from "@/lib/mongoDB";
import Round, { type IRound } from "@/models/Round";
import { type RoundFormData } from "@/types/types";
import Company from "@/models/Company";
import { sendNotification } from "./notification";
import { currentUser } from "@clerk/nextjs/server";
import Notification from "@/models/Notifcation";

// Connect to the database
async function connectDB() {
  try {
    await connect(); // Call the imported `connect` function
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw new Error("Database connection failed");
  }
}

// Create a new round
export async function createRound(data: RoundFormData): Promise<IRound> {
  try {
    const user = await currentUser();
    await connectDB();

    const newRound = new Round({
      ...data,
      raisedAmount: "USD 0",
      progress: 0,
      investors: [],
    });

    const round = await newRound.save();

    const company = await Company.findOne({ userId: user?.id });

    // await sendNotification({
    //   title: "You have new follower",
    //   desc: `${company?.name} launch new fonding round. "${}"`,
    //   from: user.id,
    //   to: company.userId,
    //   url: `/companies/${company.id}`,
    // });

    // Create a notification for each follower
    const notifications = company.followers.map((follower: any) =>
      Notification.create({
        title: "You have new funding round request",
        desc: `${company?.name} launch new founding round. "${round?.roundTitle}"`,
        from: user?.id!,
        to: follower,
        url: `/round/${round._id}`,
      })
    );

    await Promise.all(notifications);
    revalidatePath("/rounds");
    return JSON.parse(JSON.stringify(round));
  } catch (error: any) {
    console.error("Failed to create round:", error);
    throw new Error(error.message || "Failed to create round");
  }
}

// Get all rounds
export async function getAllRounds(): Promise<IRound[]> {
  try {
    await connectDB();

    const rounds: any = await Round.find({}).sort({ createdAt: -1 });

    const roundDatas = JSON.parse(JSON.stringify(rounds));
    const companies = await Company.find();
    // const companyIds: any = rounds.map((round: any) => round.companyId);
    // const companies = await Company.find({ _id: { $in: companyIds } });

    const companyMap = companies.reduce((acc: any, company: any) => {
      acc[company._id] = company.name;
      return acc;
    }, {});

    roundDatas.forEach((round: any) => {
      round.companyName = companyMap[round.companyId] || "Unknown Company";
    });

    return JSON.parse(JSON.stringify(roundDatas));
  } catch (error: any) {
    console.error("Failed to fetch rounds:", error);
    throw new Error(error.message || "Failed to fetch rounds");
  }
}

export async function getCompanyRounds(companyId: string): Promise<IRound[]> {
  try {
    await connectDB();

    const rounds: any = await Round.find({ companyId: companyId }).sort({
      createdAt: -1,
    });

    const roundDatas = JSON.parse(JSON.stringify(rounds));
    const companies = await Company.find();
    // const companyIds: any = rounds.map((round: any) => round.companyId);
    // const companies = await Company.find({ _id: { $in: companyIds } });

    const companyMap = companies.reduce((acc: any, company: any) => {
      acc[company._id] = company.name;
      return acc;
    }, {});

    roundDatas.forEach((round: any) => {
      round.companyName = companyMap[round.companyId] || "Unknown Company";
    });

    return JSON.parse(JSON.stringify(roundDatas));
  } catch (error: any) {
    console.error("Failed to fetch rounds:", error);
    throw new Error(error.message || "Failed to fetch rounds");
  }
}

// Get a single round by ID
export async function getRoundById(id: string) {
  try {
    await connectDB();

    const round: any = await Round.findById(id);
    const company = await Company.findById(round?.companyId);

    const roundData = JSON.parse(JSON.stringify(round));
    const companyData = JSON.parse(JSON.stringify(company));
    if (companyData) {
      roundData.companyName = companyData.name;
    }

    return JSON.parse(JSON.stringify(roundData));
  } catch (error: any) {
    console.log("Error fetching round:", error);
    // throw new Error(error.message || `Failed to fetch round with ID ${id}`);
  }
}

// Update a round
export async function updateRound(
  id: string,
  data: Partial<RoundFormData>
): Promise<IRound | null> {
  try {
    await connectDB();

    const round = await Round.findById(id);
    if (!round) {
      throw new Error(`Round with ID ${id} not found`);
    }

    // Update fields
    Object.assign(round, data);

    await round.save();
    revalidatePath(`/round/${id}`);
    revalidatePath("/rounds");
    return JSON.parse(JSON.stringify(round));
  } catch (error: any) {
    console.error(`Failed to update round with ID ${id}:`, error);
    throw new Error(error.message || `Failed to update round with ID ${id}`);
  }
}

// Delete a round
export async function deleteRound(id: string): Promise<{ success: boolean }> {
  try {
    await connectDB();

    const result = await Round.findByIdAndDelete(id);
    if (!result) {
      throw new Error(`Round with ID ${id} not found`);
    }

    revalidatePath("/rounds");
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to delete round with ID ${id}:`, error);
    throw new Error(error.message || `Failed to delete round with ID ${id}`);
  }
}

// Add an investor to a round
export async function addInvestor(
  roundId: string,
  investor: { name: string; amount: string }
): Promise<IRound | null> {
  try {
    await connectDB();

    const round = await Round.findById(roundId);
    if (!round) {
      throw new Error(`Round with ID ${roundId} not found`);
    }

    // Create new investor
    const newInvestor = {
      id: `i-${Date.now()}`,
      name: investor.name,
      amount: investor.amount,
      date: new Date().toISOString().split("T")[0],
    };

    // Add to investors array
    round.investors.push(newInvestor);

    // Update raised amount
    const currentRaised =
      Number.parseInt(round.raisedAmount.replace(/[^0-9]/g, "")) || 0;
    const investorAmount =
      Number.parseInt(investor.amount.replace(/[^0-9]/g, "")) || 0;
    round.raisedAmount = `USD ${currentRaised + investorAmount}`;

    await round.save();
    revalidatePath(`/round/${roundId}`);
    revalidatePath("/rounds");
    return JSON.parse(JSON.stringify(round));
  } catch (error: any) {
    console.error(`Failed to add investor to round ${roundId}:`, error);
    throw new Error(
      error.message || `Failed to add investor to round ${roundId}`
    );
  }
}
