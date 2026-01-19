"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StatsCard from "../components/Dashboard/StatsCard";
import { 
    HiOutlineOfficeBuilding, 
    HiOutlineKey, 
    HiOutlineStar, 
    HiOutlineUsers,
    HiOutlinePlus,
    HiOutlineArrowRight
} from "react-icons/hi";
import { useGetMyHostelQuery } from "@/redux/features/hostel/hostelApi";
import { useGetHostelRoomsQuery } from "@/redux/features/room/roomApi";
import { useGetHostelReviewsQuery } from "@/redux/features/review/reviewApi";
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

    const isLoading = hostelLoading || roomsLoading || reviewsLoading;

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
    const availableRooms = rooms.filter((r: any) => r.isAvailable).length;
    const avgRating = hostelData.hostel.rating || 0;

    const stats = [
        {
            title: "Total Rooms",
            value: rooms.length,
            icon: HiOutlineKey,
            change: 0 
        },
        {
            title: "Available Rooms",
            value: availableRooms,
            icon: HiOutlineOfficeBuilding,
            change: 0
        },
        {
            title: "Total Reviews",
            value: reviews.length,
            icon: HiOutlineStar,
            change: 0
        },
        {
            title: "Average Rating",
            value: avgRating.toFixed(1),
            icon: HiOutlineUsers,
            change: 0
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                    Dashboard Overview
                </h1>
                <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mt-1">
                    Welcome back, here's what's happening at <span className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{hostelData.hostel.name}</span> today.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        change={stat.change}
                        loading={isLoading}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#fcf2e9] dark:bg-[#2c1b13] p-8 rounded-[2rem] border border-[#2c1b13]/10 dark:border-white/10 min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">Recent Rooms</h3>
                        <Link href="/hostel-dashboard/rooms" className="text-sm font-bold text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 hover:text-[#2c1b13] dark:hover:text-[#fcf2e9] flex items-center gap-1">
                            View All <HiOutlineArrowRight />
                        </Link>
                    </div>
                    
                    {rooms.length > 0 ? (
                        <div className="space-y-4">
                            {rooms.slice(0, 4).map((room: any) => (
                                <div key={room._id} className="flex items-center justify-between p-4 bg-white/5 dark:bg-black/20 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200">
                                            {room.images?.[0] && (
                                                <img src={room.images[0].url} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{room.type}</h4>
                                            <p className="text-xs text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">{room.price} PKR / month</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${room.isAvailable ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                        {room.isAvailable ? 'Available' : 'Booked'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 font-medium italic">
                            <p>No rooms added yet</p>
                            <Link href="/hostel-dashboard/rooms" className="mt-4 text-sm font-bold text-[#2c1b13] dark:text-[#fcf2e9] hover:underline">
                                Add your first room
                            </Link>
                        </div>
                    )}
                </div>
                
                <div className="bg-[#fcf2e9] dark:bg-[#2c1b13] p-8 rounded-[2rem] border border-[#2c1b13]/10 dark:border-white/10 min-h-[400px]">
                    <h3 className="text-xl font-heading font-bold mb-6 text-[#2c1b13] dark:text-[#fcf2e9]">Recent Reviews</h3>
                    
                    {reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.slice(0, 3).map((review: any) => (
                                <div key={review._id} className="border-b border-[#2c1b13]/5 dark:border-white/5 pb-4 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-[#2c1b13] dark:bg-[#fcf2e9] overflow-hidden">
                                                {review.user?.avatar?.url ? (
                                                    <img src={review.user.avatar.url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#fcf2e9] dark:text-[#2c1b13] text-xs font-bold">
                                                        {review.user?.name?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-bold text-sm text-[#2c1b13] dark:text-[#fcf2e9]">{review.user?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <HiOutlineStar className="text-yellow-500" size={14} />
                                            <span className="text-xs font-bold">{review.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 line-clamp-2 italic">"{review.comment}"</p>
                                    <p className="text-[10px] text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 mt-2 text-right">
                                        {format(review.createdAt)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 font-medium italic">
                            No reviews yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
