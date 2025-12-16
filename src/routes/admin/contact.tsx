import ContactManager from "@/components/CMS/ContactManager";
import { createFileRoute, type FileRoutesByPath } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/admin/contact" as unknown as keyof FileRoutesByPath
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Contact</h1>
      <ContactManager />
    </div>
  );
}
