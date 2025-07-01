import { getRoundById } from "@/app/actions/round-actions";
import RoundEdit from "@/components/round-edit";
import { RoundFormData } from "@/types/types";

export default async function RoundEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    throw new Error("Round ID is required");
  }

  const round = await getRoundById(id);

  return <RoundEdit round={round!} />;
}
