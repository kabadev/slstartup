"use server";

import { connect } from "@/lib/mongoDB";
import Company from "@/models/Company";
import Investor from "@/models/Investor";
import InvestorInterest from "@/models/InvestorInterest";
import Round from "@/models/Round";
import { sendNotification } from "./notification";
import { currentUser } from "@clerk/nextjs/server";

export async function createInterest(formData: any) {
  try {
    await connect();
    const user = await currentUser();
    const newInterest = new InvestorInterest(formData);

    const saveNewInterest = await newInterest.save();

    // companyId: round.companyId,
    //     userId: investor.userId,
    //     investorId: investor._id,
    //     roundId: round._id,

    const investor = await Investor.findOne({ userId: user?.id });

    await sendNotification({
      title: "new investor show interest for you fundng round",
      desc: `${investor?.name} has showed interest for yourne fonding round. `,
      from: user?.id,
      to: formData.companyUserId,
      url: `/investor-interest/interest/${saveNewInterest._id}`,
    });

    return JSON.parse(
      JSON.stringify({ success: true, interestId: saveNewInterest._id })
    );
  } catch (error) {
    console.error("Error submitting investor interest:", error);
    return {
      error: "Failed to submit investor interest",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getInterestDetails(id: string) {
  try {
    await connect();

    const interest = await InvestorInterest.findById(id);
    const round = await Round.findById(interest.roundId);
    const company = await Company.findById(interest.companyId);
    const investor = await Investor.findById(interest.investorId);
    const interestDoc = JSON.parse(JSON.stringify(interest));
    const roundDoc = JSON.parse(JSON.stringify(interest));
    const companyDoc = JSON.parse(JSON.stringify(company));
    const investorDoc = JSON.parse(JSON.stringify(investor));
    const interestData = {
      ...interestDoc,
      round: {
        name: round?.roundTitle,
        id: round?._id,
      },
      companyData: {
        name: companyDoc?.name,
        logo: companyDoc?.logo,
        id: companyDoc?._id,
      },
      investor: {
        name: investorDoc?.name,
        logo: investorDoc?.logo,
        id: investorDoc?._id,
      },
    };

    const interestJson = JSON.parse(JSON.stringify(interestData));

    return { success: true, interest: interestJson };
  } catch (error) {
    console.error("Error Fetching investor interest:", error);
    return {
      error: "Failed to Fetching investor interest",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
export async function updateInterestData(id: string, data: any) {
  try {
    await connect();

    const interest = await InvestorInterest.findById(id);

    interest.status = data.status;
    interest.responseMessage = data.responseMessage;
    interest.termSheet = data.termSheet;

    const saveData = await interest.save();
    const company = await Company.findById(interest.companyId);

    await sendNotification({
      title: "Company respond to your investment interest",
      desc: `${company?.name} has respond to the interest you have show for their funding rounds `,
      from: company?.company.userid,
      to: interest.userId,
      url: `/investor-interest/interest/${interest._id}`,
    });

    return JSON.parse(JSON.stringify({ success: true, interest: saveData }));
  } catch (error) {
    console.error("Error Fetching investor interest:", error);
    return {
      error: "Failed to Fetching investor interest",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getInterestsByRoundId(roundId: string) {
  try {
    await connect();

    const interests = await InvestorInterest.find({ roundId: roundId });

    return JSON.parse(JSON.stringify({ success: true, interests: interests }));
  } catch (error) {
    console.log("error:", error);
  }
}

export async function getInterestsByUserId(id: string) {}
