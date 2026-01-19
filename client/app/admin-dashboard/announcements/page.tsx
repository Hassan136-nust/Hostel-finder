"use client";

import React, { useState } from "react";
import { 
    useGetAnnouncementsQuery, 
    useCreateAnnouncementMutation,
    useToggleAnnouncementMutation,
    useDeleteAnnouncementMutation
} from "@/redux/features/admin/adminApi";
import {
    HiOutlineSpeakerphone,
    HiOutlinePlus,
    HiOutlineTrash,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineX
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const AnnouncementsPage = () => {
    const { data, isLoading, refetch } = useGetAnnouncementsQuery(undefined);
    const [createAnnouncement, { isLoading: creating }] = useCreateAnnouncementMutation();
    const [toggleAnnouncement, { isLoading: toggling }] = useToggleAnnouncementMutation();
    const [deleteAnnouncement, { isLoading: deleting }] = useDeleteAnnouncementMutation();

    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: "", message: "", type: "info" });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; title: string }>({ 
        open: false, id: "", title: "" 
    });

    const announcements = data?.announcements || [];

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.message.trim()) {
            return toast.error("Please fill all fields");
        }
        try {
            await createAnnouncement(form).unwrap();
            toast.success("Announcement created!");
            setForm({ title: "", message: "", type: "info" });
            setShowModal(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create announcement");
        }
    };

    const handleToggle = async (id: string, isActive: boolean) => {
        try {
            await toggleAnnouncement({ announcementId: id, isActive: !isActive }).unwrap();
            toast.success(isActive ? "Announcement hidden" : "Announcement visible");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to toggle");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteAnnouncement(deleteModal.id).unwrap();
            toast.success("Announcement deleted!");
            setDeleteModal({ open: false, id: "", title: "" });
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete");
        }
    };

    const typeColors: Record<string, string> = {
        info: "bg-blue-500/20 text-blue-400 border-blue-500",
        warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
        success: "bg-green-500/20 text-green-400 border-green-500",
        error: "bg-red-500/20 text-red-400 border-red-500"
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
                        Announcements
                    </h1>
                    <p className="text-white/60 mt-1">
                        Create and manage platform announcements
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors"
                >
                    <HiOutlinePlus size={20} />
                    New Announcement
                </button>
            </div>

            {announcements.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1a1a2e] rounded-2xl p-12 border border-white/10 text-center"
                >
                    <HiOutlineSpeakerphone size={64} className="mx-auto text-white/20 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Announcements</h3>
                    <p className="text-white/60">Create your first announcement to notify users.</p>
                </motion.div>
            ) : (
                <div className="grid gap-4">
                    {announcements.map((ann: any, index: number) => (
                        <motion.div
                            key={ann._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-[#1a1a2e] rounded-2xl p-5 border-l-4 ${typeColors[ann.type] || typeColors.info}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-white">{ann.title}</h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${typeColors[ann.type]}`}>
                                            {ann.type}
                                        </span>
                                        {!ann.isActive && (
                                            <span className="px-2 py-0.5 rounded bg-white/10 text-white/40 text-xs font-medium">
                                                Hidden
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-white/70">{ann.message}</p>
                                    <p className="text-white/40 text-sm mt-2">
                                        Created by {ann.createdBy?.name} • {new Date(ann.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggle(ann._id, ann.isActive)}
                                        disabled={toggling}
                                        className={`p-2 rounded-lg transition-colors ${
                                            ann.isActive 
                                                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" 
                                                : "bg-white/10 text-white/40 hover:bg-white/20"
                                        }`}
                                        title={ann.isActive ? "Hide" : "Show"}
                                    >
                                        {ann.isActive ? <HiOutlineEye size={18} /> : <HiOutlineEyeOff size={18} />}
                                    </button>
                                    <button
                                        onClick={() => setDeleteModal({ open: true, id: ann._id, title: ann.title })}
                                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                    >
                                        <HiOutlineTrash size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-[#1a1a2e] rounded-2xl border border-white/10 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-5 border-b border-white/10">
                                <h3 className="text-xl font-bold text-white">New Announcement</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60"
                                >
                                    <HiOutlineX size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleCreate} className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none"
                                        placeholder="Announcement title..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
                                    <textarea
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none resize-none"
                                        placeholder="Announcement message..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Type</label>
                                    <div className="flex gap-2">
                                        {["info", "success", "warning", "error"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setForm({ ...form, type })}
                                                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                                                    form.type === type ? typeColors[type] : "bg-white/5 text-white/40"
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full py-3 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-600 transition-colors disabled:opacity-50"
                                >
                                    {creating ? "Creating..." : "Create Announcement"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <AnimatePresence>
                {deleteModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setDeleteModal({ open: false, id: "", title: "" })}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-[#1a1a2e] rounded-2xl p-6 border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-white mb-2">Delete Announcement?</h3>
                            <p className="text-white/60 mb-6">
                                "{deleteModal.title}" will be permanently removed.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ open: false, id: "", title: "" })}
                                    className="flex-1 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnnouncementsPage;
