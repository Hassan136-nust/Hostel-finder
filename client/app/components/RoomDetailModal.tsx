"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    HiOutlineX,
    HiOutlinePhotograph,
    HiOutlineCheck,
    HiOutlineCurrencyDollar,
    HiOutlineChevronLeft,
    HiOutlineChevronRight
} from "react-icons/hi";

interface RoomDetailModalProps {
    room: any;
    isOpen: boolean;
    onClose: () => void;
    hostelPhone?: string;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, isOpen, onClose, hostelPhone }) => {
    const [currentImage, setCurrentImage] = useState(0);

    if (!room) return null;

    const images = room.images || [];
    const amenities = room.amenities || [];

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white dark:bg-[#2c1b13] rounded-3xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-colors"
                        >
                            <HiOutlineX size={24} />
                        </button>

                        <div className="relative h-72 md:h-80 bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10">
                            {images.length > 0 ? (
                                <>
                                    <img
                                        src={images[currentImage].url}
                                        alt={room.type}
                                        className="w-full h-full object-cover"
                                    />
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-colors"
                                            >
                                                <HiOutlineChevronLeft size={24} />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-colors"
                                            >
                                                <HiOutlineChevronRight size={24} />
                                            </button>
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                                {images.map((_: any, i: number) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentImage(i)}
                                                        className={`w-2 h-2 rounded-full transition-all ${
                                                            i === currentImage ? "bg-white w-6" : "bg-white/50"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <HiOutlinePhotograph size={64} className="text-[#2c1b13]/20 dark:text-[#fcf2e9]/20" />
                                </div>
                            )}

                            <div className="absolute top-4 left-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                    room.isAvailable 
                                        ? "bg-green-500 text-white" 
                                        : "bg-red-500 text-white"
                                }`}>
                                    {room.isAvailable ? "✓ Available" : "✗ Booked"}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-20rem)]">
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                        {room.type} Room
                                    </h2>
                                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mt-1">
                                        Perfect for students and working professionals
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="flex items-center gap-1 text-[#2c1b13] dark:text-[#fcf2e9]">
                                        <HiOutlineCurrencyDollar size={20} />
                                        <span className="text-2xl font-bold">{room.price.toLocaleString()}</span>
                                    </div>
                                    <span className="text-sm text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">per month</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">
                                    Description
                                </h3>
                                <p className="text-[#2c1b13]/80 dark:text-[#fcf2e9]/80 leading-relaxed">
                                    {room.description || "A comfortable and well-maintained room perfect for your stay."}
                                </p>
                            </div>

                            {amenities.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">
                                        Amenities
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {amenities.map((amenity: string, i: number) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                            >
                                                <HiOutlineCheck size={18} />
                                                <span className="text-sm font-medium">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {images.length > 1 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">
                                        Gallery
                                    </h3>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {images.map((img: any, i: number) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentImage(i)}
                                                className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                                    i === currentImage
                                                        ? "border-[#2c1b13] dark:border-[#fcf2e9]"
                                                        : "border-transparent opacity-60 hover:opacity-100"
                                                }`}
                                            >
                                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {hostelPhone && room.isAvailable && (
                                <a
                                    href={`tel:${hostelPhone}`}
                                    className="block w-full py-4 rounded-2xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold text-center text-lg hover:scale-[1.02] active:scale-95 transition-transform"
                                >
                                    📞 Contact to Book Now
                                </a>
                            )}

                            {!room.isAvailable && (
                                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-center">
                                    <p className="text-red-600 dark:text-red-400 font-medium">
                                        This room is currently booked. Please check back later or contact the hostel for availability.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RoomDetailModal;
