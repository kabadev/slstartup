import { getInvestorByIdAction } from "@/app/actions/investor-actions";
import InvestorEditForm from "@/components/investor-edit-form";

export default async function InvestorEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  // Find company by ID from the params
  const { investor } = await getInvestorByIdAction(id);

  return (
    <div className="p-6">
      <InvestorEditForm investor={investor} />
    </div>
  );
}
