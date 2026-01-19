"use client";

import React, { FC } from "react";
import { HiOutlineMenuAlt2, HiOutlineBell, HiOutlineSearch } from "react-icons/hi";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { useSelector } from "react-redux";
import Image from "next/image";

interface DashboardHeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ setSidebarOpen }) => {
  const { user } = useSelector((state: any) => state.auth);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 py-4 bg-[#fcf2e9]/80 dark:bg-[#1f1710]/80 backdrop-blur-xl border-b border-[#2c1b13]/10 dark:border-white/10 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-xl text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-black/5 dark:hover:bg-white/5 lg:hidden transition-colors"
        >
          <HiOutlineMenuAlt2 size={24} />
        </button>

        <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-white/50 dark:bg-black/20 rounded-full border border-[#2c1b13]/10 dark:border-white/10 w-64 focus-within:w-80 transition-all duration-300">
            <HiOutlineSearch size={20} className="text-[#2c1b13]/50 dark:text-[#fcf2e9]/50" />
            <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm font-body w-full text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/40 dark:placeholder:text-[#fcf2e9]/40"
            />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        
        <button className="relative p-2 rounded-full text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <HiOutlineBell size={24} />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-[#fcf2e9] dark:border-[#1f1710]" />
        </button>

        <div className="h-8 w-[1px] bg-[#2c1b13]/10 dark:bg-white/10 mx-2 hidden sm:block" />

        <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold font-heading text-[#2c1b13] dark:text-[#fcf2e9]">{user?.name}</p>
                <p className="text-xs font-body text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">Manager</p>
            </div>
            
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#2c1b13]/10 dark:border-white/10 shadow-sm">
                 {user?.avatar?.url ? (
                    <Image
                        src={user.avatar.url}
                        alt={user.name}
                        fill
                        className="object-cover"
                    />
                 ) : (
                    <div className="w-full h-full bg-[#2c1b13] flex items-center justify-center text-[#fcf2e9] font-bold text-sm">
                        {user?.name?.charAt(0)}
                    </div>
                 )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
