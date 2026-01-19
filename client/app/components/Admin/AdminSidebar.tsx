"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HiOutlineHome,
    HiOutlineOfficeBuilding,
    HiOutlineUsers,
    HiOutlineBell,
    HiOutlineX,
    HiOutlineChartBar,
    HiOutlineShieldCheck,
    HiOutlineSpeakerphone,
    HiOutlineCog
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useGetPendingRequestsQuery } from "@/redux/features/admin/adminApi";

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
    const pathname = usePathname();
    const { data: requestsData } = useGetPendingRequestsQuery(undefined);
    const pendingCount = requestsData?.requests?.length || 0;

    const menuItems = [
        {
            title: "Overview",
            href: "/admin-dashboard",
            icon: HiOutlineHome
        },
        {
            title: "Hostels",
            href: "/admin-dashboard/hostels",
            icon: HiOutlineOfficeBuilding
        },
        {
            title: "Users",
            href: "/admin-dashboard/users",
            icon: HiOutlineUsers
        },
        {
            title: "Manager Requests",
            href: "/admin-dashboard/requests",
            icon: HiOutlineBell,
            badge: pendingCount
        },
        {
            title: "Moderation",
            href: "/admin-dashboard/moderation",
            icon: HiOutlineShieldCheck
        },
        {
            title: "Announcements",
            href: "/admin-dashboard/announcements",
            icon: HiOutlineSpeakerphone
        },
        {
            title: "Platform Settings",
            href: "/admin-dashboard/settings",
            icon: HiOutlineCog
        }
    ];

    const isActive = (href: string) => {
        if (href === "/admin-dashboard") {
            return pathname === href;
        }
        return pathname?.startsWith(href);
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1a1a2e] border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
                        <Link href="/admin-dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <HiOutlineChartBar size={20} className="text-white" />
                            </div>
                            <div>
                                <span className="font-heading font-bold text-white text-lg">Admin</span>
                                <p className="text-[10px] text-white/50 uppercase tracking-widest">Dashboard</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-xl hover:bg-white/10 lg:hidden transition-colors text-white"
                        >
                            <HiOutlineX size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                                    isActive(item.href)
                                        ? "bg-gradient-to-r from-purple-500/20 to-indigo-600/20 text-purple-400 border border-purple-500/30"
                                        : "text-white/60 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <item.icon size={20} className={isActive(item.href) ? "text-purple-400" : ""} />
                                <span className="font-medium">{item.title}</span>
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="ml-auto px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Back to Site */}
                    <div className="p-4 border-t border-white/10">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            ← Back to Site
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
