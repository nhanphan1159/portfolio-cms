import ExperienceManager from "@/components/CMS/ExperienceManager";
import { createFileRoute, type FileRoutesByPath } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/admin/experience" as unknown as keyof FileRoutesByPath
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Experience</h1>
      <ExperienceManager />
    </div>
  );
}
