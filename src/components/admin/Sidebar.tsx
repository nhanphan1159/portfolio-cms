import { SidebarFooter } from "@/components/admin/SidebarFooter";
import { SidebarHeader } from "@/components/admin/SidebarHeader";
import { SidebarNavigation } from "@/components/admin/SidebarNavigation";
import type { Section } from "@/components/admin/types";

interface SidebarProps {
  isOpen: boolean;
  sections: Section[];
  isActiveRoute: (path: string) => boolean;
  onLinkClick: () => void;
}

export function Sidebar({
  isOpen,
  sections,
  isActiveRoute,
  onLinkClick,
}: SidebarProps) {
  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="flex flex-col h-full">
        <SidebarHeader />
        <SidebarNavigation
          sections={sections}
          isActiveRoute={isActiveRoute}
          onLinkClick={onLinkClick}
        />
        <SidebarFooter />
      </div>
    </aside>
  );
}
