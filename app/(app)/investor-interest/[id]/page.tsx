import { getInvestorByIdAction } from "@/app/actions/investor-actions";
import { getRoundById } from "@/app/actions/round-actions";
import InvestorInterestForm from "@/components/investor-interest-form";
import { currentUser } from "@clerk/nextjs/server";
import { useParams } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await currentUser();
  const userId: any = user?.publicMetadata?.companyId!;
  const roundData = await getRoundById(id);
  const investor = await getInvestorByIdAction(userId);

  return (
    <main className="px-4 py-10 ">
      <div className="">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Investment Interest
        </h1>
        <p className="mb-8 text-muted-foreground">
          Please complete this form to express your interest in investing in our
          startup.
        </p>
        <InvestorInterestForm investor={investor.investor} round={roundData} />
      </div>
    </main>
  );
}
