"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiX, HiOutlineScale, HiOutlineTrash } from "react-icons/hi";
import { removeFromCompare, clearComparison, toggleComparisonModal } from "@/redux/features/comparison/comparisonSlice";
import { motion, AnimatePresence } from "framer-motion";

const ComparisonBar = () => {
    const { selectedHostels, isOpen } = useSelector((state: any) => state.comparison);
    const dispatch = useDispatch();

    if (selectedHostels.length === 0 || isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 p-4"
            >
                <div className="max-w-[1440px] mx-auto bg-white dark:bg-[#2c1b13] rounded-2xl shadow-2xl border border-[#2c1b13]/10 dark:border-white/10 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {selectedHostels.map((hostel: any) => (
                            <div key={hostel._id} className="relative group shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100">
                                <img src={hostel.images?.[0]?.url} alt={hostel.name} className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => dispatch(removeFromCompare(hostel._id))}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <HiX size={12} />
                                </button>
                            </div>
                        ))}
                        {selectedHostels.length < 3 && (
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg border-2 border-dashed border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 flex flex-col items-center justify-center text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 text-xs text-center p-2 shrink-0">
                                <span className="font-bold text-lg">{selectedHostels.length}/3</span>
                                Add more
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => dispatch(clearComparison())}
                            className="flex-1 md:flex-none px-4 py-3 rounded-xl border border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 text-[#2c1b13] dark:text-[#fcf2e9] font-bold hover:bg-[#2c1b13]/5 dark:hover:bg-[#fcf2e9]/5 flex items-center justify-center gap-2"
                        >
                            <HiOutlineTrash size={18} />
                            Clear
                        </button>
                        <button
                            onClick={() => dispatch(toggleComparisonModal(true))}
                            disabled={selectedHostels.length < 2}
                            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                selectedHostels.length < 2
                                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500"
                                    : "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] hover:shadow-lg hover:-translate-y-1"
                            }`}
                        >
                            <HiOutlineScale size={18} />
                            Compare Now
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ComparisonBar;
