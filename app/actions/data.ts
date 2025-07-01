"use server";

import { connect } from "@/lib/mongoDB";
import Company from "@/models/Company";
import { revalidatePath } from "next/cache";

export const getAllData = async () => {
  try {
    await connect();
    const company = await Company.find();

    return company;
  } catch (error) {}
};
