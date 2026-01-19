"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetHostelByIdQuery } from "@/redux/features/hostel/hostelApi";
import { useGetHostelReviewsQuery, useAddReviewMutation } from "@/redux/features/review/reviewApi";
import { useGetHostelQuestionsQuery, useAskQuestionMutation } from "@/redux/features/questions/questionApi";
import { useSelector } from "react-redux";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import { 
    HiOutlineLocationMarker, 
    HiOutlineStar,
    HiOutlineUsers,
    HiOutlinePhone,
    HiOutlinePhotograph,
    HiOutlineCheck,
    HiOutlineArrowLeft,
    HiOutlineKey,
    HiOutlineCurrencyDollar,
    HiOutlineChatAlt2,
    HiOutlineQuestionMarkCircle,
    HiOutlinePaperAirplane
} from "react-icons/hi";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const ROOM_TYPES = ["All", "Single", "Double", "Three Seater", "Four Seater"];

const HostelDetailPage = () => {
    const params = useParams();
    const hostelId = params?.id as string;
    const { user } = useSelector((state: any) => state.auth);
    
    const { data, isLoading, refetch: refetchHostel } = useGetHostelByIdQuery(hostelId, {
        skip: !hostelId
    });
    const { data: reviewsData, refetch: refetchReviews } = useGetHostelReviewsQuery(hostelId, {
        skip: !hostelId
    });
    const { data: questionsData, refetch: refetchQuestions } = useGetHostelQuestionsQuery(hostelId, {
        skip: !hostelId
    });

    const [addReview, { isLoading: isAddingReview }] = useAddReviewMutation();
    const [askQuestion, { isLoading: isAskingQuestion }] = useAskQuestionMutation();

    const hostel = data?.hostel;
    const rooms = data?.rooms || [];
    const reviews = reviewsData?.reviews || [];
    const questions = questionsData?.questions || [];

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedRoomType, setSelectedRoomType] = useState("All");
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);
    const [activeTab, setActiveTab] = useState<"rooms" | "reviews" | "questions">("rooms");

    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
    const [questionForm, setQuestionForm] = useState("");

    const filteredRooms = useMemo(() => {
        return rooms.filter((room: any) => {
            if (selectedRoomType !== "All" && room.type !== selectedRoomType) {
                return false;
            }
            if (showAvailableOnly && !room.isAvailable) {
                return false;
            }
            return true;
        });
    }, [rooms, selectedRoomType, showAvailableOnly]);

    const minPrice = rooms.length > 0 
        ? Math.min(...rooms.map((r: any) => r.price)) 
        : 0;

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to add a review");
            return;
        }
        if (!reviewForm.comment.trim()) {
            toast.error("Please write a comment");
            return;
        }
        try {
            await addReview({
                hostelId,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            }).unwrap();
            toast.success("Review added successfully!");
            setReviewForm({ rating: 5, comment: "" });
            refetchReviews();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add review");
        }
    };

    const handleAskQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to ask a question");
            return;
        }
        if (!questionForm.trim()) {
            toast.error("Please enter your question");
            return;
        }
        try {
            await askQuestion({
                hostelId,
                question: questionForm
            }).unwrap();
            toast.success("Question submitted successfully!");
            setQuestionForm("");
            refetchQuestions();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to submit question");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fcf2e9] dark:bg-[#1a0f0a]">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-12 h-12 border-4 border-[#2c1b13] dark:border-[#fcf2e9] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (!hostel) {
        return (
            <div className="min-h-screen bg-[#fcf2e9] dark:bg-[#1a0f0a]">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                    <HiOutlineKey size={64} className="text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                    <h2 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                        Hostel Not Found
                    </h2>
                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-6">
                        The hostel you're looking for doesn't exist or has been removed.
                    </p>
                    <Link 
                        href="/hostels"
                        className="px-6 py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-105 transition-transform"
                    >
                        Browse Hostels
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcf2e9] dark:bg-[#1a0f0a]">
            <Header />
            
            <main className="pt-24 pb-16 px-6 md:px-12">
                <div className="max-w-[1440px] mx-auto">
                    <Link 
                        href="/hostels"
                        className="inline-flex items-center gap-2 text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 hover:text-[#2c1b13] dark:hover:text-[#fcf2e9] mb-6 transition-colors"
                    >
                        <HiOutlineArrowLeft size={18} />
                        Back to Hostels
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="relative h-[400px] rounded-3xl overflow-hidden bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10">
                                {hostel.images?.[selectedImage] ? (
                                    <img 
                                        src={hostel.images[selectedImage].url} 
                                        alt={hostel.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <HiOutlinePhotograph size={64} className="text-[#2c1b13]/20 dark:text-[#fcf2e9]/20" />
                                    </div>
                                )}
                            </div>

                            {hostel.images && hostel.images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {hostel.images.map((img: any, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(i)}
                                            className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                                selectedImage === i 
                                                    ? "border-[#2c1b13] dark:border-[#fcf2e9]" 
                                                    : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                        >
                                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        hostel.type === 'Boys' 
                                            ? 'bg-blue-500 text-white' 
                                            : hostel.type === 'Girls' 
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-purple-500 text-white'
                                    }`}>
                                        <HiOutlineUsers className="inline mr-1" size={12} />
                                        {hostel.type}
                                    </span>
                                    {hostel.rating > 0 && (
                                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                                            <HiOutlineStar className="fill-yellow-500" size={14} />
                                            {hostel.rating.toFixed(1)}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                    {hostel.name}
                                </h1>
                            </div>

                            <div className="flex items-center gap-2 text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                                <HiOutlineLocationMarker size={20} />
                                <span>{hostel.address}, {hostel.city}</span>
                            </div>

                            <p className="text-[#2c1b13]/80 dark:text-[#fcf2e9]/80 leading-relaxed">
                                {hostel.description}
                            </p>

                            {rooms.length > 0 && (
                                <div className="p-4 rounded-2xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5">
                                    <span className="text-xs text-[#2c1b13]/40 dark:text-[#fcf2e9]/40">Starting from</span>
                                    <p className="text-3xl font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                        PKR {minPrice.toLocaleString()}<span className="text-lg font-normal opacity-60">/month</span>
                                    </p>
                                </div>
                            )}

                            {hostel.facilities && hostel.facilities.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">
                                        Facilities
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {hostel.facilities.map((facility: string, i: number) => (
                                            <span 
                                                key={i}
                                                className="px-3 py-1.5 rounded-lg bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-sm font-medium text-[#2c1b13] dark:text-[#fcf2e9] flex items-center gap-1"
                                            >
                                                <HiOutlineCheck size={14} className="text-green-500" />
                                                {facility}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {hostel.contactPhone && (
                                <a 
                                    href={`tel:${hostel.contactPhone}`}
                                    className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-105 transition-transform"
                                >
                                    <HiOutlinePhone size={20} />
                                    Contact: {hostel.contactPhone}
                                </a>
                            )}
                        </motion.div>
                    </div>

                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                        {[
                            { id: "rooms", label: "Rooms", icon: HiOutlineKey, count: rooms.length },
                            { id: "reviews", label: "Reviews", icon: HiOutlineStar, count: reviews.length },
                            { id: "questions", label: "Q&A", icon: HiOutlineQuestionMarkCircle, count: questions.length }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]"
                                        : "bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-[#2c1b13]/10"
                                }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    activeTab === tab.id 
                                        ? "bg-[#fcf2e9]/20 dark:bg-[#2c1b13]/20" 
                                        : "bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10"
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {activeTab === "rooms" && (
                        <section>
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <div className="flex gap-2">
                                    {ROOM_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedRoomType(type)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                selectedRoomType === type
                                                    ? "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]"
                                                    : "bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-[#2c1b13]/10"
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={showAvailableOnly}
                                        onChange={(e) => setShowAvailableOnly(e.target.checked)}
                                        className="w-4 h-4 rounded accent-[#2c1b13] dark:accent-[#fcf2e9]"
                                    />
                                    <span className="text-sm text-[#2c1b13] dark:text-[#fcf2e9]">Available only</span>
                                </label>
                            </div>

                            {filteredRooms.length === 0 ? (
                                <div className="text-center py-16 bg-white dark:bg-[#2c1b13] rounded-3xl">
                                    <HiOutlineKey size={48} className="mx-auto text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                                    <h3 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">No Rooms Found</h3>
                                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">Try adjusting your filters</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredRooms.map((room: any, index: number) => (
                                        <motion.div
                                            key={room._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white dark:bg-[#2c1b13] rounded-3xl overflow-hidden shadow-lg border border-[#2c1b13]/5 dark:border-white/5"
                                        >
                                            <div className="relative h-48 bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10">
                                                {room.images?.[0] ? (
                                                    <img src={room.images[0].url} alt={room.type} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <HiOutlinePhotograph size={40} className="text-[#2c1b13]/20 dark:text-[#fcf2e9]/20" />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 right-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${room.isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                                        {room.isAvailable ? "Available" : "Booked"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-lg font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{room.type}</h3>
                                                    <div className="flex items-center gap-1 text-[#2c1b13] dark:text-[#fcf2e9]">
                                                        <HiOutlineCurrencyDollar size={16} />
                                                        <span className="font-bold">{room.price.toLocaleString()}</span>
                                                        <span className="text-xs opacity-60">/mo</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 line-clamp-2 mb-4">{room.description}</p>
                                                {room.amenities?.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {room.amenities.slice(0, 4).map((amenity: string, i: number) => (
                                                            <span key={i} className="px-2 py-0.5 rounded bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-xs text-[#2c1b13]/70 dark:text-[#fcf2e9]/70">{amenity}</span>
                                                        ))}
                                                        {room.amenities.length > 4 && <span className="text-xs text-[#2c1b13]/40 dark:text-[#fcf2e9]/40">+{room.amenities.length - 4}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {activeTab === "reviews" && (
                        <section className="space-y-8">
                            <form onSubmit={handleSubmitReview} className="bg-white dark:bg-[#2c1b13] rounded-3xl p-6 border border-[#2c1b13]/5 dark:border-white/5">
                                <h3 className="font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">Write a Review</h3>
                                <div className="flex gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                            className="p-1"
                                        >
                                            <HiOutlineStar 
                                                size={28} 
                                                className={star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-[#2c1b13]/20 dark:text-[#fcf2e9]/20"} 
                                            />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                    placeholder="Share your experience..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/40 dark:placeholder:text-[#fcf2e9]/40 focus:outline-none resize-none mb-4"
                                />
                                <button
                                    type="submit"
                                    disabled={isAddingReview}
                                    className="px-6 py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isAddingReview ? <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : <HiOutlinePaperAirplane size={18} />}
                                    Submit Review
                                </button>
                            </form>

                            {reviews.length === 0 ? (
                                <div className="text-center py-16 bg-white dark:bg-[#2c1b13] rounded-3xl">
                                    <HiOutlineChatAlt2 size={48} className="mx-auto text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                                    <h3 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">No Reviews Yet</h3>
                                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">Be the first to share your experience!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((review: any) => (
                                        <div key={review._id} className="bg-white dark:bg-[#2c1b13] rounded-2xl p-6 border border-[#2c1b13]/5 dark:border-white/5">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 flex items-center justify-center shrink-0">
                                                    {review.user?.avatar?.url ? (
                                                        <img src={review.user.avatar.url} alt="" className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        <span className="text-lg font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{review.user?.name?.[0] || "U"}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{review.user?.name || "Anonymous"}</h4>
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <HiOutlineStar key={star} size={14} className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-[#2c1b13]/20"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-[#2c1b13]/80 dark:text-[#fcf2e9]/80">{review.comment}</p>
                                                    {review.reply && (
                                                        <div className="mt-4 p-4 rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5">
                                                            <p className="text-xs font-bold text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-1">Manager Reply:</p>
                                                            <p className="text-sm text-[#2c1b13]/80 dark:text-[#fcf2e9]/80">{review.reply.message}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {activeTab === "questions" && (
                        <section className="space-y-8">
                            <form onSubmit={handleAskQuestion} className="bg-white dark:bg-[#2c1b13] rounded-3xl p-6 border border-[#2c1b13]/5 dark:border-white/5">
                                <h3 className="font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">Ask a Question</h3>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={questionForm}
                                        onChange={(e) => setQuestionForm(e.target.value)}
                                        placeholder="What would you like to know about this hostel?"
                                        className="flex-1 px-4 py-3 rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/40 dark:placeholder:text-[#fcf2e9]/40 focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isAskingQuestion}
                                        className="px-6 py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isAskingQuestion ? <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : <HiOutlinePaperAirplane size={18} />}
                                        Ask
                                    </button>
                                </div>
                            </form>

                            {questions.length === 0 ? (
                                <div className="text-center py-16 bg-white dark:bg-[#2c1b13] rounded-3xl">
                                    <HiOutlineQuestionMarkCircle size={48} className="mx-auto text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                                    <h3 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">No Questions Yet</h3>
                                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">Be the first to ask a question!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {questions.map((q: any) => (
                                        <div key={q._id} className="bg-white dark:bg-[#2c1b13] rounded-2xl p-6 border border-[#2c1b13]/5 dark:border-white/5">
                                            <div className="flex items-start gap-3 mb-4">
                                                <HiOutlineQuestionMarkCircle size={24} className="text-blue-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{q.question}</p>
                                                    <p className="text-xs text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 mt-1">Asked by {q.user?.name || "Anonymous"}</p>
                                                </div>
                                            </div>
                                            {q.replies && q.replies.length > 0 && (
                                                <div className="pl-8 space-y-3">
                                                    {q.replies.map((reply: any, i: number) => (
                                                        <div key={i} className="p-4 rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5">
                                                            <p className="text-sm text-[#2c1b13]/80 dark:text-[#fcf2e9]/80">{reply.answer}</p>
                                                            <p className="text-xs text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 mt-2">— {reply.user?.name || "Manager"}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {(!q.replies || q.replies.length === 0) && (
                                                <p className="pl-8 text-sm text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 italic">Waiting for response...</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HostelDetailPage;
