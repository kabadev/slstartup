// import RoundsTable from "@/rounds-table";
import { getAllRounds } from "@/app/actions/round-actions";
import RoundsTable from "@/components/rounds-table";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { Plus, PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function RoundsPage() {
  const user = await currentUser();
  let loading = true;
  const rounds = await getAllRounds();
  loading = false;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 p-10 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Funding Rounds</h1>
          <p className="text-muted-foreground">
            Current funding status and requirements
          </p>
        </div>
        <div className="flex gap-2">
          {user?.publicMetadata.role === "company" && (
            <Link href={"/rounds/new"}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Funding Round
              </Button>
            </Link>
          )}
        </div>
      </div>
      <RoundsTable rounds={rounds} loading={loading} />;
    </div>
  );
}
