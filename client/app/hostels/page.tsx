"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useGetAllHostelsQuery } from "@/redux/features/hostel/hostelApi";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { 
    HiOutlineSearch, 
    HiOutlineLocationMarker, 
    HiOutlineStar,
    HiOutlineUsers,
    HiOutlineOfficeBuilding,
    HiOutlineArrowRight,
    HiOutlineFilter,
    HiOutlineX,
    HiOutlineAdjustments
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

import dynamic from "next/dynamic";
import { HiOutlineMap, HiOutlineViewGrid } from "react-icons/hi";

const HostelSearchMap = dynamic(() => import("../components/HostelSearchMap"), {
    ssr: false,
    loading: () => <div className="w-full h-[600px] bg-gray-100 rounded-3xl animate-pulse" />
});

const HOSTEL_TYPES = ["All", "Boys", "Girls", "Family"];
const CITIES = ["All Cities", "Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar", "Multan", "Faisalabad"];
const PRICE_RANGES = [
    { label: "All Prices", min: 0, max: Infinity },
    { label: "Under PKR 10,000", min: 0, max: 10000 },
    { label: "PKR 10,000 - 15,000", min: 10000, max: 15000 },
    { label: "PKR 15,000 - 20,000", min: 15000, max: 20000 },
    { label: "PKR 20,000+", min: 20000, max: Infinity },
];
const FACILITIES = ["WiFi", "AC", "Mess", "Laundry", "Parking", "Gym", "Security", "Generator"];

