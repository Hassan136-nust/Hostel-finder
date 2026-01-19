"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetHostelQuestionsQuery, useAnswerQuestionMutation } from "@/redux/features/questions/questionApi";
import { useGetMyHostelQuery } from "@/redux/features/hostel/hostelApi";
import {
    HiOutlineQuestionMarkCircle,
    HiOutlineReply,
    HiOutlineX,
    HiOutlineCheck,
    HiOutlineUser,
    HiOutlineClock
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const QuestionsPage = () => {
    const { user } = useSelector((state: any) => state.auth);
    const { data: hostelData, isLoading: hostelLoading } = useGetMyHostelQuery(undefined);
    const hostel = hostelData?.hostel;

    const { data: questionsData, isLoading, refetch } = useGetHostelQuestionsQuery(hostel?._id, {
        skip: !hostel?._id
    });
    const questions = questionsData?.questions || [];

    const [answerQuestion, { isLoading: isAnswering }] = useAnswerQuestionMutation();
    const [answerModal, setAnswerModal] = useState<{ open: boolean; question: any }>({ open: false, question: null });
    const [answerMessage, setAnswerMessage] = useState("");

    const handleAnswer = async () => {
        if (!answerMessage.trim()) {
            toast.error("Please write an answer");
            return;
        }
        try {
            await answerQuestion({
                questionId: answerModal.question._id,
                answer: answerMessage
            }).unwrap();
            toast.success("Answer sent successfully!");
            setAnswerModal({ open: false, question: null });
            setAnswerMessage("");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send answer");
        }
    };

    const unansweredCount = questions.filter((q: any) => !q.replies || q.replies.length === 0).length;
    const answeredCount = questions.filter((q: any) => q.replies && q.replies.length > 0).length;

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
                <HiOutlineQuestionMarkCircle size={64} className="text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                <h2 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                    No Hostel Found
                </h2>
                <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                    You need to create a hostel first to manage questions.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                    Q&A Management
                </h1>
                <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mt-1">
                    Answer questions from potential guests for {hostel.name}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#2c1b13] rounded-3xl p-6 shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <HiOutlineQuestionMarkCircle size={28} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 text-sm">Total Questions</p>
                            <p className="text-3xl font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{questions.length}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-[#2c1b13] rounded-3xl p-6 shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <HiOutlineClock size={28} className="text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 text-sm">Pending</p>
                            <p className="text-3xl font-bold text-orange-600">{unansweredCount}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-[#2c1b13] rounded-3xl p-6 shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <HiOutlineCheck size={28} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 text-sm">Answered</p>
                            <p className="text-3xl font-bold text-green-600">{answeredCount}</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="bg-white dark:bg-[#2c1b13] rounded-3xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-[#2c1b13]/10 dark:border-[#fcf2e9]/10">
                    <h2 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                        All Questions ({questions.length})
                    </h2>
                </div>

                {questions.length === 0 ? (
                    <div className="p-12 text-center">
                        <HiOutlineQuestionMarkCircle size={48} className="mx-auto text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                        <p className="font-medium text-[#2c1b13] dark:text-[#fcf2e9] mb-1">No questions yet</p>
                        <p className="text-sm text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                            Questions from guests will appear here
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#2c1b13]/10 dark:divide-[#fcf2e9]/10">
                        {questions.map((question: any) => {
                            const hasAnswer = question.replies && question.replies.length > 0;
                            const latestAnswer = hasAnswer ? question.replies[question.replies.length - 1] : null;

                            return (
                                <motion.div
                                    key={question._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-6"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                                            hasAnswer 
                                                ? "bg-green-100 dark:bg-green-900/30" 
                                                : "bg-orange-100 dark:bg-orange-900/30"
                                        }`}>
                                            <HiOutlineQuestionMarkCircle 
                                                size={24} 
                                                className={hasAnswer ? "text-green-600" : "text-orange-600"} 
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                                            {question.user?.name || "Anonymous"}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                            hasAnswer 
                                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                        }`}>
                                                            {hasAnswer ? "Answered" : "Pending"}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                                                        {new Date(question.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setAnswerModal({ open: true, question });
                                                        setAnswerMessage("");
                                                    }}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm hover:scale-105 transition-transform ${
                                                        hasAnswer 
                                                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                            : "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]"
                                                    }`}
                                                >
                                                    <HiOutlineReply size={16} />
                                                    {hasAnswer ? "Add Reply" : "Answer"}
                                                </button>
                                            </div>

                                            <p className="mt-3 text-lg text-[#2c1b13] dark:text-[#fcf2e9] font-medium">
                                                "{question.question}"
                                            </p>

                                            {question.replies && question.replies.length > 0 && (
                                                <div className="mt-4 space-y-3">
                                                    {question.replies.map((reply: any, index: number) => (
                                                        <div 
                                                            key={index} 
                                                            className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
                                                        >
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <HiOutlineCheck size={16} className="text-green-600" />
                                                                <span className="text-sm font-bold text-green-700 dark:text-green-400">
                                                                    Your Answer
                                                                </span>
                                                                <span className="text-xs text-green-600/60">
                                                                    {new Date(reply.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-green-800 dark:text-green-300">
                                                                {reply.answer}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {answerModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setAnswerModal({ open: false, question: null })}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-[#2c1b13] rounded-3xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 bg-blue-600">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">
                                        Answer Question
                                    </h3>
                                    <button
                                        onClick={() => setAnswerModal({ open: false, question: null })}
                                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <HiOutlineX size={20} className="text-white" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="p-4 rounded-2xl bg-[#fcf2e9] dark:bg-[#1a0f0a] mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <HiOutlineUser size={16} className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60" />
                                        <span className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                            {answerModal.question?.user?.name || "Anonymous"}
                                        </span>
                                    </div>
                                    <p className="text-[#2c1b13] dark:text-[#fcf2e9] font-medium">
                                        "{answerModal.question?.question}"
                                    </p>
                                </div>

                                <label className="block text-sm font-medium text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                                    Your Answer
                                </label>
                                <textarea
                                    value={answerMessage}
                                    onChange={(e) => setAnswerMessage(e.target.value)}
                                    placeholder="Write a helpful answer to this question..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-[#fcf2e9] dark:bg-[#1a0f0a] border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => setAnswerModal({ open: false, question: null })}
                                        className="flex-1 py-3 rounded-xl border border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 text-[#2c1b13] dark:text-[#fcf2e9] font-medium hover:bg-[#2c1b13]/5 dark:hover:bg-[#fcf2e9]/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAnswer}
                                        disabled={isAnswering || !answerMessage.trim()}
                                        className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isAnswering ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <HiOutlineReply size={18} />
                                                Send Answer
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

export default QuestionsPage;
