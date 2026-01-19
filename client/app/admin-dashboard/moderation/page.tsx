"use client";

import React, { useState } from "react";
import { 
    useGetAdminReviewsQuery, 
    useGetAdminQuestionsQuery,
    useDeleteReviewMutation,
    useDeleteQuestionMutation
} from "@/redux/features/admin/adminApi";
import {
    HiOutlineStar,
    HiOutlineQuestionMarkCircle,
    HiOutlineTrash,
    HiOutlineSearch
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Image from "next/image";

const ModerationPage = () => {
    const { data: reviewsData, isLoading: loadingReviews, refetch: refetchReviews } = useGetAdminReviewsQuery(undefined);
    const { data: questionsData, isLoading: loadingQuestions, refetch: refetchQuestions } = useGetAdminQuestionsQuery(undefined);
    const [deleteReview, { isLoading: deletingReview }] = useDeleteReviewMutation();
    const [deleteQuestion, { isLoading: deletingQuestion }] = useDeleteQuestionMutation();

    const [activeTab, setActiveTab] = useState<"reviews" | "questions">("reviews");
    const [search, setSearch] = useState("");
    const [confirmModal, setConfirmModal] = useState<{ open: boolean; type: string; id: string; name: string }>({ 
        open: false, type: "", id: "", name: "" 
    });

    const reviews = reviewsData?.reviews || [];
    const questions = questionsData?.questions || [];

    const filteredReviews = reviews.filter((r: any) =>
        r.comment.toLowerCase().includes(search.toLowerCase()) ||
        r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.hostel?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredQuestions = questions.filter((q: any) =>
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        q.hostel?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async () => {
        try {
            if (confirmModal.type === "review") {
                await deleteReview(confirmModal.id).unwrap();
                toast.success("Review deleted!");
                refetchReviews();
            } else {
                await deleteQuestion(confirmModal.id).unwrap();
                toast.success("Question deleted!");
                refetchQuestions();
            }
            setConfirmModal({ open: false, type: "", id: "", name: "" });
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete");
        }
    };

    const isLoading = loadingReviews || loadingQuestions;

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
                        Content Moderation
                    </h1>
                    <p className="text-white/60 mt-1">
                        Manage reviews and questions
                    </p>
                </div>

                <div className="relative">
                    <HiOutlineSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search content..."
                        className="w-full sm:w-64 pl-12 pr-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 text-white placeholder-white/40 focus:border-purple-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-[#1a1a2e] p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "reviews" ? "bg-purple-500 text-white" : "text-white/60 hover:text-white"
                    }`}
                >
                    <HiOutlineStar size={18} />
                    Reviews ({reviews.length})
                </button>
                <button
                    onClick={() => setActiveTab("questions")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "questions" ? "bg-purple-500 text-white" : "text-white/60 hover:text-white"
                    }`}
                >
                    <HiOutlineQuestionMarkCircle size={18} />
                    Questions ({questions.length})
                </button>
            </div>

            {/* Content */}
            <div className="bg-[#1a1a2e] rounded-2xl border border-white/10 divide-y divide-white/10">
                {activeTab === "reviews" ? (
                    filteredReviews.length === 0 ? (
                        <div className="py-12 text-center">
                            <HiOutlineStar size={48} className="mx-auto text-white/20 mb-4" />
                            <p className="text-white/60">No reviews found</p>
                        </div>
                    ) : (
                        filteredReviews.map((review: any) => (
                            <div key={review._id} className="p-4 flex items-start gap-4">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                                    {review.user?.avatar?.url ? (
                                        <Image src={review.user.avatar.url} alt="" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                            {review.user?.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white">{review.user?.name}</span>
                                        <span className="text-white/40">→</span>
                                        <span className="text-purple-400">{review.hostel?.name}</span>
                                        <div className="flex items-center gap-1 ml-2">
                                            <HiOutlineStar className="text-yellow-400 fill-yellow-400" size={14} />
                                            <span className="text-white/60 text-sm">{review.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-sm">{review.comment}</p>
                                    <p className="text-white/40 text-xs mt-1">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setConfirmModal({ open: true, type: "review", id: review._id, name: review.user?.name })}
                                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                >
                                    <HiOutlineTrash size={18} />
                                </button>
                            </div>
                        ))
                    )
                ) : (
                    filteredQuestions.length === 0 ? (
                        <div className="py-12 text-center">
                            <HiOutlineQuestionMarkCircle size={48} className="mx-auto text-white/20 mb-4" />
                            <p className="text-white/60">No questions found</p>
                        </div>
                    ) : (
                        filteredQuestions.map((q: any) => (
                            <div key={q._id} className="p-4 flex items-start gap-4">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                                    {q.user?.avatar?.url ? (
                                        <Image src={q.user.avatar.url} alt="" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                            {q.user?.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white">{q.user?.name}</span>
                                        <span className="text-white/40">→</span>
                                        <span className="text-purple-400">{q.hostel?.name}</span>
                                    </div>
                                    <p className="text-white/80 text-sm">{q.question}</p>
                                    {q.answer && (
                                        <p className="text-green-400/80 text-sm mt-1 pl-3 border-l-2 border-green-500">
                                            {q.answer}
                                        </p>
                                    )}
                                    <p className="text-white/40 text-xs mt-1">
                                        {new Date(q.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setConfirmModal({ open: true, type: "question", id: q._id, name: q.user?.name })}
                                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                >
                                    <HiOutlineTrash size={18} />
                                </button>
                            </div>
                        ))
                    )
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
                        onClick={() => setConfirmModal({ open: false, type: "", id: "", name: "" })}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md bg-[#1a1a2e] rounded-2xl p-6 border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-white mb-2">Delete {confirmModal.type}?</h3>
                            <p className="text-white/60 mb-6">
                                This {confirmModal.type} by "{confirmModal.name}" will be permanently removed.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmModal({ open: false, type: "", id: "", name: "" })}
                                    className="flex-1 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deletingReview || deletingQuestion}
                                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {(deletingReview || deletingQuestion) ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModerationPage;
