import AboutManager from "@/components/CMS/AboutManager";
import { createFileRoute, type FileRoutesByPath } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/admin/about" as unknown as keyof FileRoutesByPath
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 fixed top-6 left-6 bg-white z-20">
        Manage About
      </h1>
      <AboutManager />
    </div>
  );
}
