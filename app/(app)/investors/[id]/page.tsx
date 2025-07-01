import { getInvestorByIdAction } from "@/app/actions/investor-actions";
import InvestorDetails from "@/components/investor-details";

export default async function InvestorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  // Find investor by ID from the params
  const investor: any = await getInvestorByIdAction(id);

  return (
    <div>
      <InvestorDetails investor={investor.investor} />
    </div>
  );
}
