import { getInterestDetails } from "@/app/actions/investor-interest-action";

import InvestmentInterestDetail from "@/components/investment-interest-detail";

export default async function InterestDetailPage({
  params,
}: {
  params: Promise<{ interestId: string }>;
}) {
  const interestId = (await params).interestId;

  const interest = await getInterestDetails(interestId);

  return (
    <main className="px-4 py-10 ">
      <InvestmentInterestDetail interest={interest?.interest} />
    </main>
  );
}
