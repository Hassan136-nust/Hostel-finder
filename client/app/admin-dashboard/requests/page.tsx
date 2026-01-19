"use client";

import React, { useState } from "react";
import { useGetPendingRequestsQuery, useHandleManagerRequestMutation } from "@/redux/features/admin/adminApi";
import {
    HiOutlineBell,
    HiOutlineCheck,
    HiOutlineX,
    HiOutlineMail,
    HiOutlinePhone
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Image from "next/image";

const AdminRequestsPage = () => {
    const { data, isLoading, refetch } = useGetPendingRequestsQuery(undefined);
    const [handleRequest, { isLoading: isProcessing }] = useHandleManagerRequestMutation();
    const [confirmModal, setConfirmModal] = useState<{ open: boolean; user: any; action: string }>({ open: false, user: null, action: "approve" });

    const requests = data?.requests || [];

    const handleAction = async () => {
        if (!confirmModal.user) return;
        try {
            await handleRequest({ 
                userId: confirmModal.user._id, 
                action: confirmModal.action 
            }).unwrap();
            toast.success(confirmModal.action === "approve" 
                ? "User approved as manager!" 
                : "Request rejected!");
            setConfirmModal({ open: false, user: null, action: "approve" });
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to process request");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-white">
                    Manager Requests
                </h1>
                <p className="text-white/60 mt-1">
                    {requests.length} pending request{requests.length !== 1 ? "s" : ""}
                </p>
            </div>

            {requests.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1a1a2e] rounded-2xl p-12 border border-white/10 text-center"
                >
                    <HiOutlineBell size={64} className="mx-auto text-white/20 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Pending Requests</h3>
                    <p className="text-white/60">All manager requests have been processed.</p>
                </motion.div>
            ) : (
                <div className="grid gap-4">
                    {requests.map((user: any, index: number) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/10"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/50">
                                        {user.avatar?.url ? (
                                            <Image
                                                src={user.avatar.url}
                                                alt={user.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                                                {user.name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{user.name}</h3>
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-1">
                                            <p className="text-sm text-white/60 flex items-center gap-1">
                                                <HiOutlineMail size={14} />
                                                {user.email}
                                            </p>
                                            {user.phone && (
                                                <p className="text-sm text-white/60 flex items-center gap-1">
                                                    <HiOutlinePhone size={14} />
                                                    {user.phone}
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-xs text-white/40 mt-1">
                                            Requested: {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setConfirmModal({ open: true, user, action: "reject" })}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                    >
                                        <HiOutlineX size={18} />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => setConfirmModal({ open: true, user, action: "approve" })}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                                    >
                                        <HiOutlineCheck size={18} />
                                        Approve
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Confirm Modal */}
            <AnimatePresence>
                {confirmModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setConfirmModal({ open: false, user: null, action: "approve" })}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-[#1a1a2e] rounded-2xl p-6 border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-white mb-2">
                                {confirmModal.action === "approve" ? "Approve" : "Reject"} Request?
                            </h3>
                            <p className="text-white/60 mb-6">
                                {confirmModal.action === "approve" 
                                    ? `"${confirmModal.user?.name}" will be promoted to manager and can create a hostel.`
                                    : `"${confirmModal.user?.name}"'s request will be rejected.`}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmModal({ open: false, user: null, action: "approve" })}
                                    className="flex-1 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAction}
                                    disabled={isProcessing}
                                    className={`flex-1 py-3 rounded-xl text-white font-bold transition-colors disabled:opacity-50 ${
                                        confirmModal.action === "approve" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                                    }`}
                                >
                                    {isProcessing ? "Processing..." : "Confirm"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminRequestsPage;