const HostelsPage = () => {
    const { data, isLoading } = useGetAllHostelsQuery({});
    const hostels = data?.hostels || [];

    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [selectedType, setSelectedType] = useState("All");
    const [selectedCity, setSelectedCity] = useState("All Cities");
    const [selectedPriceRange, setSelectedPriceRange] = useState(0);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const toggleFacility = (facility: string) => {
        setSelectedFacilities(prev => 
            prev.includes(facility) 
                ? prev.filter(f => f !== facility)
                : [...prev, facility]
        );
    };

    const filteredHostels = useMemo(() => {
        return hostels.filter((hostel: any) => {
            if (searchQuery && !hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                !hostel.address?.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !hostel.city?.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            if (selectedType !== "All" && hostel.type !== selectedType) {
                return false;
            }

            if (selectedCity !== "All Cities" && hostel.city !== selectedCity) {
                return false;
            }

            if (selectedFacilities.length > 0) {
                const hostelFacilities = hostel.facilities || [];
                const hasAllFacilities = selectedFacilities.every(f => hostelFacilities.includes(f));
                if (!hasAllFacilities) return false;
            }

            return true;
        });
    }, [hostels, searchQuery, selectedType, selectedCity, selectedPriceRange, selectedFacilities]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedType("All");
        setSelectedCity("All Cities");
        setSelectedPriceRange(0);
        setSelectedFacilities([]);
    };

    const hasActiveFilters = searchQuery || selectedType !== "All" || selectedCity !== "All Cities" || selectedPriceRange !== 0 || selectedFacilities.length > 0;

    return (
        <div className="min-h-screen bg-[#2c1b13] dark:bg-[#fcf2e9]">
            <Header />
            
            <section className="pt-28 pb-12 px-6 md:px-12 bg-gradient-to-b from-[#fcf2e9] to-[#f5e6d8] dark:from-[#2c1b13] dark:to-[#1a0f0a]">
                <div className="max-w-[1440px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">
                            Find Your <span className="italic font-light">Perfect Hostel</span>
                        </h1>
                        <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 max-w-xl mx-auto">
                            Browse through {hostels.length} verified hostels across Pakistan
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#fcf2e9]/40 dark:text-[#2c1b13]/40" size={24} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by hostel name, city, or area..."
                                    className="w-full pl-14 pr-5 py-5 rounded-2xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] placeholder:text-[#fcf2e9]/40 dark:placeholder:text-[#2c1b13]/40 shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#2c1b13]/50 dark:focus:ring-[#fcf2e9]/50 transition-all text-lg"
                                />
                            </div>

                            {/* View Mode Toggle - Desktop */}
                            <div className="hidden md:flex bg-[#2c1b13] dark:bg-[#fcf2e9] p-2 rounded-2xl shadow-2xl">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all font-bold ${
                                        viewMode === 'grid'
                                            ? "bg-[#fcf2e9] dark:bg-[#2c1b13] text-[#2c1b13] dark:text-[#fcf2e9] shadow-md"
                                            : "text-[#fcf2e9]/60 dark:text-[#2c1b13]/60 hover:bg-[#fcf2e9]/10 dark:hover:bg-[#2c1b13]/10"
                                    }`}
                                >
                                    <HiOutlineViewGrid size={20} />
                                    Hostel Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all font-bold ${
                                        viewMode === 'map'
                                            ? "bg-[#fcf2e9] dark:bg-[#2c1b13] text-[#2c1b13] dark:text-[#fcf2e9] shadow-md"
                                            : "text-[#fcf2e9]/60 dark:text-[#2c1b13]/60 hover:bg-[#fcf2e9]/10 dark:hover:bg-[#2c1b13]/10"
                                    }`}
                                >
                                    <HiOutlineMap size={20} />
                                    Hostels on Map
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-12 px-6 md:px-12 bg-[#fcf2e9] dark:bg-[#1a0f0a]">
                <div className="max-w-[1440px] mx-auto">
                    <div className="lg:hidden mb-6">
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="w-full py-4 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold flex items-center justify-center gap-2"
                        >
                            <HiOutlineAdjustments size={20} />
                            Filters {hasActiveFilters && `(${selectedFacilities.length + (selectedType !== "All" ? 1 : 0) + (selectedCity !== "All Cities" ? 1 : 0)})`}
                        </button>
                    </div>

                    <div className="flex gap-8">
                        <aside className="hidden lg:block w-72 shrink-0">
                            <div className="sticky top-28 bg-white dark:bg-[#2c1b13] rounded-3xl p-6 shadow-lg border border-[#2c1b13]/5 dark:border-white/5">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] flex items-center gap-2">
                                        <HiOutlineFilter size={18} />
                                        Filters
                                    </h3>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-red-500 hover:underline"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">
                                            Hostel Type
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {HOSTEL_TYPES.map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setSelectedType(type)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                        selectedType === type
                                                            ? "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]"
                                                            : "bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10"
                                                    }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">
                                            City
                                        </h4>
                                        <select
                                            value={selectedCity}
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] focus:outline-none"
                                        >
                                            {CITIES.map((city) => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">
                                            Price Range
                                        </h4>
                                        <div className="space-y-2">
                                            {PRICE_RANGES.map((range, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedPriceRange(i)}
                                                    className={`w-full px-4 py-2 rounded-xl text-sm text-left transition-all ${
                                                        selectedPriceRange === i
                                                            ? "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]"
                                                            : "bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10"
                                                    }`}
                                                >
                                                    {range.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">
                                            Facilities
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {FACILITIES.map((facility) => (
                                                <button
                                                    key={facility}
                                                    onClick={() => toggleFacility(facility)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                                        selectedFacilities.includes(facility)
                                                            ? "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]"
                                                            : "bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10"
                                                    }`}
                                                >
                                                    {facility}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <main className="flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                                    Showing <span className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">{filteredHostels.length}</span> hostels
                                </p>
                            </div>

                            {viewMode === 'map' ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-[800px] w-full"
                                >
                                    <HostelSearchMap hostels={filteredHostels} />
                                </motion.div>
                            ) : (
                                <>
                                    {isLoading ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                                <div key={i} className="bg-white/50 dark:bg-black/20 rounded-3xl h-[380px] animate-pulse" />
                                            ))}
                                        </div>
                                    ) : filteredHostels.length === 0 ? (
                                        <div className="text-center py-20 bg-white dark:bg-[#2c1b13] rounded-3xl">
                                            <HiOutlineOfficeBuilding size={64} className="mx-auto text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-4" />
                                            <h3 className="text-2xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">
                                                No Hostels Found
                                            </h3>
                                            <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-6">
                                                Try adjusting your filters or search query
                                            </p>
                                            <button
                                                onClick={clearFilters}
                                                className="px-6 py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-105 transition-transform"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {filteredHostels.map((hostel: any, index: number) => (
                                                <motion.div
                                                    key={hostel._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <Link href={`/hostels/${hostel._id}`}>
                                                        <div className="group bg-white dark:bg-[#2c1b13] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#2c1b13]/5 dark:border-white/5">
                                                            <div className="relative h-52 overflow-hidden">
                                                                {hostel.images?.[0] ? (
                                                                    <img 
                                                                        src={hostel.images[0].url} 
                                                                        alt={hostel.name}
                                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full bg-gradient-to-br from-[#2c1b13]/20 to-[#2c1b13]/10 flex items-center justify-center">
                                                                        <HiOutlineOfficeBuilding size={48} className="text-[#2c1b13]/30 dark:text-[#fcf2e9]/30" />
                                                                    </div>
                                                                )}
                                                                
                                                                <div className="absolute top-4 left-4">
                                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
                                                                        hostel.type === 'Boys' 
                                                                            ? 'bg-blue-500/80 text-white' 
                                                                            : hostel.type === 'Girls' 
                                                                            ? 'bg-pink-500/80 text-white'
                                                                            : 'bg-purple-500/80 text-white'
                                                                    }`}>
                                                                        <HiOutlineUsers className="inline mr-1" size={12} />
                                                                        {hostel.type}
                                                                    </span>
                                                                </div>

                                                                {hostel.rating > 0 && (
                                                                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white">
                                                                        <HiOutlineStar className="fill-yellow-400 text-yellow-400" size={14} />
                                                                        <span className="text-sm font-bold">{hostel.rating.toFixed(1)}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="p-5">
                                                                <h3 className="text-lg font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] line-clamp-1">
                                                                    {hostel.name}
                                                                </h3>

                                                                <div className="flex items-center gap-2 mt-2 text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
                                                                    <HiOutlineLocationMarker size={16} className="shrink-0" />
                                                                    <span className="text-sm line-clamp-1">{hostel.address}, {hostel.city}</span>
                                                                </div>

                                                                {hostel.facilities && hostel.facilities.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                                        {hostel.facilities.slice(0, 3).map((facility: string, i: number) => (
                                                                            <span 
                                                                                key={i}
                                                                                className="px-2 py-0.5 rounded bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-xs text-[#2c1b13]/70 dark:text-[#fcf2e9]/70"
                                                                            >
                                                                                {facility}
                                                                            </span>
                                                                        ))}
                                                                        {hostel.facilities.length > 3 && (
                                                                            <span className="text-xs text-[#2c1b13]/40 dark:text-[#fcf2e9]/40">
                                                                                +{hostel.facilities.length - 3}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#2c1b13]/10 dark:border-white/10">
                                                                    <div>
                                                                        <span className="text-xs text-[#2c1b13]/40 dark:text-[#fcf2e9]/40">From</span>
                                                                        <p className="text-lg font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                                                            {hostel.minPrice ? `PKR ${hostel.minPrice.toLocaleString()}` : 'Contact for Price'}
                                                                            {hostel.minPrice && <span className="text-xs font-normal opacity-60">/mo</span>}
                                                                        </p>
                                                                    </div>
                                                                    <div className="p-2.5 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] group-hover:scale-110 transition-transform">
                                                                        <HiOutlineArrowRight size={16} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </main>
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {showMobileFilters && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 lg:hidden"
                    >
                        <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)} />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="absolute right-0 top-0 bottom-0 w-80 bg-[#fcf2e9] dark:bg-[#2c1b13] p-6 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">Filters</h3>
                                <button onClick={() => setShowMobileFilters(false)}>
                                    <HiOutlineX size={24} className="text-[#2c1b13] dark:text-[#fcf2e9]" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">Type</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {HOSTEL_TYPES.map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium ${
                                                    selectedType === type
                                                        ? "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]"
                                                        : "bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-[#2c1b13] dark:text-[#fcf2e9]"
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">City</h4>
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a0f0a] border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9]"
                                    >
                                        {CITIES.map((city) => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-3">Facilities</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {FACILITIES.map((facility) => (
                                            <button
                                                key={facility}
                                                onClick={() => toggleFacility(facility)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                                                    selectedFacilities.includes(facility)
                                                        ? "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]"
                                                        : "bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-[#2c1b13] dark:text-[#fcf2e9]"
                                                }`}
                                            >
                                                {facility}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="w-full py-4 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold"
                                >
                                    Apply Filters
                                </button>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="w-full py-4 rounded-xl border border-[#2c1b13]/20 dark:border-[#fcf2e9]/20 text-[#2c1b13] dark:text-[#fcf2e9] font-bold"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default HostelsPage;
