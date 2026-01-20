"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiX, HiCheck, HiOutlineMinusSm, HiPlusCircle } from "react-icons/hi";
import { toggleComparisonModal, removeFromCompare, addToCompare } from "@/redux/features/comparison/comparisonSlice";
import { useGetAllHostelsQuery } from "@/redux/features/hostel/hostelApi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ComparisonModal = () => {
    const { selectedHostels, isOpen } = useSelector((state: any) => state.comparison);
    const dispatch = useDispatch();
    const { data } = useGetAllHostelsQuery({});
    const allHostels = data?.hostels || [];
    
    // State for the "Add Hostel" functionality
    const [addingSlotIndex, setAddingSlotIndex] = React.useState<number | null>(null);
    const [searchQuery, setSearchQuery] = React.useState("");

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

    const availableHostels = allHostels.filter(
        (h: any) => !selectedHostels.find((selected: any) => selected._id === h._id) &&
        (h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.city.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAddHostel = (hostel: any) => {
        dispatch(addToCompare(hostel));
        setAddingSlotIndex(null);
        setSearchQuery("");
    };

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
                    className="relative bg-white dark:bg-[#1a0f0a] rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl z-10"
                >
                    <div className="flex items-center justify-between p-6 border-b border-[#2c1b13]/10 dark:border-white/10">
                        <h2 className="text-2xl font-bold text-[#2c1b13] dark:text-[#fcf2e9]">Comparison</h2>
                        <button onClick={() => dispatch(toggleComparisonModal(false))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <HiX size={24} className="text-[#2c1b13] dark:text-[#fcf2e9]" />
                        </button>
                    </div>

                    <div className="overflow-x-auto p-6 flex-1">
                        <table className="w-full min-w-[800px] border-collapse table-fixed">
                            <thead>
                                <tr>
                                    <th className="p-4 text-left w-48 text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 font-medium"></th>
                                    {selectedHostels.map((hostel: any) => (
                                        <th key={hostel._id} className="p-4 align-top w-1/3 min-w-[250px]">
                                            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-[#2c1b13]/10 dark:border-white/10">
                                                <img src={hostel.images?.[0]?.url} alt={hostel.name} className="w-full h-full object-cover" />
                                                <button 
                                                    onClick={() => dispatch(removeFromCompare(hostel._id))}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                                                    title="Remove"
                                                >
                                                    <HiX size={14} />
                                                </button>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                                    <h3 className="text-white font-bold text-lg line-clamp-1 text-left">{hostel.name}</h3>
                                                </div>
                                            </div>
                                            <Link 
                                                href={`/hostels/${hostel._id}`}
                                                className="block text-center w-full py-2 rounded-lg bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] text-sm font-bold hover:opacity-90 transition-opacity"
                                            >
                                                View Details
                                            </Link>
                                        </th>
                                    ))}
                                    {/* Interactive Empty Slots */}
                                    {[...Array(3 - selectedHostels.length)].map((_, i) => (
                                        <th key={i} className="p-4 align-top w-1/3 min-w-[250px]">
                                            <div className="relative aspect-video rounded-xl bg-gray-50 dark:bg-white/5 border-2 border-dashed border-[#2c1b13]/20 dark:border-white/20 hover:border-[#2c1b13]/40 dark:hover:border-white/40 transition-colors flex flex-col items-center justify-center gap-2 group">
                                                
                                                {addingSlotIndex === i ? (
                                                    <div className="absolute inset-0 bg-white dark:bg-[#1a0f0a] z-20 flex flex-col p-3 rounded-xl">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <input 
                                                                autoFocus
                                                                placeholder="Search..." 
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                className="flex-1 bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-lg text-sm outline-none text-[#2c1b13] dark:text-[#fcf2e9]"
                                                            />
                                                            <button onClick={() => setAddingSlotIndex(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full">
                                                                <HiX size={16} />
                                                            </button>
                                                        </div>
                                                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                                            {availableHostels.map((h: any) => (
                                                                <button 
                                                                    key={h._id} 
                                                                    onClick={() => handleAddHostel(h)}
                                                                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-left transition-colors"
                                                                >
                                                                    <img src={h.images?.[0]?.url} className="w-10 h-10 rounded-lg object-cover bg-gray-200" />
                                                                    <div className="min-w-0">
                                                                        <p className="text-xs font-bold truncate text-[#2c1b13] dark:text-[#fcf2e9]">{h.name}</p>
                                                                        <p className="text-[10px] text-gray-500 truncate">{h.city}</p>
                                                                    </div>
                                                                    <div className="ml-auto">
                                                                        <HiPlusCircle className="text-[#2c1b13] dark:text-[#fcf2e9]" size={20} />
                                                                    </div>
                                                                </button>
                                                            ))}
                                                            {availableHostels.length === 0 && (
                                                                <div className="text-center py-4 text-xs text-gray-400">
                                                                    No hostels found
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => {
                                                            setAddingSlotIndex(i);
                                                            setSearchQuery("");
                                                        }}
                                                        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 hover:text-[#2c1b13] dark:hover:text-[#fcf2e9] transition-colors"
                                                    >
                                                        <HiPlusCircle size={32} className="mb-2" />
                                                        <span className="text-sm font-bold">Add Hostel</span>
                                                    </button>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2c1b13]/10 dark:divide-white/10">
                                {attributes.map((attr, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-bold text-[#2c1b13] dark:text-[#fcf2e9] text-sm">{attr.label}</td>
                                        {selectedHostels.map((hostel: any) => (
                                            <td key={hostel._id} className="p-4 text-[#2c1b13]/80 dark:text-[#fcf2e9]/80 align-top text-sm">
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
                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(156, 163, 175, 0.5);
                        border-radius: 20px;
                    }
                `}</style>
            </div>
        </AnimatePresence>
    );
};

export default ComparisonModal;
