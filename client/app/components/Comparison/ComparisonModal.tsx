"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiX, HiCheck, HiOutlineMinusSm } from "react-icons/hi";
import { toggleComparisonModal, removeFromCompare } from "@/redux/features/comparison/comparisonSlice";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ComparisonModal = () => {
    const { selectedHostels, isOpen } = useSelector((state: any) => state.comparison);
    const dispatch = useDispatch();

    if (!isOpen) return null;

    const attributes = [
        { label: "Price", render: (h: any) => h.minPrice ? `PKR ${h.minPrice.toLocaleString()}` : "N/A" },
        { label: "Type", render: (h: any) => h.type },
        { label: "Rating", render: (h: any) => h.rating ? `${h.rating.toFixed(1)} / 5` : "New" },
        { label: "City", render: (h: any) => h.city },
        { label: "Facilities", render: (h: any) => (
            <div className="flex flex-wrap gap-1">
                {h.facilities?.slice(0, 5).map((f: string) => (
                    <span key={f} className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md whitespace-nowrap">{f}</span>
                ))}
            </div>
        )}
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => dispatch(toggleComparisonModal(false))}
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative bg-white dark:bg-[#1a0f0a] rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                >
                    <div className="flex items-center justify-between p-6 border-b border-[#2c1b13]/10 dark:border-white/10">
                        <h2 className="text-2xl font-bold text-[#2c1b13] dark:text-[#fcf2e9]">Comparison</h2>
                        <button onClick={() => dispatch(toggleComparisonModal(false))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <HiX size={24} className="text-[#2c1b13] dark:text-[#fcf2e9]" />
                        </button>
                    </div>

                    <div className="overflow-x-auto p-6 flex-1">
                        <table className="w-full min-w-[600px] border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 text-left w-32 md:w-48 text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 font-medium"></th>
                                    {selectedHostels.map((hostel: any) => (
                                        <th key={hostel._id} className="p-4 align-top w-1/3">
                                            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                                                <img src={hostel.images?.[0]?.url} alt={hostel.name} className="w-full h-full object-cover" />
                                                <button 
                                                    onClick={() => dispatch(removeFromCompare(hostel._id))}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                    title="Remove"
                                                >
                                                    <HiX size={14} />
                                                </button>
                                            </div>
                                            <h3 className="text-lg font-bold text-[#2c1b13] dark:text-[#fcf2e9] line-clamp-2 mb-2">{hostel.name}</h3>
                                            <Link 
                                                href={`/hostels/${hostel._id}`}
                                                className="block text-center w-full py-2 rounded-lg bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] text-sm font-bold hover:opacity-90 transition-opacity"
                                            >
                                                View Details
                                            </Link>
                                        </th>
                                    ))}
                                    {/* Empty cells to fill up to 3 columns if needed */}
                                    {[...Array(3 - selectedHostels.length)].map((_, i) => (
                                        <th key={i} className="p-4 align-top w-1/3 opacity-30">
                                            <div className="aspect-video rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-[#2c1b13]/20 flex items-center justify-center">
                                                <span className="text-sm font-bold">Empty Slot</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2c1b13]/10 dark:divide-white/10">
                                {attributes.map((attr, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{attr.label}</td>
                                        {selectedHostels.map((hostel: any) => (
                                            <td key={hostel._id} className="p-4 text-[#2c1b13]/80 dark:text-[#fcf2e9]/80 align-top">
                                                {attr.render(hostel)}
                                            </td>
                                        ))}
                                        {[...Array(3 - selectedHostels.length)].map((_, j) => (
                                            <td key={j} className="p-4"></td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ComparisonModal;
