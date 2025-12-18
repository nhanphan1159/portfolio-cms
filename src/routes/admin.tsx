import { createFileRoute } from "@tanstack/react-router";

import { AdminLayout } from "../components/admin/AdminLayout";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  beforeLoad: async () => {
    // This will be handled by the component itself
    // Since we need to access auth context
  },
});

function RouteComponent() {
  return <AdminLayout />;
}
