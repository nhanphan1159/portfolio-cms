import type { Section } from "@/components/admin/types";
import { Link } from "@tanstack/react-router";

interface SidebarNavigationProps {
  sections: Section[];
  isActiveRoute: (path: string) => boolean;
  onLinkClick: () => void;
}

export function SidebarNavigation({
  sections,
  isActiveRoute,
  onLinkClick,
}: SidebarNavigationProps) {
  return (
    <nav className="flex-1 overflow-y-auto p-4">
      <ul className="space-y-2">
        {sections.map((section) => {
          const isActive = isActiveRoute(section.path);
          return (
            <li key={section.name}>
              <Link
                to={section.path}
                onClick={onLinkClick}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
