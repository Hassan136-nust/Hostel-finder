"use client";

import React, { useState } from "react";
import { useGetAdminHostelsQuery, useAdminToggleHostelMutation, useToggleFeaturedHostelMutation } from "@/redux/features/admin/adminApi";
import {
    HiOutlineOfficeBuilding,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineSearch,
    HiOutlineLocationMarker,
    HiOutlineStar,
    HiStar
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const AdminHostelsPage = () => {
    const { data, isLoading, refetch } = useGetAdminHostelsQuery(undefined);
    const [toggleHostel, { isLoading: isToggling }] = useAdminToggleHostelMutation();
    const [toggleFeatured] = useToggleFeaturedHostelMutation();
    const [search, setSearch] = useState("");
    const [confirmModal, setConfirmModal] = useState<{ open: boolean; hostel: any; action: boolean }>({ open: false, hostel: null, action: true });

    const hostels = data?.hostels || [];

    const filteredHostels = hostels.filter((hostel: any) =>
        hostel.name.toLowerCase().includes(search.toLowerCase()) ||
        hostel.city.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggle = async () => {
        if (!confirmModal.hostel) return;
        try {
            await toggleHostel({ 
                hostelId: confirmModal.hostel._id, 
                isActive: confirmModal.action 
            }).unwrap();
            toast.success(confirmModal.action ? "Hostel activated!" : "Hostel deactivated!");
            setConfirmModal({ open: false, hostel: null, action: true });
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update hostel");
        }
    };

    const handleToggleFeatured = async (hostelId: string, isFeatured: boolean) => {
        try {
            await toggleFeatured({ hostelId, isFeatured: !isFeatured }).unwrap();
            toast.success(isFeatured ? "Removed from featured" : "Added to featured!");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update");
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white">
                        Manage Hostels
                    </h1>
                    <p className="text-white/60 mt-1">
                        {hostels.length} hostels registered
                    </p>
                </div>

                <div className="relative">
                    <HiOutlineSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search hostels..."
                        className="w-full sm:w-64 pl-12 pr-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 text-white placeholder-white/40 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="bg-[#1a1a2e] rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Hostel</th>
                                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Owner</th>
                                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Type</th>
                                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Status</th>
                                <th className="text-right py-4 px-6 text-white/60 font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHostels.map((hostel: any) => {
                                const isActive = hostel.isActive !== false;
                                return (
                                    <motion.tr
                                        key={hostel._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 shrink-0">
                                                    {hostel.images?.[0]?.url ? (
                                                        <img src={hostel.images[0].url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <HiOutlineOfficeBuilding size={20} className="text-white/30" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{hostel.name}</p>
                                                    <p className="text-sm text-white/50 flex items-center gap-1">
                                                        <HiOutlineLocationMarker size={14} />
                                                        {hostel.city}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-white">{hostel.owner?.name || "Unknown"}</p>
                                            <p className="text-sm text-white/50">{hostel.owner?.email}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                hostel.type === "Boys" ? "bg-blue-500/20 text-blue-400" :
                                                hostel.type === "Girls" ? "bg-pink-500/20 text-pink-400" :
                                                "bg-green-500/20 text-green-400"
                                            }`}>
                                                {hostel.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit ${
                                                isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                            }`}>
                                                {isActive ? <HiOutlineEye size={14} /> : <HiOutlineEyeOff size={14} />}
                                                {isActive ? "Active" : "Deactivated"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleFeatured(hostel._id, hostel.isFeatured)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        hostel.isFeatured 
                                                            ? "bg-yellow-500/20 text-yellow-400" 
                                                            : "bg-white/10 text-white/40 hover:bg-white/20"
                                                    }`}
                                                    title={hostel.isFeatured ? "Remove from Featured" : "Add to Featured"}
                                                >
                                                    {hostel.isFeatured ? <HiStar size={18} /> : <HiOutlineStar size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmModal({ open: true, hostel, action: !isActive })}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                        isActive 
                                                            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                                                            : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                                    }`}
                                                >
                                                    {isActive ? "Deactivate" : "Activate"}
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredHostels.length === 0 && (
                    <div className="py-12 text-center">
                        <HiOutlineOfficeBuilding size={48} className="mx-auto text-white/20 mb-4" />
                        <p className="text-white/60">No hostels found</p>
                    </div>
                )}
            </div>

            {/* Confirm Modal */}
            <AnimatePresence>
                {confirmModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setConfirmModal({ open: false, hostel: null, action: true })}
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
                                {confirmModal.action ? "Activate" : "Deactivate"} Hostel?
                            </h3>
                            <p className="text-white/60 mb-6">
                                {confirmModal.action 
                                    ? `"${confirmModal.hostel?.name}" will be visible to all users.`
                                    : `"${confirmModal.hostel?.name}" will be hidden from all users.`}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmModal({ open: false, hostel: null, action: true })}
                                    className="flex-1 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleToggle}
                                    disabled={isToggling}
                                    className={`flex-1 py-3 rounded-xl text-white font-bold transition-colors disabled:opacity-50 ${
                                        confirmModal.action ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                                    }`}
                                >
                                    {isToggling ? "Processing..." : "Confirm"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminHostelsPage;
