import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { ProtectedRoute } from "./ProtectedRoute";

export const AdminLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
};
