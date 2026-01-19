"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    HiOutlineOfficeBuilding, 
    HiOutlineLocationMarker,
    HiOutlineTag,
    HiOutlinePhotograph,
    HiOutlinePhone,
    HiOutlineX,
    HiOutlinePlus,
    HiOutlineCheck,
    HiOutlineArrowLeft
} from "react-icons/hi";
import { useGetMyHostelQuery, useCreateHostelMutation, useUpdateHostelMutation } from "@/redux/features/hostel/hostelApi";
import { toast } from "react-hot-toast";
import Link from "next/link";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("../../components/Dashboard/LocationPicker"), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] rounded-2xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 border-t-[#2c1b13] dark:border-t-[#fcf2e9] rounded-full animate-spin" />
        </div>
    )
});

const HOSTEL_TYPES = ["Boys", "Girls", "Family"];

const FACILITIES_OPTIONS = [
    "WiFi", "AC", "Parking", "Laundry", "Kitchen", "CCTV", 
    "Generator Backup", "Hot Water", "Study Room", "Common Room",
    "Mess/Canteen", "Gym", "Security Guard", "Attached Bathroom"
];

const MyHostelPage = () => {
    const router = useRouter();
    const { data: hostelData, isLoading: hostelLoading, refetch } = useGetMyHostelQuery({});
    const [createHostel, { isLoading: isCreating }] = useCreateHostelMutation();
    const [updateHostel, { isLoading: isUpdating }] = useUpdateHostelMutation();

    const isEditMode = !!hostelData?.hostel;
    const isSubmitting = isCreating || isUpdating;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        city: "",
        type: "Boys",
        contactPhone: "",
        facilities: [] as string[],
        tags: [] as string[],
        coordinates: { lat: 0, lng: 0 },
        images: [] as string[],
    });

    const [tagInput, setTagInput] = useState("");
    const [imagePreview, setImagePreview] = useState<string[]>([]);

    useEffect(() => {
        if (hostelData?.hostel) {
            const h = hostelData.hostel;
            setFormData({
                name: h.name || "",
                description: h.description || "",
                address: h.address || "",
                city: h.city || "",
                type: h.type || "Boys",
                contactPhone: h.contactPhone || "",
                facilities: h.facilities || [],
                tags: h.tags || [],
                coordinates: h.coordinates || { lat: 0, lng: 0 },
                images: [],
            });
            if (h.images && h.images.length > 0) {
                setImagePreview(h.images.map((img: any) => img.url));
            }
        }
    }, [hostelData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleFacility = (facility: string) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }));
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
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

        if (!formData.name || !formData.address || !formData.city || !formData.description || !formData.contactPhone) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!isEditMode && formData.images.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }

        try {
            if (isEditMode) {
                await updateHostel({
                    id: hostelData.hostel._id,
                    data: formData
                }).unwrap();
                toast.success("Hostel updated successfully!");
            } else {
                await createHostel(formData).unwrap();
                toast.success("Hostel created successfully!");
            }
            refetch();
            router.push("/hostel-dashboard");
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong");
        }
    };

    if (hostelLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-[#2c1b13] dark:text-[#fcf2e9]">
                <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <Link 
                    href="/hostel-dashboard" 
                    className="p-2 rounded-xl hover:bg-[#2c1b13]/5 dark:hover:bg-[#fcf2e9]/5 transition-colors"
                >
                    <HiOutlineArrowLeft size={24} className="text-[#2c1b13] dark:text-[#fcf2e9]" />
                </Link>
                <div>
                    <h1 className="text-3xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                        {isEditMode ? "Edit Hostel" : "Create Your Hostel"}
                    </h1>
                    <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mt-1">
                        {isEditMode ? "Update your hostel information" : "Fill in the details to list your hostel"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-[#fcf2e9] dark:bg-[#2c1b13] p-8 rounded-[2rem] border border-[#2c1b13]/10 dark:border-white/10">
                    <h2 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-6 flex items-center gap-3">
                        <HiOutlineOfficeBuilding size={24} />
                        Basic Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-2">
                                Hostel Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., The Grand Residency"
                                className="w-full px-5 py-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[#2c1b13]/10 dark:border-white/10 focus:border-[#2c1b13] dark:focus:border-[#fcf2e9] focus:outline-none transition-colors text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/40 dark:placeholder:text-[#fcf2e9]/40"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your hostel, amenities, nearby locations..."
                                rows={4}
                                className="w-full px-5 py-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[#2c1b13]/10 dark:border-white/10 focus:border-[#2c1b13] dark:focus:border-[#fcf2e9] focus:outline-none transition-colors text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/40 dark:placeholder:text-[#fcf2e9]/40 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-2">
                                Hostel Type *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[#2c1b13]/10 dark:border-white/10 focus:border-[#2c1b13] dark:focus:border-[#fcf2e9] focus:outline-none transition-colors text-[#2c1b13] dark:text-[#fcf2e9]"
                            >
                                {HOSTEL_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-2">
                                <HiOutlinePhone className="inline mr-1" /> Contact Phone *
                            </label>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="+92 300 1234567"
                                className="w-full px-5 py-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[#2c1b13]/10 dark:border-white/10 focus:border-[#2c1b13] dark:focus:border-[#fcf2e9] focus:outline-none transition-colors text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/40 dark:placeholder:text-[#fcf2e9]/40"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-[#fcf2e9] dark:bg-[#2c1b13] p-8 rounded-[2rem] border border-[#2c1b13]/10 dark:border-white/10">
                    <h2 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-6 flex items-center gap-3">
                        <HiOutlineLocationMarker size={24} />
                        Location
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-2">
                                Full Address *
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Street address, area, landmark..."
                                className="w-full px-5 py-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[#2c1b13]/10 dark:border-white/10 focus:border-[#2c1b13] dark:focus:border-[#fcf2e9] focus:outline-none transition-colors text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/40 dark:placeholder:text-[#fcf2e9]/40"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-2">
                                City *
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="e.g., Islamabad"
                                className="w-full px-5 py-4 rounded-xl bg-white/50 dark:bg-black/20 border border-[#2c1b13]/10 dark:border-white/10 focus:border-[#2c1b13] dark:focus:border-[#fcf2e9] focus:outline-none transition-colors text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/40 dark:placeholder:text-[#fcf2e9]/40"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">
                                Pin Your Exact Location
                            </label>
                            <LocationPicker
                                coordinates={formData.coordinates}
                                onLocationChange={(coords, address) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        coordinates: coords,
                                        ...(address && { address })
                                    }));
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-[#fcf2e9] dark:bg-[#2c1b13] p-8 rounded-[2rem] border border-[#2c1b13]/10 dark:border-white/10">
                    <h2 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-6 flex items-center gap-3">
                        <HiOutlineTag size={24} />
                        Tags & Nearby Landmarks
                    </h2>
                    
                    <div className="flex gap-3 mb-4">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                            placeholder="e.g., Near COMSATS, 5 min from Metro..."
                            className="flex-1 px-5 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-[#2c1b13]/10 dark:border-white/10 focus:border-[#2c1b13] dark:focus:border-[#fcf2e9] focus:outline-none transition-colors text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/40 dark:placeholder:text-[#fcf2e9]/40"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="px-6 py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-105 transition-transform"
                        >
                            <HiOutlinePlus size={20} />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                            <span 
                                key={index} 
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] text-sm font-medium"
                            >
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                                    <HiOutlineX size={16} />
                                </button>
                            </span>
                        ))}
                        {formData.tags.length === 0 && (
                            <span className="text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 text-sm italic">
                                No tags added yet
                            </span>
                        )}
                    </div>
                </div>

                <div className="bg-[#fcf2e9] dark:bg-[#2c1b13] p-8 rounded-[2rem] border border-[#2c1b13]/10 dark:border-white/10">
                    <h2 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-6">
                        Facilities & Amenities
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {FACILITIES_OPTIONS.map((facility) => (
                            <button
                                key={facility}
                                type="button"
                                onClick={() => toggleFacility(facility)}
                                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                                    formData.facilities.includes(facility)
                                        ? "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] border-transparent"
                                        : "bg-transparent border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 text-[#2c1b13] dark:text-[#fcf2e9] hover:border-[#2c1b13] dark:hover:border-[#fcf2e9]"
                                }`}
                            >
                                {formData.facilities.includes(facility) && <HiOutlineCheck className="inline mr-1" size={16} />}
                                {facility}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-[#fcf2e9] dark:bg-[#2c1b13] p-8 rounded-[2rem] border border-[#2c1b13]/10 dark:border-white/10">
                    <h2 className="text-xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-6 flex items-center gap-3">
                        <HiOutlinePhotograph size={24} />
                        Hostel Images {!isEditMode && "*"}
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreview.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <HiOutlineX size={16} />
                                </button>
                            </div>
                        ))}
                        
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#2c1b13] dark:hover:border-[#fcf2e9] transition-colors">
                            <HiOutlinePlus size={32} className="text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 mb-2" />
                            <span className="text-xs text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 font-medium">Add Photo</span>
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

                <div className="flex gap-4">
                    <Link
                        href="/hostel-dashboard"
                        className="flex-1 py-4 rounded-xl border-2 border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 text-center font-bold text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-[#2c1b13]/5 dark:hover:bg-[#fcf2e9]/5 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-4 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        ) : (
                            <>
                                <HiOutlineCheck size={20} />
                                {isEditMode ? "Update Hostel" : "Create Hostel"}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MyHostelPage;
