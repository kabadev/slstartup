import { Suspense } from "react";
import InvestorDirectory from "@/components/investor-directory";
import InvestorSkeleton from "@/components/investor-skeleton";

export default function InvestorsPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Investor Directory</h1>
      <p className="text-muted-foreground mb-8">
        Browse our network of investors and filter by sector, location, stage,
        and more.
      </p>

      <Suspense fallback={<InvestorSkeleton />}>
        <InvestorDirectory />
      </Suspense>
    </main>
  );
}
