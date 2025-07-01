import { getInterestsByRoundId } from "@/app/actions/investor-interest-action";
import { getRoundById } from "@/app/actions/round-actions";
import RoundDetail from "@/components/round-detail";

export default async function RoundDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    throw new Error("Round ID is required");
  }

  const round = await getRoundById(id);
  const interests = await getInterestsByRoundId(round._id);

  return <RoundDetail round={round!} interests={interests.interests} />;
}
