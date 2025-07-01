"use server";

import { currentUser } from "@clerk/nextjs/server";
import { connect } from "@/lib/mongoDB";
import Company from "@/models/Company";

export async function getSectors() {
  //   try {
  // const user = await currentUser();
  try {
    await connect();
    // await connectToDB();

    // Aggregate companies by sector and count them
    const sectors = await Company.aggregate([
      {
        $group: {
          _id: "$sector",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 }, // sort by most companies
      },
    ]);

    // Add trending & emerging logic
    const trending = sectors.slice(0, 4);
    const emerging = sectors.slice(-4);

    return JSON.parse(
      JSON.stringify({
        sucess: true,
        all: sectors,
        trending,
        emerging,
      })
    );
  } catch (error) {
    console.error("[SECTORS_API_ERROR]", error);
    return { sucess: false, error: "Internal Server Error" };
  }
}

export async function getSectorGrowght() {
  //   try {
  // const user = await currentUser();
  try {
    await connect();
    // await connectToDB();
    // Get sector + year + count
    const result = await Company.aggregate([
      {
        $match: {
          createdAt: { $exists: true },
          sector: { $exists: true, $ne: "" },
        },
      },
      {
        $project: {
          year: { $year: "$createdAt" },
          sector: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", sector: "$sector" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1 },
      },
    ]);

    // Transform to { year: 2022, Agriculture: 10, Healthcare: 5, ... }
    const growthMap: Record<string, any> = {};
    const sectorSet = new Set<string>();

    result.forEach(({ _id, count }) => {
      const year = _id.year;
      const sector = _id.sector;
      sectorSet.add(sector);

      if (!growthMap[year]) growthMap[year] = { year: String(year) };
      growthMap[year][sector] = count;
    });

    const data = Object.values(growthMap);
    const sectors = Array.from(sectorSet);

    return JSON.parse(
      JSON.stringify({
        sucess: true,
        data,
        sectors,
      })
    );
  } catch (error) {
    console.error("[SECTORS_API_ERROR]", error);
    return { sucess: false, error: "Internal Server Error" };
  }
}
