"use client";

import React from "react";
import Image from "next/image";
import Founder from "../assets/my-1.jpeg"
import { motion } from "framer-motion";
import { 
    HiOutlineLightBulb, 
    HiOutlineShieldCheck, 
    HiOutlineUsers, 
    HiOutlineGlobe 
} from "react-icons/hi";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";

const AboutPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true }
    };

    return (
        <div className="bg-brand-bg dark:bg-dark-bg min-h-screen transition-colors">
            <Header />
            
            <main className="pt-24 pb-20">
                {/* Hero Introduction */}
                <section className="container mx-auto px-4 mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-6xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-6">
                                    Simplify Your <span className="italic font-light">Hostel Hunt</span>
                                </h1>
                        <p className="text-lg md:text-xl text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 leading-relaxed">
                         HOSTELITE is a smart, modern platform designed to connect students with the best hostels in their city. We bridge the gap between comfort, affordability, and trust.
                        </p>
                    </motion.div>
                </section>

                {/* Problem & Mission Grid */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Problem */}
                        <motion.div 
                            {...fadeIn}
                            className="bg-[#2c1b13]/5 border border-[#2c1b13]/10 dark:bg-[#2c1b13] dark:border-[#fcf2e9]/10 p-8 rounded-3xl"
                        >
                            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                                <HiOutlineLightBulb className="text-red-400 text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">The Problem</h2>
                            <p className="text-[#2c1b13]/70 dark:text-[#fcf2e9]/60 leading-relaxed">
                                Finding a hostel is exhausted. Students often face fake listings, hidden charges, unhygienic conditions, and insecure environments. The process is manual, tiring, and lacks transparency.
                            </p>
                        </motion.div>

                        {/* Mission */}
                        <motion.div 
                            {...fadeIn}
                            transition={{ delay: 0.1 }}
                            className="bg-[#2c1b13]/5 border border-[#2c1b13]/10 dark:bg-[#2c1b13] dark:border-[#fcf2e9]/10 p-8 rounded-3xl"
                        >
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                                <HiOutlineGlobe className="text-green-400 text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">Our Mission</h2>
                            <p className="text-[#2c1b13]/70 dark:text-[#fcf2e9]/60 leading-relaxed">
                                To revolutionize the hostel industry by providing a verified, transparent, and easy-to-use platform where users can find their "home away from home" with zero hassle.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Vision */}
                <section className="container mx-auto px-4 mb-24 text-center">
                    <motion.div 
                        {...fadeIn}
                        className="bg-gradient-to-r from-orange-900/10 to-amber-900/10 border border-orange-500/20 rounded-3xl p-10 md:p-16 max-w-5xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-6">Our Vision</h2>
                        <p className="text-xl text-[#2c1b13]/80 dark:text-[#fcf2e9]/80 max-w-3xl mx-auto">
                            "To become the most trusted and preferred accommodation partner for students and young professionals across the country."
                        </p>
                    </motion.div>
                </section>

                {/* What We Offer */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">What We Offer</h2>
                        <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">Features designed with you in mind.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Verified Listings", desc: "Every hostel is manually verified for quality and safety." },
                            { title: "Smart Search", desc: "Filter by amenities, price, location, and type." },
                            { title: "Transparent Reviews", desc: "Real reviews from real students to help you decide." },
                            { title: "Direct Connection", desc: "Connect directly with hostel owners. No middlemen." },
                            { title: "Secure Environment", desc: "We prioritize hostels with CCTV and security measures." },
                            { title: "Mobile Friendly", desc: "Book your stay on the go with our responsive design." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                {...fadeIn}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[#fff8f2] dark:bg-[#1f1f35] p-6 rounded-2xl border border-[#2c1b13]/5 dark:border-white/5 hover:border-orange-500/30 transition-colors shadow-sm"
                            >
                                <h3 className="text-xl font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">{item.title}</h3>
                                <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Founder Section */}
                <section className="container mx-auto px-4 mb-24">
                    <motion.div 
                        {...fadeIn}
                        className="bg-[#2c1b13]/5 border border-[#2c1b13]/10 dark:bg-[#1a1a2e] dark:border-white/5 rounded-3xl overflow-hidden md:flex"
                    >
                        <div className="md:w-2/5 relative h-96 md:h-auto bg-[#2c1b13]/10 dark:bg-gray-800">
                            <Image src={Founder} alt="Founder" fill className="object-cover" />
                        </div>
                        <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center">
                            <span className="text-orange-500 font-bold tracking-wider text-sm mb-2">MEET THE FOUNDER</span>
                            <h2 className="text-3xl font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">Hussain Jamal</h2>
                            <p className="text-[#2c1b13]/50 dark:text-[#fcf2e9]/50 mb-6">Founder & Lead Developer</p>
                            <blockquote className="text-xl text-[#2c1b13]/80 dark:text-[#fcf2e9]/80 italic leading-relaxed mb-6">
                                "I built HOSTELITE because I know the struggle. Moving to a new city shouldn't mean compromising on safety or comfort. This platform is my promise to every student: finding a home should be the easiest part of your journey."
                            </blockquote>
                        </div>
                    </motion.div>
                </section>

                {/* Our Commitment */}
                <section className="container mx-auto px-4 mb-24 text-center">
                    <motion.div 
                        {...fadeIn}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <HiOutlineShieldCheck className="text-blue-400 text-3xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">Our Commitment</h2>
                        <p className="text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 leading-relaxed">
                            We are committed to maintaining a safe, inclusive, and transparent ecosystem. We have zero tolerance for verified fake listings or discriminatory practices. Your trust is our asset.
                        </p>
                    </motion.div>
                </section>

                {/* Call To Action */}
                <section className="container mx-auto px-4 text-center">
                    <motion.div 
                        {...fadeIn}
                        className="bg-gradient-to-br from-orange-600 to-amber-700 rounded-3xl p-12 md:p-20"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to find your perfect stay?</h2>
                        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                            Join thousands of students who have found their second home with HOSTELITE.
                        </p>
                        <a 
                            href="/hostels" 
                            className="inline-block bg-white text-orange-700 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
                        >
                            Start Searching Now
                        </a>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
