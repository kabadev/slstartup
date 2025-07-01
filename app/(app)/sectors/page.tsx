import { getSectorGrowght, getSectors } from "@/app/actions/sectors";
import { SectorsPage } from "@/components/sectors-page";

export default async function Sectors() {
  const listsectors = await getSectors();
  const { data, sectors } = await getSectorGrowght();

  return (
    <SectorsPage
      sectors={listsectors}
      chartData={data}
      displayedSectors={sectors}
    />
  );
}
