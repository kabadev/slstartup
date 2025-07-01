import { getCompanyByIdAction } from "@/app/actions/company-actions";
import CompanyDetailsPage from "@/components/company-details";

export default async function CompanyDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Find company by ID from the params

  const company = await getCompanyByIdAction(id);

  return (
    <div className="">
      <CompanyDetailsPage company={company} />
    </div>
  );
}
