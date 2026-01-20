"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
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
    HiOutlinePaperAirplane,
    HiOutlineMap,
    HiOutlineShare,
    HiOutlineEyeOff
} from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const HostelMap = dynamic(() => import("../../components/HostelMap"), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 animate-pulse rounded-2xl" />
});

const ROOM_TYPES = ["All", "Single", "Double", "Three Seater", "Four Seater"];

const HostelDetailClient = () => {
    const params = useParams();
    const hostelId = params?.id as string;
    const { user } = useSelector((state: any) => state.auth);
    
    const { data, isLoading } = useGetHostelByIdQuery(hostelId, { skip: !hostelId });
    const { data: reviewsData, refetch: refetchReviews } = useGetHostelReviewsQuery(hostelId, { skip: !hostelId });
    const { data: questionsData, refetch: refetchQuestions } = useGetHostelQuestionsQuery(hostelId, { skip: !hostelId });

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
            if (selectedRoomType !== "All" && room.type !== selectedRoomType) return false;
            if (showAvailableOnly && !room.isAvailable) return false;
            return true;
        });
    }, [rooms, selectedRoomType, showAvailableOnly]);

    const minPrice = rooms.length > 0 ? Math.min(...rooms.map((r: any) => r.price)) : 0;
    const avgRating = reviews.length > 0 
        ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1) 
        : null;

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return toast.error("Please login to add a review");
        if (!reviewForm.comment.trim()) return toast.error("Please write a comment");
        try {
            await addReview({ hostelId, rating: reviewForm.rating, comment: reviewForm.comment }).unwrap();
            toast.success("Review added!");
            setReviewForm({ rating: 5, comment: "" });
            refetchReviews();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add review");
        }
    };

    const handleAskQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return toast.error("Please login to ask a question");
        if (!questionForm.trim()) return toast.error("Please enter your question");
        try {
            await askQuestion({ hostelId, question: questionForm }).unwrap();
            toast.success("Question submitted!");
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
                    <h2 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">Hostel Not Found</h2>
                    <Link href="/hostels" className="mt-4 px-6 py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold">Browse Hostels</Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Check if hostel is deactivated
    if (data?.isDeactivated || hostel.isActive === false) {
        return (
            <div className="min-h-screen bg-[#fcf2e9] dark:bg-[#1a0f0a]">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                    <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6">
                        <HiOutlineEyeOff size={48} className="text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                        Hostel Temporarily Unavailable
                    </h2>
                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-6 max-w-md">
                        {hostel.name} is currently not accepting visitors. Please check back later or browse other hostels.
                    </p>
                    <Link href="/hostels" className="px-6 py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-105 transition-transform">
                        Browse Other Hostels
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8ede3] dark:bg-[#120a07]">
            <Header />
            
            <section className="relative h-[70vh] min-h-[500px]">
                <div className="absolute inset-0">
                    {hostel.images?.[selectedImage] ? (
                        <img src={hostel.images[selectedImage].url} alt={hostel.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2c1b13] to-[#1a0f0a] flex items-center justify-center">
                            <HiOutlinePhotograph size={80} className="text-white/20" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                </div>

                <div className="absolute top-24 left-6 md:left-12 z-10">
                    <Link href="/hostels" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all">
                        <HiOutlineArrowLeft size={18} /> Back
                    </Link>
                </div>

                <div className="absolute top-24 right-6 md:right-12 z-10 flex gap-2">
                    <button 
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: hostel.name,
                                    text: `Check out ${hostel.name} on HostelFinder!`,
                                    url: window.location.href
                                });
                            } else {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied to clipboard!");
                            }
                        }}
                        className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
                        title="Share hostel"
                    >
                        <HiOutlineShare size={20} />
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md ${
                                hostel.type === 'Boys' ? 'bg-blue-500/80 text-white' : 
                                hostel.type === 'Girls' ? 'bg-pink-500/80 text-white' : 
                                'bg-purple-500/80 text-white'
                            }`}>
                                <HiOutlineUsers className="inline mr-1.5" size={14} />{hostel.type}
                            </span>
                            {avgRating && (
                                <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-yellow-400/90 text-yellow-900 text-sm font-bold backdrop-blur-md">
                                    <HiOutlineStar className="fill-current" size={16} />{avgRating} <span className="font-normal opacity-70">({reviews.length})</span>
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-3">{hostel.name}</h1>
                        <div className="flex items-center gap-2 text-white/80">
                            <HiOutlineLocationMarker size={20} />
                            <span className="text-lg">{hostel.address}, {hostel.city}</span>
                        </div>
                    </div>
                </div>

                {hostel.images && hostel.images.length > 1 && (
                    <div className="absolute bottom-6 right-6 md:right-12 flex gap-2">
                        {hostel.images.slice(0, 5).map((img: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                                    selectedImage === i ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                            >
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </section>

            <main className="relative -mt-8 z-10">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#2c1b13] rounded-3xl p-8 shadow-xl">
                                <h2 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">About</h2>
                                <p className="text-[#2c1b13]/80 dark:text-[#fcf2e9]/80 leading-relaxed">{hostel.description}</p>
                                
                                {hostel.facilities?.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-[#2c1b13]/10 dark:border-[#fcf2e9]/10">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-4">Facilities</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {hostel.facilities.map((f: string, i: number) => (
                                                <div key={i} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                                                    <HiOutlineCheck size={18} /><span className="text-sm font-medium">{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {hostel.coordinates?.lat && hostel.coordinates?.lng && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#2c1b13] rounded-3xl p-8 shadow-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] flex items-center gap-2">
                                            <HiOutlineMap size={24} /> Location
                                        </h2>
                                        <a 
                                            href={`https://www.google.com/maps?q=${hostel.coordinates.lat},${hostel.coordinates.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-blue-600 hover:underline"
                                        >
                                            Open in Google Maps →
                                        </a>
                                    </div>
                                    <div className="h-[300px] rounded-2xl overflow-hidden">
                                        <HostelMap lat={hostel.coordinates.lat} lng={hostel.coordinates.lng} name={hostel.name} />
                                    </div>
                                </motion.div>
                            )}

                            <div className="bg-white dark:bg-[#2c1b13] rounded-3xl shadow-xl overflow-hidden">
                                <div className="flex border-b border-[#2c1b13]/10 dark:border-[#fcf2e9]/10">
                                    {[
                                        { id: "rooms", label: "Rooms", icon: HiOutlineKey, count: rooms.length },
                                        { id: "reviews", label: "Reviews", icon: HiOutlineStar, count: reviews.length },
                                        { id: "questions", label: "Q&A", icon: HiOutlineQuestionMarkCircle, count: questions.length }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${
                                                activeTab === tab.id
                                                    ? "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]"
                                                    : "text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 hover:bg-[#2c1b13]/5"
                                            }`}
                                        >
                                            <tab.icon size={18} />{tab.label}<span className="text-xs opacity-70">({tab.count})</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="p-6">
                                    {activeTab === "rooms" && (
                                        <div className="space-y-6">
                                            <div className="flex flex-wrap items-center gap-3">
                                                {ROOM_TYPES.map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => setSelectedRoomType(type)}
                                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                            selectedRoomType === type
                                                                ? "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]"
                                                                : "bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-[#2c1b13] dark:text-[#fcf2e9]"
                                                        }`}
                                                    >{type}</button>
                                                ))}
                                                <label className="flex items-center gap-2 cursor-pointer ml-auto">
                                                    <input type="checkbox" checked={showAvailableOnly} onChange={(e) => setShowAvailableOnly(e.target.checked)} className="w-4 h-4 rounded" />
                                                    <span className="text-sm text-[#2c1b13] dark:text-[#fcf2e9]">Available only</span>
                                                </label>
                                            </div>

                                            {filteredRooms.length === 0 ? (
                                                <div className="text-center py-12">
                                                    <HiOutlineKey size={48} className="mx-auto text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                                                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">No rooms found</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-6">
                                                    {filteredRooms.map((room: any) => (
                                                        <Link
                                                            key={room._id}
                                                            href={`/hostels/${hostelId}/rooms/${room._id}`}
                                                            className="group block bg-[#f8ede3] dark:bg-[#1a0f0a] rounded-3xl overflow-hidden border border-[#2c1b13]/5 dark:border-[#fcf2e9]/5 hover:border-[#2c1b13]/20 dark:hover:border-[#fcf2e9]/20 hover:shadow-2xl transition-all"
                                                        >
                                                            <div className="flex flex-col md:flex-row">
                                                                <div className="relative w-full md:w-72 h-52 md:h-auto shrink-0 overflow-hidden">
                                                                    {room.images?.[0] ? (
                                                                        <img src={room.images[0].url} alt={room.type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 flex items-center justify-center">
                                                                            <HiOutlinePhotograph size={48} className="opacity-30" />
                                                                        </div>
                                                                    )}
                                                                    <div className="absolute top-4 left-4">
                                                                        <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md ${room.isAvailable ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"}`}>
                                                                            {room.isAvailable ? "✓ Available" : "Booked"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 p-6 flex flex-col justify-between">
                                                                    <div>
                                                                        <div className="flex items-start justify-between gap-4 mb-3">
                                                                            <h3 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                                                                {room.type} Room
                                                                            </h3>
                                                                            <div className="text-right shrink-0">
                                                                                <p className="text-2xl font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                                                                    PKR {room.price.toLocaleString()}
                                                                                </p>
                                                                                <span className="text-xs text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">per month</span>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 line-clamp-2 mb-4">
                                                                            {room.description || "Comfortable room with all essential amenities included."}
                                                                        </p>
                                                                        {room.amenities?.length > 0 && (
                                                                            <div className="flex flex-wrap gap-2 mb-4">
                                                                                {room.amenities.slice(0, 5).map((a: string, i: number) => (
                                                                                    <span key={i} className="px-3 py-1 rounded-full bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-xs font-medium text-[#2c1b13] dark:text-[#fcf2e9]">
                                                                                        {a}
                                                                                    </span>
                                                                                ))}
                                                                                {room.amenities.length > 5 && (
                                                                                    <span className="px-3 py-1 rounded-full bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-xs font-medium text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                                                                                        +{room.amenities.length - 5} more
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center justify-end pt-4 border-t border-[#2c1b13]/10 dark:border-[#fcf2e9]/10">
                                                                        <span className="text-sm font-medium text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 group-hover:text-[#2c1b13] dark:group-hover:text-[#fcf2e9] transition-colors">
                                                                            View Room Details →
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "reviews" && (
                                        <div className="space-y-6">
                                            <form onSubmit={handleSubmitReview} className="p-4 rounded-2xl bg-[#f8ede3] dark:bg-[#1a0f0a]">
                                                <div className="flex gap-1 mb-3">
                                                    {[1,2,3,4,5].map((star) => (
                                                        <button key={star} type="button" onClick={() => setReviewForm(p => ({...p, rating: star}))}>
                                                            <HiOutlineStar size={28} className={star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-[#2c1b13]/20"} />
                                                        </button>
                                                    ))}
                                                </div>
                                                <textarea value={reviewForm.comment} onChange={(e) => setReviewForm(p => ({...p, comment: e.target.value}))} placeholder="Share your experience..." rows={3} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#2c1b13] border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] placeholder:opacity-40 focus:outline-none resize-none mb-3" />
                                                <button type="submit" disabled={isAddingReview} className="px-5 py-2.5 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold flex items-center gap-2 disabled:opacity-50">
                                                    {isAddingReview ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : <HiOutlinePaperAirplane size={16} />} Submit
                                                </button>
                                            </form>

                                            {reviews.length === 0 ? (
                                                <div className="text-center py-12"><HiOutlineChatAlt2 size={48} className="mx-auto opacity-20 mb-4" /><p className="opacity-60">No reviews yet</p></div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {reviews.map((r: any) => (
                                                        <div key={r._id} className="p-4 rounded-2xl bg-[#f8ede3] dark:bg-[#1a0f0a]">
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-[#2c1b13]/10 flex items-center justify-center shrink-0 text-sm font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{r.user?.name?.[0] || "U"}</div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{r.user?.name || "Anonymous"}</span>
                                                                        <div className="flex">{[1,2,3,4,5].map(s => <HiOutlineStar key={s} size={14} className={s <= r.rating ? "fill-yellow-400 text-yellow-400" : "opacity-20"} />)}</div>
                                                                    </div>
                                                                    <p className="mt-1 text-sm text-[#2c1b13]/80 dark:text-[#fcf2e9]/80">{r.comment}</p>
                                                                    {r.reply && (
                                                                        <div className="mt-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
                                                                            <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-1">✓ Hostel Response</p>
                                                                            <p className="text-sm text-green-800 dark:text-green-300">{r.reply.message}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "questions" && (
                                        <div className="space-y-6">
                                            <form onSubmit={handleAskQuestion} className="flex gap-3">
                                                <input type="text" value={questionForm} onChange={(e) => setQuestionForm(e.target.value)} placeholder="Ask a question..." className="flex-1 px-4 py-3 rounded-xl bg-[#f8ede3] dark:bg-[#1a0f0a] border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] placeholder:opacity-40 focus:outline-none" />
                                                <button type="submit" disabled={isAskingQuestion} className="px-5 py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold disabled:opacity-50">
                                                    {isAskingQuestion ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : "Ask"}
                                                </button>
                                            </form>

                                            {questions.length === 0 ? (
                                                <div className="text-center py-12"><HiOutlineQuestionMarkCircle size={48} className="mx-auto opacity-20 mb-4" /><p className="opacity-60">No questions yet</p></div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {questions.map((q: any) => (
                                                        <div key={q._id} className="p-4 rounded-2xl bg-[#f8ede3] dark:bg-[#1a0f0a]">
                                                            <div className="flex gap-3">
                                                                <HiOutlineQuestionMarkCircle size={24} className="text-blue-500 shrink-0 mt-0.5" />
                                                                <div className="flex-1">
                                                                    <p className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{q.question}</p>
                                                                    <p className="text-xs opacity-50 mt-1">by {q.user?.name || "Anonymous"}</p>
                                                                    {q.replies?.length > 0 && q.replies.map((a: any, i: number) => (
                                                                        <div key={i} className="mt-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
                                                                            <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-1">✓ Hostel Response</p>
                                                                            <p className="text-sm text-green-800 dark:text-green-300">{a.answer}</p>
                                                                        </div>
                                                                    ))}
                                                                    {(!q.replies || q.replies.length === 0) && <p className="mt-2 text-sm opacity-40 italic">Awaiting response...</p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#2c1b13] rounded-3xl p-6 shadow-xl">
                                    {rooms.length > 0 && (
                                        <div className="mb-6">
                                            <span className="text-sm text-[#2c1b13]/40 dark:text-[#fcf2e9]/40">Starting from</span>
                                            <p className="text-4xl font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                                PKR {minPrice.toLocaleString()}<span className="text-lg font-normal opacity-50">/mo</span>
                                            </p>
                                        </div>
                                    )}

                                    {hostel.contactPhone && (
                                        <div className="space-y-3">
                                            <a href={`tel:${hostel.contactPhone}`} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold text-lg hover:scale-[1.02] active:scale-95 transition-transform">
                                                <HiOutlinePhone size={22} /> {hostel.contactPhone}
                                            </a>
                                            <a 
                                                href={`https://wa.me/${hostel.contactPhone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi, I saw your hostel (${hostel.name}) on HOSTELITE and want to know about availability.`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-green-500/20"
                                            >
                                                <FaWhatsapp size={22} /> Chat on WhatsApp
                                            </a>
                                        </div>
                                    )}

                                    <div className="mt-6 pt-6 border-t border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="opacity-60">Rooms</span><span className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{rooms.length}</span></div>
                                        <div className="flex justify-between"><span className="opacity-60">Available</span><span className="font-bold text-green-600">{rooms.filter((r:any) => r.isAvailable).length}</span></div>
                                        <div className="flex justify-between"><span className="opacity-60">Reviews</span><span className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{reviews.length}</span></div>
                                        {avgRating && <div className="flex justify-between"><span className="opacity-60">Rating</span><span className="font-bold text-yellow-600">{avgRating} ⭐</span></div>}
                                    </div>
                                </motion.div>

                                {hostel.tags?.length > 0 && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#2c1b13] rounded-3xl p-6 shadow-xl">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-4">Nearby</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {hostel.tags.map((tag: string, i: number) => (
                                                <span key={i} className="px-3 py-1.5 rounded-full bg-[#f8ede3] dark:bg-[#1a0f0a] text-sm text-[#2c1b13] dark:text-[#fcf2e9]">📍 {tag}</span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HostelDetailClient;
