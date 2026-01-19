"use client";

import React, { useState } from "react";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminHeader from "../components/Admin/AdminHeader";
import Protected from "../hooks/useProtected";
import Heading from "../utils/Heading";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();

  // Redirect non-admins
  if (user && user.role !== "admin") {
    router.push("/");
    return null;
  }

  return (
    <Protected>
      <Heading
        title="Admin Dashboard | Hostelite"
        description="Admin panel for managing users, hostels, and platform"
        keywords="admin, dashboard, management"
      />
      <div className="flex h-screen overflow-hidden bg-[#0f0f1a] transition-colors duration-300">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Content Area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden ml-0 lg:ml-72 transition-all duration-300">
          {/* Header */}
          <AdminHeader setSidebarOpen={setSidebarOpen} />

          {/* Main Content */}
          <main className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pb-20 text-white">
            {children}
          </main>
        </div>
      </div>
    </Protected>
  );
};

export default AdminLayout;
