import { geDashboardStats } from "@/app/actions/dashboardStat";
import { DashboardPage } from "@/components/dashboard-page";

export default async function Dashboard() {
  const stats = await geDashboardStats();

  return <DashboardPage stats={stats} />;
}
