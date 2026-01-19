"use client";

import React, { useState } from "react";
import { useGetMyHostelQuery, useToggleHostelStatusMutation } from "@/redux/features/hostel/hostelApi";
import {
    HiOutlineCog,
    HiOutlineEyeOff,
    HiOutlineEye,
    HiOutlineExclamation,
    HiOutlineX,
    HiOutlineCheck
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
    const { data: hostelData, isLoading, refetch } = useGetMyHostelQuery(undefined);
    const hostel = hostelData?.hostel;
    const [toggleHostelStatus, { isLoading: isToggling }] = useToggleHostelStatusMutation();
    const [confirmModal, setConfirmModal] = useState(false);

    const handleToggleStatus = async () => {
        try {
            const newStatus = !hostel?.isActive;
            await toggleHostelStatus({ isActive: newStatus }).unwrap();
            toast.success(newStatus ? "Hostel activated successfully!" : "Hostel deactivated successfully!");
            setConfirmModal(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update hostel status");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-[#2c1b13] dark:border-[#fcf2e9] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!hostel) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <HiOutlineCog size={64} className="text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                <h2 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                    No Hostel Found
                </h2>
                <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                    You need to create a hostel first to access settings.
                </p>
            </div>
        );
    }

    const isActive = hostel.isActive !== false; // Default to true if undefined

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                    Settings
                </h1>
                <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mt-1">
                    Manage your hostel settings
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#2c1b13] rounded-3xl shadow-lg overflow-hidden"
            >
                <div className="p-6 border-b border-[#2c1b13]/10 dark:border-[#fcf2e9]/10">
                    <h2 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                        Listing Status
                    </h2>
                </div>

                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#fcf2e9] dark:bg-[#1a0f0a]">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                isActive 
                                    ? "bg-green-100 dark:bg-green-900/30" 
                                    : "bg-orange-100 dark:bg-orange-900/30"
                            }`}>
                                {isActive ? (
                                    <HiOutlineEye size={28} className="text-green-600" />
                                ) : (
                                    <HiOutlineEyeOff size={28} className="text-orange-600" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-[#2c1b13] dark:text-[#fcf2e9]">
                                    {hostel.name}
                                </h3>
                                <p className={`text-sm font-medium ${
                                    isActive 
                                        ? "text-green-600 dark:text-green-400" 
                                        : "text-orange-600 dark:text-orange-400"
                                }`}>
                                    {isActive ? "Currently Active" : "Currently Deactivated"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setConfirmModal(true)}
                            className={`px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 ${
                                isActive
                                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                                    : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                        >
                            {isActive ? "Deactivate Hostel" : "Activate Hostel"}
                        </button>
                    </div>

                    <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>What happens when deactivated?</strong><br />
                            • Your hostel won't appear in search results<br />
                            • Users cannot view your hostel page<br />
                            • Existing reviews and questions are preserved<br />
                            • You can reactivate anytime
                        </p>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {confirmModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setConfirmModal(false)}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-[#2c1b13] rounded-3xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`p-6 ${isActive ? "bg-orange-500" : "bg-green-500"}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <HiOutlineExclamation size={24} className="text-white" />
                                        <h3 className="text-xl font-bold text-white">
                                            {isActive ? "Deactivate Hostel?" : "Activate Hostel?"}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setConfirmModal(false)}
                                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <HiOutlineX size={20} className="text-white" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <p className="text-[#2c1b13] dark:text-[#fcf2e9] mb-6">
                                    {isActive 
                                        ? "Your hostel will be hidden from all users. You can reactivate it anytime from this page."
                                        : "Your hostel will become visible to all users again and appear in search results."}
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setConfirmModal(false)}
                                        className="flex-1 py-3 rounded-xl border border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 text-[#2c1b13] dark:text-[#fcf2e9] font-medium hover:bg-[#2c1b13]/5 dark:hover:bg-[#fcf2e9]/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleToggleStatus}
                                        disabled={isToggling}
                                        className={`flex-1 py-3 rounded-xl text-white font-bold hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2 ${
                                            isActive ? "bg-orange-500" : "bg-green-500"
                                        }`}
                                    >
                                        {isToggling ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <HiOutlineCheck size={18} />
                                                {isActive ? "Yes, Deactivate" : "Yes, Activate"}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SettingsPage;
