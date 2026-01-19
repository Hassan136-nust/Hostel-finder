"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGetMyReviewsQuery } from "@/redux/features/review/reviewApi";
import { useGetMyQuestionsQuery } from "@/redux/features/questions/questionApi";
import {
    HiOutlineStar,
    HiOutlineQuestionMarkCircle,
    HiOutlineCheck,
    HiOutlineClock,
    HiOutlineOfficeBuilding
} from "react-icons/hi";
import { motion } from "framer-motion";

const UserActivitySection = () => {
    const [activeTab, setActiveTab] = useState<"reviews" | "questions">("reviews");
    const { data: reviewsData, isLoading: reviewsLoading } = useGetMyReviewsQuery(undefined);
    const { data: questionsData, isLoading: questionsLoading } = useGetMyQuestionsQuery(undefined);

    const reviews = reviewsData?.reviews || [];
    const questions = questionsData?.questions || [];

    const answeredReviews = reviews.filter((r: any) => r.reply);
    const answeredQuestions = questions.filter((q: any) => q.replies && q.replies.length > 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
        >
            <h3 className="text-xl font-heading font-bold mb-6">My Activity</h3>

            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                        activeTab === "reviews"
                            ? "bg-[#fcf2e9] dark:bg-[#2c1b13] text-[#2c1b13] dark:text-[#fcf2e9]"
                            : "bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20"
                    }`}
                >
                    <HiOutlineStar size={18} />
                    My Reviews
                    <span className="px-2 py-0.5 rounded-full bg-current/10 text-xs font-bold">
                        {reviews.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab("questions")}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                        activeTab === "questions"
                            ? "bg-[#fcf2e9] dark:bg-[#2c1b13] text-[#2c1b13] dark:text-[#fcf2e9]"
                            : "bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20"
                    }`}
                >
                    <HiOutlineQuestionMarkCircle size={18} />
                    My Questions
                    <span className="px-2 py-0.5 rounded-full bg-current/10 text-xs font-bold">
                        {questions.length}
                    </span>
                </button>
            </div>

            {activeTab === "reviews" && (
                <div className="space-y-4">
                    {reviewsLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-3 border-current/30 border-t-current rounded-full animate-spin" />
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 dark:bg-black/5 rounded-2xl border border-white/10 dark:border-black/10">
                            <HiOutlineStar size={40} className="mx-auto opacity-20 mb-3" />
                            <p className="opacity-60">You haven't written any reviews yet</p>
                        </div>
                    ) : (
                        reviews.map((review: any) => (
                            <Link
                                key={review._id}
                                href={`/hostels/${review.hostel?._id}`}
                                className="block p-5 rounded-2xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 hover:bg-white/10 dark:hover:bg-black/10 transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 shrink-0">
                                        {review.hostel?.images?.[0]?.url ? (
                                            <img src={review.hostel.images[0].url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <HiOutlineOfficeBuilding size={20} className="opacity-30" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold truncate">{review.hostel?.name || "Hostel"}</h4>
                                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                                                review.reply 
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-orange-500/20 text-orange-400"
                                            }`}>
                                                {review.reply ? <HiOutlineCheck size={12} /> : <HiOutlineClock size={12} />}
                                                {review.reply ? "Replied" : "Pending"}
                                            </span>
                                        </div>
                                        <div className="flex gap-0.5 mb-2">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <HiOutlineStar key={s} size={14} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "opacity-20"} />
                                            ))}
                                        </div>
                                        <p className="text-sm opacity-80 line-clamp-2">{review.comment}</p>
                                        {review.reply && (
                                            <div className="mt-3 p-3 rounded-xl bg-green-500/10 border-l-2 border-green-500">
                                                <p className="text-xs font-bold text-green-400 mb-1">✓ Hostel Response</p>
                                                <p className="text-sm text-green-300/80">{review.reply.message}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}

            {activeTab === "questions" && (
                <div className="space-y-4">
                    {questionsLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-3 border-current/30 border-t-current rounded-full animate-spin" />
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 dark:bg-black/5 rounded-2xl border border-white/10 dark:border-black/10">
                            <HiOutlineQuestionMarkCircle size={40} className="mx-auto opacity-20 mb-3" />
                            <p className="opacity-60">You haven't asked any questions yet</p>
                        </div>
                    ) : (
                        questions.map((question: any) => {
                            const hasAnswer = question.replies && question.replies.length > 0;
                            return (
                                <Link
                                    key={question._id}
                                    href={`/hostels/${question.hostel?._id}`}
                                    className="block p-5 rounded-2xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 hover:bg-white/10 dark:hover:bg-black/10 transition-all"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 shrink-0">
                                            {question.hostel?.images?.[0]?.url ? (
                                                <img src={question.hostel.images[0].url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <HiOutlineOfficeBuilding size={20} className="opacity-30" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold truncate">{question.hostel?.name || "Hostel"}</h4>
                                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                                                    hasAnswer 
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-orange-500/20 text-orange-400"
                                                }`}>
                                                    {hasAnswer ? <HiOutlineCheck size={12} /> : <HiOutlineClock size={12} />}
                                                    {hasAnswer ? "Answered" : "Pending"}
                                                </span>
                                            </div>
                                            <p className="font-medium mb-2">"{question.question}"</p>
                                            {hasAnswer && (
                                                <div className="mt-2 space-y-2">
                                                    {question.replies.map((reply: any, i: number) => (
                                                        <div key={i} className="p-3 rounded-xl bg-green-500/10 border-l-2 border-green-500">
                                                            <p className="text-xs font-bold text-green-400 mb-1">✓ Hostel Response</p>
                                                            <p className="text-sm text-green-300/80">{reply.answer}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {!hasAnswer && (
                                                <p className="text-sm opacity-40 italic">Awaiting response from hostel...</p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 text-center">
                    <p className="text-2xl font-bold">{answeredReviews.length}/{reviews.length}</p>
                    <p className="text-xs opacity-60 mt-1">Reviews with replies</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 text-center">
                    <p className="text-2xl font-bold">{answeredQuestions.length}/{questions.length}</p>
                    <p className="text-xs opacity-60 mt-1">Questions answered</p>
                </div>
            </div>
        </motion.div>
    );
};

export default UserActivitySection;
