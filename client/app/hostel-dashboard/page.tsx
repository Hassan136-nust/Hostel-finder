"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StatsCard from "../components/Dashboard/StatsCard";
import { 
    HiOutlineOfficeBuilding, 
    HiOutlineKey, 
    HiOutlineStar, 
    HiOutlineQuestionMarkCircle,
    HiOutlinePlus,
    HiOutlineArrowRight,
    HiOutlinePencil,
    HiOutlineEye,
    HiOutlineLocationMarker
} from "react-icons/hi";
import { useGetMyHostelQuery } from "@/redux/features/hostel/hostelApi";
import { useGetHostelRoomsQuery } from "@/redux/features/room/roomApi";
import { useGetHostelReviewsQuery } from "@/redux/features/review/reviewApi";
import { useGetHostelQuestionsQuery } from "@/redux/features/questions/questionApi";
import { format } from "timeago.js";

const DashboardPage = () => {
    const { data: hostelData, isLoading: hostelLoading } = useGetMyHostelQuery({});
    const [hostelId, setHostelId] = useState("");

    useEffect(() => {
        if (hostelData?.hostel?._id) {
            setHostelId(hostelData.hostel._id);
        }
    }, [hostelData]);

    const { data: roomsData, isLoading: roomsLoading } = useGetHostelRoomsQuery(hostelId, {
        skip: !hostelId
    });

    const { data: reviewsData, isLoading: reviewsLoading } = useGetHostelReviewsQuery(hostelId, {
        skip: !hostelId
    });

    const { data: questionsData, isLoading: questionsLoading } = useGetHostelQuestionsQuery(hostelId, {
        skip: !hostelId
    });

    const isLoading = hostelLoading || roomsLoading || reviewsLoading || questionsLoading;

    if (hostelLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-[#2c1b13] dark:text-[#fcf2e9]">
                <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!hostelData?.hostel) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-24 h-24 bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 rounded-full flex items-center justify-center">
                    <HiOutlineOfficeBuilding size={48} className="text-[#2c1b13] dark:text-[#fcf2e9]" />
                </div>
                <div className="max-w-md">
                    <h2 className="text-3xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                        Setup Your Hostel
                    </h2>
                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-8">
                        You haven't listed your hostel yet. Create your listing to start managing rooms and bookings.
                    </p>
                    <Link 
                        href="/hostel-dashboard/my-hostel"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] rounded-xl font-bold hover:scale-105 transition-transform"
                    >
                        <HiOutlinePlus size={20} />
                        Get Started
                    </Link>
                </div>
            </div>
        );
    }

    const rooms = roomsData?.rooms || [];
    const reviews = reviewsData?.reviews || [];
    const questions = questionsData?.questions || [];
    const availableRooms = rooms.filter((r: any) => r.isAvailable).length;
    const avgRating = hostelData.hostel.rating || 0;
    const pendingQuestions = questions.filter((q: any) => !q.replies || q.replies.length === 0).length;

    const stats = [
        {
            title: "Total Rooms",
            value: rooms.length,
            icon: HiOutlineKey,
        },
        {
            title: "Available",
            value: availableRooms,
            icon: HiOutlineOfficeBuilding,
        },
        {
            title: "Reviews",
            value: reviews.length,
            icon: HiOutlineStar,
        },
        {
            title: "Pending Q&A",
            value: pendingQuestions,
            icon: HiOutlineQuestionMarkCircle,
        }
    ];

    const quickActions = [
        {
            title: "Add Room",
            description: "List a new room",
            icon: HiOutlinePlus,
            href: "/hostel-dashboard/rooms",
            color: "bg-green-500/10 text-green-600"
        },
        {
            title: "View Hostel",
            description: "See public listing",
            icon: HiOutlineEye,
            href: `/hostels/${hostelId}`,
            color: "bg-blue-500/10 text-blue-600"
        },
        {
            title: "Edit Info",
            description: "Update details",
            icon: HiOutlinePencil,
            href: "/hostel-dashboard/my-hostel",
            color: "bg-orange-500/10 text-orange-600"
        },
        {
            title: "Set Location",
            description: "Pin on map",
            icon: HiOutlineLocationMarker,
            href: "/hostel-dashboard/my-hostel",
            color: "bg-purple-500/10 text-purple-600"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                        Dashboard Overview
                    </h1>
                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mt-1">
                        Welcome back! Here's what's happening at <span className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{hostelData.hostel.name}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-[#2c1b13] dark:text-[#fcf2e9]">Live</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        loading={isLoading}
                    />
                ))}
            </div>

            <div className="bg-[#fcf2e9] dark:bg-[#2c1b13] p-6 rounded-[2rem] border border-[#2c1b13]/10 dark:border-white/10">
                <h3 className="text-lg font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/5 dark:bg-black/10 hover:bg-white/10 dark:hover:bg-black/20 border border-[#2c1b13]/5 dark:border-white/5 transition-all hover:scale-[1.02] group"
                        >
                            <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                                <action.icon size={24} />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-sm text-[#2c1b13] dark:text-[#fcf2e9]">{action.title}</p>
                                <p className="text-xs text-[#2c1b13]/50 dark:text-[#fcf2e9]/50">{action.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#fcf2e9] dark:bg-[#2c1b13] p-8 rounded-[2rem] border border-[#2c1b13]/10 dark:border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">Recent Rooms</h3>
                        <Link href="/hostel-dashboard/rooms" className="text-sm font-bold text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 hover:text-[#2c1b13] dark:hover:text-[#fcf2e9] flex items-center gap-1">
                            View All <HiOutlineArrowRight />
                        </Link>
                    </div>
                    
                    {rooms.length > 0 ? (
                        <div className="space-y-4">
                            {rooms.slice(0, 4).map((room: any) => (
                                <div key={room._id} className="flex items-center justify-between p-4 bg-white/5 dark:bg-black/20 rounded-2xl hover:bg-white/10 dark:hover:bg-black/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 flex items-center justify-center">
                                            {room.images?.[0] ? (
                                                <img src={room.images[0].url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <HiOutlineKey className="text-[#2c1b13]/40 dark:text-[#fcf2e9]/40" size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{room.type}</h4>
                                            <p className="text-xs text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">{room.price?.toLocaleString()} PKR / month</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${room.isAvailable ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                        {room.isAvailable ? 'Available' : 'Booked'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-[#2c1b13]/40 dark:text-[#fcf2e9]/40">
                            <HiOutlineKey size={40} className="mb-3 opacity-50" />
                            <p className="font-medium">No rooms added yet</p>
                            <Link href="/hostel-dashboard/rooms" className="mt-3 text-sm font-bold text-[#2c1b13] dark:text-[#fcf2e9] hover:underline flex items-center gap-1">
                                <HiOutlinePlus size={16} /> Add your first room
                            </Link>
                        </div>
                    )}
                </div>
                
                <div className="bg-[#fcf2e9] dark:bg-[#2c1b13] p-8 rounded-[2rem] border border-[#2c1b13]/10 dark:border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">Recent Reviews</h3>
                        <Link href="/hostel-dashboard/reviews" className="text-sm font-bold text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 hover:text-[#2c1b13] dark:hover:text-[#fcf2e9] flex items-center gap-1">
                            All <HiOutlineArrowRight />
                        </Link>
                    </div>
                    
                    {reviews.length > 0 ? (
                        <div className="space-y-5">
                            {reviews.slice(0, 3).map((review: any) => (
                                <div key={review._id} className="border-b border-[#2c1b13]/5 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-[#2c1b13] dark:bg-[#fcf2e9] overflow-hidden flex items-center justify-center">
                                                {review.user?.avatar?.url ? (
                                                    <img src={review.user.avatar.url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-[#fcf2e9] dark:text-[#2c1b13] text-xs font-bold">
                                                        {review.user?.name?.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-bold text-sm text-[#2c1b13] dark:text-[#fcf2e9]">{review.user?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                                            <HiOutlineStar className="text-yellow-500 fill-yellow-500" size={12} />
                                            <span className="text-xs font-bold text-yellow-600">{review.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 line-clamp-2">"{review.comment}"</p>
                                    <p className="text-[10px] text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 mt-2">
                                        {format(review.createdAt)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-[#2c1b13]/40 dark:text-[#fcf2e9]/40">
                            <HiOutlineStar size={40} className="mb-3 opacity-50" />
                            <p className="font-medium">No reviews yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
