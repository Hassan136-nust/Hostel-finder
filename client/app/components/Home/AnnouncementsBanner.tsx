"use client";

import React, { useState } from "react";
import { useGetActiveAnnouncementsQuery } from "@/redux/features/admin/adminApi";
import { HiOutlineX, HiInformationCircle, HiExclamation, HiCheckCircle, HiXCircle } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const AnnouncementsBanner = () => {
    const { data } = useGetActiveAnnouncementsQuery(undefined);
    const announcements = data?.announcements || [];
    const [dismissed, setDismissed] = useState<string[]>([]);

    const visibleAnnouncements = announcements.filter((a: any) => !dismissed.includes(a._id));

    if (visibleAnnouncements.length === 0) {
        return null;
    }

    const typeConfig: Record<string, { bg: string; border: string; icon: any }> = {
        info: { 
            bg: "bg-blue-50 dark:bg-blue-900/20", 
            border: "border-blue-300 dark:border-blue-700",
            icon: HiInformationCircle 
        },
        warning: { 
            bg: "bg-yellow-50 dark:bg-yellow-900/20", 
            border: "border-yellow-300 dark:border-yellow-700",
            icon: HiExclamation 
        },
        success: { 
            bg: "bg-green-50 dark:bg-green-900/20", 
            border: "border-green-300 dark:border-green-700",
            icon: HiCheckCircle 
        },
        error: { 
            bg: "bg-red-50 dark:bg-red-900/20", 
            border: "border-red-300 dark:border-red-700",
            icon: HiXCircle 
        }
    };

    const typeColors: Record<string, string> = {
        info: "text-blue-700 dark:text-blue-400",
        warning: "text-yellow-700 dark:text-yellow-400",
        success: "text-green-700 dark:text-green-400",
        error: "text-red-700 dark:text-red-400"
    };

    return (
        <div className="fixed bottom-4 right-4 z-40 max-w-md space-y-3">
            <AnimatePresence>
                {visibleAnnouncements.slice(0, 3).map((announcement: any) => {
                    const config = typeConfig[announcement.type] || typeConfig.info;
                    const Icon = config.icon;
                    const textColor = typeColors[announcement.type] || typeColors.info;

                    return (
                        <motion.div
                            key={announcement._id}
                            initial={{ opacity: 0, x: 100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            className={`${config.bg} ${config.border} border rounded-xl p-4 shadow-lg backdrop-blur-sm`}
                        >
                            <div className="flex items-start gap-3">
                                <Icon size={24} className={textColor} />
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-bold ${textColor}`}>
                                        {announcement.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        {announcement.message}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setDismissed([...dismissed, announcement._id])}
                                    className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                                >
                                    <HiOutlineX size={18} className="text-gray-500" />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default AnnouncementsBanner;
