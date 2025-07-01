"use server";

import { currentUser } from "@clerk/nextjs/server";
import { connect } from "@/lib/mongoDB";
import Company from "@/models/Company";
import Round from "@/models/Round";
import InvestorInterest from "@/models/InvestorInterest";

function parseEmployeesRange(range: string): { min: number; max: number } {
  if (!range) return { min: 0, max: 0 };
  const [minStr, maxStr] = range.split("-").map((v) => v.trim());
  const min = parseInt(minStr);
  const max = parseInt(maxStr || minStr); // Handle single-value range like "100"
  return {
    min: isNaN(min) ? 0 : min,
    max: isNaN(max) ? min : max,
  };
}

export async function geDashboardStats() {
  try {
    await connect();

    const allCompanies = await Company.find({}).sort({ createdAt: -1 });
    const allRounds = await Round.find({});
    const allNewComa = await Company.find({});
    const allIvesments = await InvestorInterest.find({});
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const companiesCUrrentMonth = await Company.find({
      createdAt: { $gte: currentMonth },
    });
    const companiesLastMonth = await Company.find({
      createdAt: { $gte: lastMonth },
    });

    // console.log(oldValue);

    const roundsLastMonth = await Round.find({
      createdAt: { $gte: lastMonth },
    });
    const invesmentsLastMonth = await InvestorInterest.find({
      createdAt: { $gte: lastMonth },
    });

    let totalMin = 0;
    let totalMax = 0;
    let lastMonthMin = 0;
    let lastMonthMax = 0;

    for (const company of allCompanies) {
      const { min, max } = parseEmployeesRange(company.employeesRange || "");
      totalMin += min;
      totalMax += max;
    }

    for (const company of companiesLastMonth) {
      const { min, max } = parseEmployeesRange(company.employeesRange || "");
      lastMonthMin += min;
      lastMonthMax += max;
    }

    // const percentChange = (current: number, last: number) =>
    //   last === 0 ? 100 : +(((current - last) / last) * 100).toFixed(1);

    function percentChange(newValue: number, oldValue: number): number {
      const change = newValue - oldValue;
      const percentageChange = (change / oldValue) * 100;
      return parseFloat(percentageChange.toFixed(2));
    }

    return JSON.parse(
      JSON.stringify({
        companies: {
          total: allCompanies.length,
          change: percentChange(
            companiesCUrrentMonth.length,
            companiesLastMonth.length
          ),
        },
        rounds: {
          total: allRounds.length,
          change: percentChange(allRounds.length, roundsLastMonth.length),
        },
        employees: {
          average: Math.round((totalMin + totalMax) / 2),
          range: `${totalMin}-${totalMax}`,
          change: percentChange(
            Math.round((totalMin + totalMax) / 2),
            Math.round((lastMonthMin + lastMonthMax) / 2)
          ),
        },
        vcInvestment: {
          total: allIvesments.length,
          change: percentChange(
            allIvesments.length,
            invesmentsLastMonth.length
          ),
        },
        hotCompanys: allCompanies.slice(0, 4),
        allNewComa: allNewComa.slice(4),
      })
    );
  } catch (error) {
    console.error("[DASHBOARD_API_ERROR]", error);
    return { sucess: false, error: "ailed to fetch dashboard stats" };
  }
}
