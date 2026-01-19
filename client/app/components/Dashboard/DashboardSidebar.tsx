"use client";

import React, { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HiOutlineHome, 
  HiOutlineOfficeBuilding, 
  HiOutlineKey, 
  HiOutlineStar, 
  HiOutlineQuestionMarkCircle, 
  HiOutlineCog,
  HiOutlineMap,
  HiX
} from "react-icons/hi";
import Logo from "../../assets/logo.png";
import Image from "next/image";

interface DashboardSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const sidebarItems = [
  {
    name: "Overview",
    url: "/hostel-dashboard",
    icon: HiOutlineHome,
  },
  {
    name: "My Hostel",
    url: "/hostel-dashboard/my-hostel",
    icon: HiOutlineOfficeBuilding,
  },
  {
    name: "Rooms (3)",
    url: "/hostel-dashboard/rooms",
    icon: HiOutlineKey,
  },
  {
    name: "Reviews",
    url: "/hostel-dashboard/reviews",
    icon: HiOutlineStar,
  },
  {
    name: "Q&A",
    url: "/hostel-dashboard/questions",
    icon: HiOutlineQuestionMarkCircle,
  },
  {
    name: "Settings",
    url: "/hostel-dashboard/settings",
    icon: HiOutlineCog,
  },
];

const DashboardSidebar: FC<DashboardSidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#2c1b13] dark:bg-[#2c1b13] text-[#fcf2e9] border-r border-white/10 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-[#fcf2e9] flex items-center justify-center">
                 <Image src={Logo} alt="Logo" width={24} height={24} />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-[#fcf2e9]">
                HOSTELITE
              </span>
            </Link>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <HiX size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive 
                      ? "bg-[#fcf2e9] text-[#2c1b13] shadow-lg font-bold" 
                      : "text-[#fcf2e9]/70 hover:bg-white/5 hover:text-[#fcf2e9] font-medium"
                  }`}
                >
                  <item.icon size={22} className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="font-body text-sm tracking-wide">{item.name}</span>
                  
                  {isActive && (
                    <div className="absolute right-4 w-2 h-2 rounded-full bg-[#2c1b13] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 bg-[#251610]">
             <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs uppercase tracking-widest opacity-50 font-bold mb-1">Role</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-bold text-sm">Hostel Manager</span>
                </div>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
