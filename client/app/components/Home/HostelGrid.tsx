"use client";

import React from "react";
import Link from "next/link";
import { useGetAllHostelsQuery } from "@/redux/features/hostel/hostelApi";
import { 
    HiOutlineLocationMarker, 
    HiOutlineStar, 
    HiOutlineUsers,
    HiOutlineArrowRight,
    HiOutlineOfficeBuilding
} from "react-icons/hi";
import { motion } from "framer-motion";

const HostelGrid = () => {
    const { data, isLoading } = useGetAllHostelsQuery({});
    const hostels = data?.hostels || [];

    if (isLoading) {
        return (
            <section className="py-24 px-6 md:px-12 bg-[#fcf2e9] dark:bg-[#1a0f0a]">
                <div className="max-w-[1440px] mx-auto">
                    <div className="text-center mb-16">
                        <div className="h-8 w-48 bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 rounded-full mx-auto mb-4 animate-pulse" />
                        <div className="h-12 w-96 bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 rounded-2xl mx-auto animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white/50 dark:bg-black/20 rounded-4xl h-[420px] animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 px-6 md:px-12 bg-[#fcf2e9] dark:bg-[#1a0f0a] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#fcf2e9] dark:from-[#2c1b13] to-transparent" />
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 rounded-full blur-3xl" />

            <div className="max-w-[1440px] mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 text-sm font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">
                        <HiOutlineOfficeBuilding size={16} />
                        Featured Hostels
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                        Discover Premium <span className="italic font-light">Living Spaces</span>
                    </h2>
                    <p className="mt-4 text-lg text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 max-w-2xl mx-auto">
                        Browse through our curated collection of hostels with top-notch amenities and prime locations
                    </p>
                </motion.div>

                {hostels.length === 0 ? (
                    <div className="text-center py-20">
                        <HiOutlineOfficeBuilding size={64} className="mx-auto text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                        <h3 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                            No Hostels Yet
                        </h3>
                        <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                            Be the first to list your hostel!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hostels.map((hostel: any, index: number) => (
                            <motion.div
                                key={hostel._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link href={`/hostels/${hostel._id}`}>
                                    <div className="group bg-white dark:bg-[#2c1b13] rounded-4xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#2c1b13]/5 dark:border-white/5">
                                        <div className="relative h-56 overflow-hidden">
                                            {hostel.images?.[0] ? (
                                                <img 
                                                    src={hostel.images[0].url} 
                                                    alt={hostel.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#2c1b13]/20 to-[#2c1b13]/10 dark:from-[#fcf2e9]/10 dark:to-[#fcf2e9]/5 flex items-center justify-center">
                                                    <HiOutlineOfficeBuilding size={48} className="text-[#2c1b13]/30 dark:text-[#fcf2e9]/30" />
                                                </div>
                                            )}
                                            
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
                                                    hostel.type === 'Boys' 
                                                        ? 'bg-blue-500/80 text-white' 
                                                        : hostel.type === 'Girls' 
                                                        ? 'bg-pink-500/80 text-white'
                                                        : 'bg-purple-500/80 text-white'
                                                }`}>
                                                    <HiOutlineUsers className="inline mr-1" size={12} />
                                                    {hostel.type}
                                                </span>
                                            </div>

                                            {hostel.rating > 0 && (
                                                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white">
                                                    <HiOutlineStar className="fill-yellow-400 text-yellow-400" size={14} />
                                                    <span className="text-sm font-bold">{hostel.rating.toFixed(1)}</span>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] group-hover:text-[#2c1b13]/80 dark:group-hover:text-[#fcf2e9]/80 transition-colors line-clamp-1">
                                                {hostel.name}
                                            </h3>

                                            <div className="flex items-center gap-2 mt-2 text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                                                <HiOutlineLocationMarker size={16} className="flex-shrink-0" />
                                                <span className="text-sm line-clamp-1">{hostel.address}, {hostel.city}</span>
                                            </div>

                                            {hostel.tags && hostel.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {hostel.tags.slice(0, 2).map((tag: string, i: number) => (
                                                        <span 
                                                            key={i}
                                                            className="px-2.5 py-1 rounded-lg bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-xs font-medium text-[#2c1b13]/70 dark:text-[#fcf2e9]/70"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {hostel.tags.length > 2 && (
                                                        <span className="px-2.5 py-1 text-xs font-medium text-[#2c1b13]/40 dark:text-[#fcf2e9]/40">
                                                            +{hostel.tags.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#2c1b13]/10 dark:border-white/10">
                                                <div>
                                                    <span className="text-xs text-[#2c1b13]/40 dark:text-[#fcf2e9]/40">Starting from</span>
                                                    <p className="text-xl font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                                        {hostel.minPrice ? `PKR ${hostel.minPrice.toLocaleString()}` : 'Contact for Price'}
                                                        {hostel.minPrice && <span className="text-sm font-normal opacity-60">/mo</span>}
                                                    </p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] group-hover:scale-110 transition-transform">
                                                    <HiOutlineArrowRight size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {hostels.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-16"
                    >
                        <Link 
                            href="/hostels"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            View All Hostels
                            <HiOutlineArrowRight size={18} />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default HostelGrid;
