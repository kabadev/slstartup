import { getPendingInvestors } from "@/app/actions/investor-actions";
import { InvestorApprovalsTableClient } from "./investor-approvals-table-client";

export async function InvestorApprovalsTable() {
  const investors = await getPendingInvestors();

  return <InvestorApprovalsTableClient investors={investors} />;
}
