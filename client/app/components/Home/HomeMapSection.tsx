"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useGetAllHostelsQuery } from "@/redux/features/hostel/hostelApi";
import { motion } from "framer-motion";

const HostelSearchMap = dynamic(() => import("../HostelSearchMap"), {
    ssr: false,
    loading: () => <div className="w-full h-[500px] bg-gray-100 rounded-3xl animate-pulse" />
});

const HomeMapSection = () => {
    const { data } = useGetAllHostelsQuery({});
    const hostels = data?.hostels || [];

    return (
        <section className="py-20 px-6 md:px-12 bg-white dark:bg-[#1a0f0a]">
            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div>
                        <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-6"
                        >
                            Explore by <span className="italic font-light">Location</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 text-lg mb-8 max-w-lg"
                        >
                            Find the perfect hostel in your preferred area. Use our interactive map to see prices and locations at a glance.
                        </motion.p>
                        
                        <Link href="/hostels">
                            <motion.button 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                View Full Map
                                <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </div>

                    {/* Right Column: Map */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#2c1b13]"
                    >
                        <HostelSearchMap hostels={hostels} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HomeMapSection;
