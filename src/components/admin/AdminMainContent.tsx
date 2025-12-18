import { Outlet } from "@tanstack/react-router";

export function AdminMainContent() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
