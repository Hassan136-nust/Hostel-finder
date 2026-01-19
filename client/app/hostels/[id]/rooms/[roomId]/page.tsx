"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetHostelByIdQuery } from "@/redux/features/hostel/hostelApi";
import { useCheckFavoriteQuery, useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from "@/redux/features/favorites/favoritesApi";
import { useSelector } from "react-redux";
import Header from "../../../../components/ui/Header";
import Footer from "../../../../components/ui/Footer";
import { 
    HiOutlineArrowLeft,
    HiOutlinePhotograph,
    HiOutlineCheck,
    HiOutlineCurrencyDollar,
    HiOutlinePhone,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineLocationMarker,
    HiOutlineOfficeBuilding,
    HiOutlineHeart,
    HiHeart
} from "react-icons/hi";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const RoomDetailPage = () => {
    const params = useParams();
    const hostelId = params?.id as string;
    const roomId = params?.roomId as string;
    const { user } = useSelector((state: any) => state.auth);
    
    const { data, isLoading } = useGetHostelByIdQuery(hostelId, { skip: !hostelId });
    const { data: favoriteData, refetch: refetchFavorite } = useCheckFavoriteQuery(roomId, { skip: !roomId || !user });
    const [addToFavorites, { isLoading: isAdding }] = useAddToFavoritesMutation();
    const [removeFromFavorites, { isLoading: isRemoving }] = useRemoveFromFavoritesMutation();

    const hostel = data?.hostel;
    const rooms = data?.rooms || [];
    const room = rooms.find((r: any) => r._id === roomId);
    const isFavorite = favoriteData?.isFavorite || false;

    const [currentImage, setCurrentImage] = useState(0);

    const images = room?.images || [];
    const amenities = room?.amenities || [];

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

    const handleToggleFavorite = async () => {
        if (!user) {
            toast.error("Please login to add favorites");
            return;
        }
        try {
            if (isFavorite) {
                await removeFromFavorites(roomId).unwrap();
                toast.success("Removed from favorites");
            } else {
                await addToFavorites({ roomId }).unwrap();
                toast.success("Added to favorites!");
            }
            refetchFavorite();
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f8ede3] dark:bg-[#120a07]">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-12 h-12 border-4 border-[#2c1b13] dark:border-[#fcf2e9] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (!room || !hostel) {
        return (
            <div className="min-h-screen bg-[#f8ede3] dark:bg-[#120a07]">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                    <HiOutlineOfficeBuilding size={64} className="text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                    <h2 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">Room Not Found</h2>
                    <Link href={`/hostels/${hostelId}`} className="mt-4 px-6 py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold">Back to Hostel</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8ede3] dark:bg-[#120a07]">
            <Header />
            
            <section className="relative h-[60vh] min-h-[450px]">
                <div className="absolute inset-0">
                    {images.length > 0 ? (
                        <img src={images[currentImage].url} alt={room.type} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2c1b13] to-[#1a0f0a] flex items-center justify-center">
                            <HiOutlinePhotograph size={80} className="text-white/20" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                </div>

                {images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors">
                            <HiOutlineChevronLeft size={28} />
                        </button>
                        <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors">
                            <HiOutlineChevronRight size={28} />
                        </button>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                            {images.map((_: any, i: number) => (
                                <button key={i} onClick={() => setCurrentImage(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentImage ? "bg-white w-8" : "bg-white/50 hover:bg-white/70"}`} />
                            ))}
                        </div>
                    </>
                )}

                <div className="absolute top-24 left-6 md:left-12 z-10">
                    <Link href={`/hostels/${hostelId}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all">
                        <HiOutlineArrowLeft size={18} /> Back to {hostel.name}
                    </Link>
                </div>

                <div className="absolute top-24 right-6 md:right-12 z-10 flex items-center gap-3">
                    <button
                        onClick={handleToggleFavorite}
                        disabled={isAdding || isRemoving}
                        className={`p-3 rounded-full backdrop-blur-md transition-all ${isFavorite ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        {isFavorite ? <HiHeart size={22} /> : <HiOutlineHeart size={22} />}
                    </button>
                    <span className={`px-5 py-2.5 rounded-full text-sm font-bold ${room.isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                        {room.isAvailable ? "✓ Available for Booking" : "✗ Currently Booked"}
                    </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="max-w-[1440px] mx-auto">
                        <p className="text-white/60 mb-2">{hostel.name}</p>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">{room.type} Room</h1>
                    </div>
                </div>
            </section>

            <main className="relative -mt-6 z-10">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#2c1b13] rounded-3xl p-8 shadow-xl">
                                <h2 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">About This Room</h2>
                                <p className="text-[#2c1b13]/80 dark:text-[#fcf2e9]/80 leading-relaxed text-lg">
                                    {room.description || "A comfortable and well-maintained room perfect for students and working professionals. Enjoy a peaceful living environment with all essential amenities included."}
                                </p>
                            </motion.div>

                            {amenities.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#2c1b13] rounded-3xl p-8 shadow-xl">
                                    <h2 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-6">Room Amenities</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {amenities.map((amenity: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                                                <HiOutlineCheck size={22} />
                                                <span className="font-medium">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {images.length > 1 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-[#2c1b13] rounded-3xl p-8 shadow-xl">
                                    <h2 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-6">Photo Gallery</h2>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                        {images.map((img: any, i: number) => (
                                            <button key={i} onClick={() => setCurrentImage(i)} className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${i === currentImage ? "border-[#2c1b13] dark:border-[#fcf2e9] ring-4 ring-[#2c1b13]/20" : "border-transparent opacity-70 hover:opacity-100"}`}>
                                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#2c1b13] rounded-3xl p-8 shadow-xl">
                                    <div className="flex items-center gap-2 text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                                        <HiOutlineCurrencyDollar size={28} />
                                        <span className="text-4xl font-bold">PKR {room.price.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-6">per month</p>

                                    {hostel.contactPhone && room.isAvailable && (
                                        <a href={`tel:${hostel.contactPhone}`} className="block w-full py-4 rounded-2xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold text-center text-lg hover:scale-[1.02] active:scale-95 transition-transform mb-4">
                                            <HiOutlinePhone className="inline mr-2" size={20} />
                                            Book Now: {hostel.contactPhone}
                                        </a>
                                    )}

                                    {!room.isAvailable && (
                                        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-center mb-4">
                                            <p className="text-red-600 dark:text-red-400 font-medium text-sm">Currently booked. Contact hostel for availability.</p>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 space-y-4 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">Room Type</span>
                                            <span className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{room.type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">Status</span>
                                            <span className={`font-bold ${room.isAvailable ? "text-green-600" : "text-red-600"}`}>
                                                {room.isAvailable ? "Available" : "Booked"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">Amenities</span>
                                            <span className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{amenities.length}</span>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#2c1b13] rounded-3xl p-6 shadow-xl">
                                    <h3 className="font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">Hostel Info</h3>
                                    <Link href={`/hostels/${hostelId}`} className="flex items-center gap-3 p-3 rounded-xl bg-[#f8ede3] dark:bg-[#1a0f0a] hover:bg-[#2c1b13]/5 transition-colors">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#2c1b13]/10 shrink-0">
                                            {hostel.images?.[0] ? <img src={hostel.images[0].url} alt="" className="w-full h-full object-cover" /> : <HiOutlineOfficeBuilding size={20} className="m-auto h-full opacity-30" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-[#2c1b13] dark:text-[#fcf2e9] truncate">{hostel.name}</p>
                                            <p className="text-xs text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 flex items-center gap-1">
                                                <HiOutlineLocationMarker size={12} />{hostel.city}
                                            </p>
                                        </div>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="py-12" />
            <Footer />
        </div>
    );
};

export default RoomDetailPage;
