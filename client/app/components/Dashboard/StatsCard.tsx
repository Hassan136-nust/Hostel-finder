"use client";

import React, { FC } from "react";
import { IconType } from "react-icons";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  change?: number;
  loading?: boolean;
}

const StatsCard: FC<StatsCardProps> = ({ title, value, icon: Icon, change, loading }) => {
  return (
    <div className="bg-[#fcf2e9] dark:bg-[#2c1b13] p-6 rounded-3xl border border-[#2c1b13]/10 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
            {title}
          </p>
          <h3 className="text-3xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
            {loading ? (
                <div className="h-8 w-24 bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 animate-pulse rounded-md" />
            ) : (
                value
            )}
          </h3>
        </div>
        <div className="p-3 bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 rounded-2xl text-[#2c1b13] dark:text-[#fcf2e9]">
          <Icon size={24} />
        </div>
      </div>
      
      {change !== undefined && (
        <div className="mt-4 flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${change >= 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-[#2c1b13]/50 dark:text-[#fcf2e9]/50 font-medium">from last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
