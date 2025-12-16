import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  const sections = [
    { name: "about", label: "About", path: "/admin/about" },
    { name: "contact", label: "Contact", path: "/admin/contact" },
    { name: "project", label: "Projects", path: "/admin/project" },
    { name: "experience", label: "Experience", path: "/admin/experience" },
    { name: "education", label: "Education", path: "/admin/education" },
    { name: "skill", label: "Skills", path: "/admin/skill" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">CMS Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link
            key={section.name}
            to={section.path}
            className="block p-6 border rounded-lg hover:shadow-lg hover:border-blue-500 transition-all"
          >
            <h2 className="text-xl font-semibold mb-2">{section.label}</h2>
            <p className="text-gray-600 text-sm">
              Manage {section.label.toLowerCase()}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
