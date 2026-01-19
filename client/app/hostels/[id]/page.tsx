"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetHostelByIdQuery } from "@/redux/features/hostel/hostelApi";
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
    HiOutlineCurrencyDollar
} from "react-icons/hi";
import { motion } from "framer-motion";

const ROOM_TYPES = ["All", "Single", "Double", "Three Seater", "Four Seater"];

const HostelDetailPage = () => {
    const params = useParams();
    const hostelId = params?.id as string;
    
    const { data, isLoading } = useGetHostelByIdQuery(hostelId, {
        skip: !hostelId
    });

    const hostel = data?.hostel;
    const rooms = data?.rooms || [];

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedRoomType, setSelectedRoomType] = useState("All");
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);

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

                    <section className="mt-16">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                    Available Rooms
                                </h2>
                                <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mt-1">
                                    {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex gap-2">
                                    {ROOM_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedRoomType(type)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                selectedRoomType === type
                                                    ? "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]"
                                                    : "bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10"
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
                        </div>

                        {filteredRooms.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-[#2c1b13] rounded-3xl">
                                <HiOutlineKey size={48} className="mx-auto text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                                <h3 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                                    No Rooms Found
                                </h3>
                                <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                                    Try adjusting your filters
                                </p>
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
                                                <img 
                                                    src={room.images[0].url} 
                                                    alt={room.type}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <HiOutlinePhotograph size={40} className="text-[#2c1b13]/20 dark:text-[#fcf2e9]/20" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    room.isAvailable 
                                                        ? "bg-green-500 text-white" 
                                                        : "bg-red-500 text-white"
                                                }`}>
                                                    {room.isAvailable ? "Available" : "Booked"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-lg font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                                    {room.type}
                                                </h3>
                                                <div className="flex items-center gap-1 text-[#2c1b13] dark:text-[#fcf2e9]">
                                                    <HiOutlineCurrencyDollar size={16} />
                                                    <span className="font-bold">{room.price.toLocaleString()}</span>
                                                    <span className="text-xs opacity-60">/mo</span>
                                                </div>
                                            </div>

                                            <p className="text-sm text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 line-clamp-2 mb-4">
                                                {room.description}
                                            </p>

                                            {room.amenities && room.amenities.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {room.amenities.slice(0, 4).map((amenity: string, i: number) => (
                                                        <span 
                                                            key={i}
                                                            className="px-2 py-0.5 rounded bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-xs text-[#2c1b13]/70 dark:text-[#fcf2e9]/70"
                                                        >
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                    {room.amenities.length > 4 && (
                                                        <span className="text-xs text-[#2c1b13]/40 dark:text-[#fcf2e9]/40">
                                                            +{room.amenities.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HostelDetailPage;
