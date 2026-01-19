"use client";

import React, { useState, useEffect } from "react";
import { 
    HiOutlineKey, 
    HiOutlinePlus, 
    HiOutlinePencil, 
    HiOutlineTrash,
    HiOutlinePhotograph,
    HiOutlineX,
    HiOutlineCheck,
    HiOutlineRefresh
} from "react-icons/hi";
import { useGetMyHostelQuery } from "@/redux/features/hostel/hostelApi";
import { 
    useGetHostelRoomsQuery, 
    useCreateRoomMutation, 
    useDeleteRoomMutation,
    useToggleRoomAvailabilityMutation 
} from "@/redux/features/room/roomApi";
import { toast } from "react-hot-toast";
import Link from "next/link";

const ROOM_TYPES = ["Single", "Double", "Three Seater", "Four Seater"];

const AMENITIES_OPTIONS = [
    "Attached Bathroom", "AC", "Fan", "Wardrobe", "Study Table",
    "Chair", "Bed", "Mattress", "WiFi", "Balcony", "Window"
];

const RoomsPage = () => {
    const { data: hostelData, isLoading: hostelLoading } = useGetMyHostelQuery({});
    const hostelId = hostelData?.hostel?._id;

    const { data: roomsData, isLoading: roomsLoading, refetch } = useGetHostelRoomsQuery(hostelId, {
        skip: !hostelId
    });

    const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
    const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();
    const [toggleAvailability] = useToggleRoomAvailabilityMutation();

    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        type: "Single",
        price: "",
        description: "",
        amenities: [] as string[],
        images: [] as string[],
    });
    const [imagePreview, setImagePreview] = useState<string[]>([]);

    const rooms = roomsData?.rooms || [];

    const resetForm = () => {
        setFormData({
            type: "Single",
            price: "",
            description: "",
            amenities: [],
            images: [],
        });
        setImagePreview([]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, reader.result as string]
                    }));
                    setImagePreview(prev => [...prev, reader.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setImagePreview(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.price || !formData.description) {
            toast.error("Please fill all required fields");
            return;
        }

        if (formData.images.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }

        try {
            await createRoom({
                hostelId,
                ...formData,
                price: Number(formData.price)
            }).unwrap();
            
            toast.success("Room added successfully!");
            setShowAddModal(false);
            resetForm();
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add room");
        }
    };

    const handleDelete = async (roomId: string) => {
        try {
            await deleteRoom(roomId).unwrap();
            toast.success("Room deleted successfully!");
            setDeleteConfirm(null);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete room");
        }
    };

    const handleToggleAvailability = async (roomId: string) => {
        try {
            await toggleAvailability(roomId).unwrap();
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update availability");
        }
    };

    if (hostelLoading || roomsLoading) {
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
                    <HiOutlineKey size={48} className="text-[#2c1b13] dark:text-[#fcf2e9]" />
                </div>
                <div className="max-w-md">
                    <h2 className="text-3xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                        Create Your Hostel First
                    </h2>
                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-8">
                        You need to set up your hostel before adding rooms.
                    </p>
                    <Link 
                        href="/hostel-dashboard/my-hostel"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] rounded-xl font-bold hover:scale-105 transition-transform"
                    >
                        <HiOutlinePlus size={20} />
                        Setup Hostel
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                        Rooms Management
                    </h1>
                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mt-1">
                        Manage your hostel rooms and availability
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <HiOutlinePlus size={20} />
                    Add Room
                </button>
            </div>

            {rooms.length === 0 ? (
                <div className="bg-[#fcf2e9] dark:bg-[#2c1b13] p-12 rounded-[2rem] border border-[#2c1b13]/10 dark:border-white/10 text-center">
                    <HiOutlineKey size={64} className="mx-auto text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                    <h3 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                        No Rooms Yet
                    </h3>
                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-6">
                        Start by adding your first room to the hostel
                    </p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-105 transition-transform inline-flex items-center gap-2"
                    >
                        <HiOutlinePlus size={20} />
                        Add Your First Room
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room: any) => (
                        <div 
                            key={room._id} 
                            className="bg-[#fcf2e9] dark:bg-[#2c1b13] rounded-[2rem] border border-[#2c1b13]/10 dark:border-white/10 overflow-hidden group"
                        >
                            <div className="relative h-48 bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10">
                                {room.images?.[0] ? (
                                    <img src={room.images[0].url} alt={room.type} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <HiOutlinePhotograph size={48} className="text-[#2c1b13]/20 dark:text-[#fcf2e9]/20" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={() => handleToggleAvailability(room._id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                                            room.isAvailable 
                                                ? "bg-green-500 text-white" 
                                                : "bg-red-500 text-white"
                                        }`}
                                    >
                                        {room.isAvailable ? "Available" : "Booked"}
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                        {room.type}
                                    </h3>
                                    <span className="text-lg font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                        {room.price?.toLocaleString()} <span className="text-xs opacity-60">PKR/mo</span>
                                    </span>
                                </div>

                                <p className="text-sm text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 line-clamp-2 mb-4">
                                    {room.description}
                                </p>

                                {room.amenities?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {room.amenities.slice(0, 3).map((amenity: string, i: number) => (
                                            <span 
                                                key={i}
                                                className="px-2 py-1 rounded-lg bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-xs font-medium text-[#2c1b13] dark:text-[#fcf2e9]"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                        {room.amenities.length > 3 && (
                                            <span className="px-2 py-1 text-xs font-medium text-[#2c1b13]/50 dark:text-[#fcf2e9]/50">
                                                +{room.amenities.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2 pt-4 border-t border-[#2c1b13]/10 dark:border-white/10">
                                    <button
                                        onClick={() => handleToggleAvailability(room._id)}
                                        className="flex-1 py-2.5 rounded-xl border border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 text-sm font-bold text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-[#2c1b13]/5 dark:hover:bg-[#fcf2e9]/5 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <HiOutlineRefresh size={16} />
                                        Toggle
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(room._id)}
                                        className="py-2.5 px-4 rounded-xl bg-red-500/10 text-red-600 text-sm font-bold hover:bg-red-500/20 transition-colors"
                                    >
                                        <HiOutlineTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#fcf2e9] dark:bg-[#2c1b13] rounded-[2rem] p-8 shadow-2xl border border-[#2c1b13]/10 dark:border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                Add New Room
                            </h2>
                            <button
                                onClick={() => { setShowAddModal(false); resetForm(); }}
                                className="p-2 rounded-full hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10 transition-colors"
                            >
                                <HiOutlineX size={24} className="text-[#2c1b13] dark:text-[#fcf2e9]" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-2">
                                        Room Type *
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[#2c1b13]/10 dark:border-white/10 focus:border-[#2c1b13] dark:focus:border-[#fcf2e9] focus:outline-none transition-colors text-[#2c1b13] dark:text-[#fcf2e9]"
                                    >
                                        {ROOM_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-2">
                                        Price (PKR/month) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="e.g., 15000"
                                        className="w-full px-5 py-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[#2c1b13]/10 dark:border-white/10 focus:border-[#2c1b13] dark:focus:border-[#fcf2e9] focus:outline-none transition-colors text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/40 dark:placeholder:text-[#fcf2e9]/40"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the room..."
                                    rows={3}
                                    className="w-full px-5 py-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[#2c1b13]/10 dark:border-white/10 focus:border-[#2c1b13] dark:focus:border-[#fcf2e9] focus:outline-none transition-colors text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/40 dark:placeholder:text-[#fcf2e9]/40 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">
                                    Amenities
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {AMENITIES_OPTIONS.map((amenity) => (
                                        <button
                                            key={amenity}
                                            type="button"
                                            onClick={() => toggleAmenity(amenity)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                                formData.amenities.includes(amenity)
                                                    ? "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]"
                                                    : "bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10"
                                            }`}
                                        >
                                            {formData.amenities.includes(amenity) && <HiOutlineCheck className="inline mr-1" size={14} />}
                                            {amenity}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">
                                    Images *
                                </label>
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                    {imagePreview.map((img, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <HiOutlineX size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    <label className="aspect-square rounded-xl border-2 border-dashed border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#2c1b13] dark:hover:border-[#fcf2e9] transition-colors">
                                        <HiOutlinePlus size={24} className="text-[#2c1b13]/40 dark:text-[#fcf2e9]/40" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddModal(false); resetForm(); }}
                                    className="flex-1 py-4 rounded-xl border-2 border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 font-bold text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-[#2c1b13]/5 dark:hover:bg-[#fcf2e9]/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 py-4 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isCreating ? (
                                        <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <HiOutlineCheck size={20} />
                                            Add Room
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#fcf2e9] dark:bg-[#2c1b13] rounded-[2rem] p-8 shadow-2xl border border-[#2c1b13]/10 dark:border-white/10 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                            <HiOutlineTrash size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                            Delete Room?
                        </h3>
                        <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-6">
                            This action cannot be undone. The room will be permanently removed.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 rounded-xl border-2 border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 font-bold text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-[#2c1b13]/5 dark:hover:bg-[#fcf2e9]/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                disabled={isDeleting}
                                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomsPage;
