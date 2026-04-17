import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { premiumCard } from "@/lib/styles";

const projects = [
  {
    id: 1,
    title: "Website Redesign",
    status: "In Progress",
    progress: 70,
    deadline: "Dec 20, 2026",
  },
];

export default function ClientProjectsPage() {
  return (
    <DashboardLayout role="client">
      <h1 className="text-2xl font-bold mb-6">My Projects</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={premiumCard}          
            >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold">{project.title}</h2>

              <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300">
                {project.status}
              </span>
            </div>

            {/* PROGRESS */}
            <div className="space-y-2 mb-4">
              <Progress value={project.progress} className="h-2" />

              <p className="text-sm text-white/60">
                {project.progress}% complete
              </p>
            </div>

            {/* FOOTER INFO */}
            <div className="flex justify-between text-sm text-white/60">
              <span>Deadline</span>
              <span className="text-white/80">{project.deadline}</span>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}