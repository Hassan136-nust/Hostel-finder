"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetHostelReviewsQuery, useReplyToReviewMutation } from "@/redux/features/review/reviewApi";
import { useGetMyHostelQuery } from "@/redux/features/hostel/hostelApi";
import {
    HiOutlineStar,
    HiOutlineChatAlt2,
    HiOutlineReply,
    HiOutlineX,
    HiOutlineCheck,
    HiOutlineUser
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const ReviewsPage = () => {
    const { user } = useSelector((state: any) => state.auth);
    const { data: hostelData, isLoading: hostelLoading } = useGetMyHostelQuery(undefined);
    const hostel = hostelData?.hostel;

    const { data: reviewsData, isLoading, refetch } = useGetHostelReviewsQuery(hostel?._id, {
        skip: !hostel?._id
    });
    const reviews = reviewsData?.reviews || [];

    const [replyToReview, { isLoading: isReplying }] = useReplyToReviewMutation();
    const [replyModal, setReplyModal] = useState<{ open: boolean; review: any }>({ open: false, review: null });
    const [replyMessage, setReplyMessage] = useState("");

    const handleReply = async () => {
        if (!replyMessage.trim()) {
            toast.error("Please write a reply");
            return;
        }
        try {
            await replyToReview({
                reviewId: replyModal.review._id,
                message: replyMessage
            }).unwrap();
            toast.success("Reply sent successfully!");
            setReplyModal({ open: false, review: null });
            setReplyMessage("");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send reply");
        }
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter((r: any) => r.rating === star).length,
        percentage: reviews.length > 0 ? (reviews.filter((r: any) => r.rating === star).length / reviews.length) * 100 : 0
    }));

    if (hostelLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-[#2c1b13] dark:border-[#fcf2e9] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!hostel) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <HiOutlineChatAlt2 size={64} className="text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                <h2 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                    No Hostel Found
                </h2>
                <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                    You need to create a hostel first to manage reviews.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                    Reviews Management
                </h1>
                <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mt-1">
                    View and respond to guest reviews for {hostel.name}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 text-white"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                            <HiOutlineStar size={32} />
                        </div>
                        <div>
                            <p className="text-white/80 text-sm">Average Rating</p>
                            <p className="text-4xl font-bold">{avgRating}</p>
                        </div>
                    </div>
                    <p className="mt-4 text-white/80 text-sm">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 bg-white dark:bg-[#2c1b13] rounded-3xl p-6 shadow-lg"
                >
                    <h3 className="font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">Rating Distribution</h3>
                    <div className="space-y-3">
                        {ratingDistribution.map(({ star, count, percentage }) => (
                            <div key={star} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-12">
                                    <span className="font-medium text-[#2c1b13] dark:text-[#fcf2e9]">{star}</span>
                                    <HiOutlineStar size={14} className="text-yellow-500 fill-yellow-500" />
                                </div>
                                <div className="flex-1 h-3 bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="w-8 text-sm text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">{count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="bg-white dark:bg-[#2c1b13] rounded-3xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-[#2c1b13]/10 dark:border-[#fcf2e9]/10">
                    <h2 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                        All Reviews ({reviews.length})
                    </h2>
                </div>

                {reviews.length === 0 ? (
                    <div className="p-12 text-center">
                        <HiOutlineChatAlt2 size={48} className="mx-auto text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                        <p className="font-medium text-[#2c1b13] dark:text-[#fcf2e9] mb-1">No reviews yet</p>
                        <p className="text-sm text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                            Reviews from guests will appear here
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#2c1b13]/10 dark:divide-[#fcf2e9]/10">
                        {reviews.map((review: any) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 flex items-center justify-center shrink-0">
                                        {review.user?.avatar?.url ? (
                                            <img
                                                src={review.user.avatar.url}
                                                alt=""
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <HiOutlineUser size={24} className="text-[#2c1b13]/40 dark:text-[#fcf2e9]/40" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h4 className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                                    {review.user?.name || "Anonymous"}
                                                </h4>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <HiOutlineStar
                                                            key={star}
                                                            size={16}
                                                            className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-[#2c1b13]/20 dark:text-[#fcf2e9]/20"}
                                                        />
                                                    ))}
                                                    <span className="ml-2 text-sm text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setReplyModal({ open: true, review });
                                                    setReplyMessage(review.reply?.message || "");
                                                }}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm hover:scale-105 transition-transform ${
                                                    review.reply 
                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                        : "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]"
                                                }`}
                                            >
                                                <HiOutlineReply size={16} />
                                                {review.reply ? "Edit Reply" : "Reply"}
                                            </button>
                                        </div>

                                        <p className="mt-3 text-[#2c1b13]/80 dark:text-[#fcf2e9]/80 leading-relaxed">
                                            {review.comment}
                                        </p>

                                        {review.reply && (
                                            <div className="mt-4 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <HiOutlineCheck size={16} className="text-green-600" />
                                                    <span className="text-sm font-bold text-green-700 dark:text-green-400">
                                                        Your Reply
                                                    </span>
                                                    <span className="text-xs text-green-600/60">
                                                        {new Date(review.reply.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-green-800 dark:text-green-300">
                                                    {review.reply.message}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {replyModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setReplyModal({ open: false, review: null })}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-[#2c1b13] rounded-3xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 bg-[#2c1b13] dark:bg-[#fcf2e9]">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-[#fcf2e9] dark:text-[#2c1b13]">
                                        Reply to Review
                                    </h3>
                                    <button
                                        onClick={() => setReplyModal({ open: false, review: null })}
                                        className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
                                    >
                                        <HiOutlineX size={20} className="text-[#fcf2e9] dark:text-[#2c1b13]" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="p-4 rounded-2xl bg-[#fcf2e9] dark:bg-[#1a0f0a] mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                            {replyModal.review?.user?.name || "Anonymous"}
                                        </span>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <HiOutlineStar
                                                    key={star}
                                                    size={12}
                                                    className={star <= replyModal.review?.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#2c1b13]/80 dark:text-[#fcf2e9]/80">
                                        "{replyModal.review?.comment}"
                                    </p>
                                </div>

                                <label className="block text-sm font-medium text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                                    Your Reply
                                </label>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Write a thoughtful response to this review..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-[#fcf2e9] dark:bg-[#1a0f0a] border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#2c1b13] dark:focus:ring-[#fcf2e9] resize-none"
                                />

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => setReplyModal({ open: false, review: null })}
                                        className="flex-1 py-3 rounded-xl border border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 text-[#2c1b13] dark:text-[#fcf2e9] font-medium hover:bg-[#2c1b13]/5 dark:hover:bg-[#fcf2e9]/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleReply}
                                        disabled={isReplying || !replyMessage.trim()}
                                        className="flex-1 py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isReplying ? (
                                            <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <HiOutlineReply size={18} />
                                                Send Reply
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

export default ReviewsPage;
