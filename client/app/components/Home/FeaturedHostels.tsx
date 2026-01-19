"use client";

import React from "react";
import Link from "next/link";
import { useGetFeaturedHostelsQuery } from "@/redux/features/admin/adminApi";
import { HiOutlineStar, HiOutlineLocationMarker, HiOutlineArrowRight } from "react-icons/hi";
import { motion } from "framer-motion";

const FeaturedHostels = () => {
    const { data, isLoading } = useGetFeaturedHostelsQuery(undefined);
    const hostels = data?.hostels || [];

    if (isLoading) {
        return (
            <section className="py-16 px-4 md:px-8 bg-[#fcf2e9] dark:bg-[#1a0f0a]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-[#2c1b13] dark:border-[#fcf2e9] border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    if (hostels.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-4 md:px-8 bg-[#fcf2e9] dark:bg-[#1a0f0a]">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <HiOutlineStar className="text-yellow-500" size={24} />
                            <span className="text-sm font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                                Featured
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                            Top Rated Hostels
                        </h2>
                    </div>
                    <Link
                        href="/hostels"
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-medium hover:scale-105 transition-transform"
                    >
                        View All
                        <HiOutlineArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hostels.slice(0, 6).map((hostel: any, index: number) => {
                        const avgRating = hostel.reviews?.length > 0
                            ? (hostel.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / hostel.reviews.length).toFixed(1)
                            : null;

                        return (
                            <motion.div
                                key={hostel._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/hostels/${hostel._id}`}>
                                    <div className="group bg-white dark:bg-[#2c1b13] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="relative h-48 overflow-hidden">
                                            {hostel.images?.[0]?.url ? (
                                                <img
                                                    src={hostel.images[0].url}
                                                    alt={hostel.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#2c1b13]/20 to-[#2c1b13]/40 flex items-center justify-center">
                                                    <span className="text-4xl">🏠</span>
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500 text-white text-xs font-bold">
                                                <HiOutlineStar size={14} className="fill-white" />
                                                Featured
                                            </div>
                                            {avgRating && (
                                                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/70 text-[#2c1b13] dark:text-white text-sm font-bold">
                                                    <HiOutlineStar size={14} className="text-yellow-500 fill-yellow-500" />
                                                    {avgRating}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg text-[#2c1b13] dark:text-[#fcf2e9] mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                                                {hostel.name}
                                            </h3>
                                            <p className="text-sm text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 flex items-center gap-1">
                                                <HiOutlineLocationMarker size={14} />
                                                {hostel.city}
                                            </p>
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2c1b13]/10 dark:border-[#fcf2e9]/10">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    hostel.type === "Boys" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                                    hostel.type === "Girls" ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" :
                                                    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                }`}>
                                                    {hostel.type}
                                                </span>
                                                <span className="text-sm text-[#2c1b13]/50 dark:text-[#fcf2e9]/50">
                                                    {hostel.reviews?.length || 0} reviews
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                <Link
                    href="/hostels"
                    className="sm:hidden flex items-center justify-center gap-2 mt-8 py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-medium"
                >
                    View All Hostels
                    <HiOutlineArrowRight size={18} />
                </Link>
            </div>
        </section>
    );
};

export default FeaturedHostels;
