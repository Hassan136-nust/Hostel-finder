"use client";

import React, { FC } from "react";
import { HiOutlineMenuAlt2, HiOutlineBell } from "react-icons/hi";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { useGetPendingRequestsQuery } from "@/redux/features/admin/adminApi";

interface AdminHeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

const AdminHeader: FC<AdminHeaderProps> = ({ setSidebarOpen }) => {
  const { user } = useSelector((state: any) => state.auth);
  const { data: requestsData } = useGetPendingRequestsQuery(undefined);
  const pendingCount = requestsData?.requests?.length || 0;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 py-4 bg-[#1a1a2e]/80 backdrop-blur-xl border-b border-white/10 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-xl text-white hover:bg-white/10 lg:hidden transition-colors"
        >
          <HiOutlineMenuAlt2 size={24} />
        </button>

        <div className="hidden md:block">
          <h2 className="text-lg font-heading font-bold text-white">
            Admin Dashboard
          </h2>
          <p className="text-sm text-white/50">
            Platform Management
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href="/admin-dashboard/requests"
          className="relative p-2 rounded-full text-white hover:bg-white/10 transition-colors"
        >
          <HiOutlineBell size={24} />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
              {pendingCount > 9 ? "9+" : pendingCount}
            </span>
          )}
        </Link>

        <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

        <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold font-heading text-white">{user?.name}</p>
                <p className="text-xs font-body text-white/50">Administrator</p>
            </div>
            
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-sm">
                 {user?.avatar?.url ? (
                    <Image
                        src={user.avatar.url}
                        alt={user.name}
                        fill
                        className="object-cover"
                    />
                 ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.charAt(0)}
                    </div>
                 )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
