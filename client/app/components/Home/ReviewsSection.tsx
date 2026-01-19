"use client";

import React, { useState } from "react";
import { HiOutlineStar, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const REVIEWS = [
    {
        id: 1,
        name: "Ahmed Hassan",
        role: "COMSATS Student",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        review: "Found my perfect hostel within minutes! The platform is incredibly easy to use and the hostel I moved into exceeded all my expectations. Clean rooms, friendly staff, and great location near university.",
        hostel: "Elite Boys Hostel",
        location: "Islamabad"
    },
    {
        id: 2,
        name: "Fatima Khan",
        role: "NUST Graduate",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        review: "As a female student, safety was my priority. This platform helped me find a secure girls hostel with all the amenities I needed. The verification process gave me peace of mind.",
        hostel: "Grace Girls Residence",
        location: "Rawalpindi"
    },
    {
        id: 3,
        name: "Muhammad Ali",
        role: "Working Professional",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        rating: 4,
        review: "Relocated to Lahore for work and needed temporary accommodation. Found a family hostel with AC rooms, WiFi, and mess facility. Saved me weeks of searching!",
        hostel: "Metro Living Spaces",
        location: "Lahore"
    },
    {
        id: 4,
        name: "Sara Ahmed",
        role: "Medical Student",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
        review: "The detailed room photos and amenity lists helped me choose the right hostel. Currently in my 2nd year and couldn't be happier with my choice!",
        hostel: "Scholars Haven",
        location: "Karachi"
    },
    {
        id: 5,
        name: "Usman Malik",
        role: "FAST Student",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        rating: 5,
        review: "Best hostel finder in Pakistan! Compared 10+ hostels in my budget range and found one with a gym and study room. Highly recommend!",
        hostel: "The Grand Residency",
        location: "Islamabad"
    }
];

const ReviewsSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextReview = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
    };

    const prevReview = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
    };

    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 })
    };

    return (
        <section className="py-24 px-6 md:px-12 bg-[#2c1b13] dark:bg-[#fcf2e9] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
                <div className="absolute top-10 left-10 text-[400px] font-heading font-bold text-[#fcf2e9] dark:text-[#2c1b13] select-none">"</div>
                <div className="absolute bottom-10 right-10 text-[400px] font-heading font-bold text-[#fcf2e9] dark:text-[#2c1b13] select-none rotate-180">"</div>
            </div>

            <div className="max-w-[1440px] mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#fcf2e9]/10 dark:bg-[#2c1b13]/10 text-sm font-bold text-[#fcf2e9] dark:text-[#2c1b13] mb-4">
                        <HiOutlineStar size={16} />
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#fcf2e9] dark:text-[#2c1b13]">
                        What Our <span className="italic font-light">Residents Say</span>
                    </h2>
                    <p className="mt-4 text-lg text-[#fcf2e9]/60 dark:text-[#2c1b13]/60 max-w-2xl mx-auto">
                        Trusted by thousands of students and professionals across Pakistan
                    </p>
                </motion.div>

                <div className="relative max-w-4xl mx-auto">
                    <div className="relative min-h-[400px] flex items-center justify-center">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={activeIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="absolute w-full"
                            >
                                <div className="bg-[#fcf2e9]/5 dark:bg-[#2c1b13]/5 backdrop-blur-sm rounded-4xl p-8 md:p-12 border border-[#fcf2e9]/10 dark:border-[#2c1b13]/10">
                                    <div className="flex flex-col md:flex-row gap-8 items-center">
                                        <div className="flex-shrink-0">
                                            <div className="relative">
                                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#fcf2e9]/20 dark:border-[#2c1b13]/20">
                                                    <img 
                                                        src={REVIEWS[activeIndex].avatar} 
                                                        alt={REVIEWS[activeIndex].name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                                    <HiOutlineStar className="fill-current" size={14} />
                                                    {REVIEWS[activeIndex].rating}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 text-center md:text-left">
                                            <div className="flex justify-center md:justify-start gap-1 mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <HiOutlineStar 
                                                        key={i} 
                                                        size={20} 
                                                        className={i < REVIEWS[activeIndex].rating ? "text-yellow-400 fill-yellow-400" : "text-[#fcf2e9]/20 dark:text-[#2c1b13]/20"}
                                                    />
                                                ))}
                                            </div>

                                            <p className="text-lg md:text-xl text-[#fcf2e9] dark:text-[#2c1b13] font-body leading-relaxed mb-6 italic">
                                                "{REVIEWS[activeIndex].review}"
                                            </p>

                                            <div>
                                                <h4 className="text-xl font-heading font-bold text-[#fcf2e9] dark:text-[#2c1b13]">
                                                    {REVIEWS[activeIndex].name}
                                                </h4>
                                                <p className="text-sm text-[#fcf2e9]/60 dark:text-[#2c1b13]/60">
                                                    {REVIEWS[activeIndex].role}
                                                </p>
                                                <p className="text-sm text-[#fcf2e9]/40 dark:text-[#2c1b13]/40 mt-1">
                                                    Stayed at <span className="font-bold text-[#fcf2e9]/70 dark:text-[#2c1b13]/70">{REVIEWS[activeIndex].hostel}</span>, {REVIEWS[activeIndex].location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button 
                            onClick={prevReview}
                            className="p-3 rounded-full bg-[#fcf2e9]/10 dark:bg-[#2c1b13]/10 text-[#fcf2e9] dark:text-[#2c1b13] hover:bg-[#fcf2e9]/20 dark:hover:bg-[#2c1b13]/20 transition-colors"
                        >
                            <HiChevronLeft size={24} />
                        </button>

                        <div className="flex gap-2">
                            {REVIEWS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setDirection(i > activeIndex ? 1 : -1);
                                        setActiveIndex(i);
                                    }}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                        i === activeIndex 
                                            ? "w-8 bg-[#fcf2e9] dark:bg-[#2c1b13]" 
                                            : "bg-[#fcf2e9]/30 dark:bg-[#2c1b13]/30 hover:bg-[#fcf2e9]/50 dark:hover:bg-[#2c1b13]/50"
                                    }`}
                                />
                            ))}
                        </div>

                        <button 
                            onClick={nextReview}
                            className="p-3 rounded-full bg-[#fcf2e9]/10 dark:bg-[#2c1b13]/10 text-[#fcf2e9] dark:text-[#2c1b13] hover:bg-[#fcf2e9]/20 dark:hover:bg-[#2c1b13]/20 transition-colors"
                        >
                            <HiChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 text-center"
                >
                    {[
                        { value: "10K+", label: "Happy Residents" },
                        { value: "500+", label: "Verified Hostels" },
                        { value: "50+", label: "Cities Covered" },
                        { value: "4.8", label: "Average Rating" }
                    ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-[#fcf2e9]/5 dark:bg-[#2c1b13]/5 border border-[#fcf2e9]/10 dark:border-[#2c1b13]/10">
                            <h3 className="text-3xl md:text-4xl font-heading font-bold text-[#fcf2e9] dark:text-[#2c1b13]">
                                {stat.value}
                            </h3>
                            <p className="text-sm text-[#fcf2e9]/60 dark:text-[#2c1b13]/60 mt-1 font-medium">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ReviewsSection;
