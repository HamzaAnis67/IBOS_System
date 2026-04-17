import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { premiumCard } from "@/lib/styles";

export default function ClientDashboard() {
  return (
    <DashboardLayout role="client">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome Back 👋</h1>
        <p className="text-white/50 text-sm">
          Track your projects, invoices and progress
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <Card className={premiumCard}>
          <h3 className="font-semibold mb-2">Active Projects</h3>
          <p className="text-sm text-white/60">3 ongoing</p>
        </Card>

        <Card className={premiumCard}>
          <h3 className="font-semibold mb-2">Invoices</h3>
          <p className="text-sm text-white/60">2 pending</p>
        </Card>

        <Card className={premiumCard}>
          <h3 className="font-semibold mb-2">Completed</h3>
          <p className="text-sm text-white/60">5 projects</p>
        </Card>

      </div>

      {/* PROJECT SECTION */}
      <Card className={premiumCard}>
        <h3 className="font-semibold mb-3">Website Redesign</h3>

        <Progress value={70} className="h-2 bg-white/10" />

        <div className="flex justify-between mt-2 text-xs text-white/50">
          <span>Progress</span>
          <span>70%</span>
        </div>
      </Card>

    </DashboardLayout>
  );
}