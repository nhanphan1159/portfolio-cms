import { useState } from "react";

import { AdminMainContent } from "@/components/admin/AdminMainContent";
import { MobileMenuButton } from "@/components/admin/MobileMenuButton";
import { MobileOverlay } from "@/components/admin/MobileOverlay";
import { Sidebar } from "@/components/admin/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SECTIONS } from "@/constants/section";
import { useMatchRoute } from "@tanstack/react-router";

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const matchRoute = useMatchRoute();

  const isActiveRoute = (path: string) => {
    return matchRoute({ to: path }) !== false;
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <MobileMenuButton
          isOpen={isMobileMenuOpen}
          onClick={handleMenuToggle}
        />
        <MobileOverlay
          isOpen={isMobileMenuOpen}
          onClose={handleCloseMobileMenu}
        />
        <Sidebar
          isOpen={isMobileMenuOpen}
          sections={SECTIONS}
          isActiveRoute={isActiveRoute}
          onLinkClick={handleCloseMobileMenu}
        />
        <AdminMainContent />
      </div>
    </ProtectedRoute>
  );
}
