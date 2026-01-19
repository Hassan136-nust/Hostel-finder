"use client";

import React, { useState } from "react";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import Protected from "../hooks/useProtected";
import Heading from "../utils/Heading";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Protected>
      <Heading
        title="Hostel Dashboard | Hostelite"
        description="Manage your hostel, rooms, and bookings"
        keywords="hostel dashboard, management, manager"
      />
      <div className="flex h-screen overflow-hidden bg-[#fcf2e9] dark:bg-[#1f1710] transition-colors duration-300">
        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Content Area */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden ml-0 lg:ml-72 transition-all duration-300">
          {/* Header */}
          <DashboardHeader setSidebarOpen={setSidebarOpen} />

          {/* Main Content */}
          <main className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pb-20">
            {children}
          </main>
        </div>
      </div>
    </Protected>
  );
};

export default DashboardLayout;
