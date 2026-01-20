"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
    HiOutlineMail, 
    HiOutlinePaperAirplane,
    HiOutlineUser,
    HiOutlineChat,
    HiOutlineCheckCircle
} from "react-icons/hi";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { useForm, ValidationError } from '@formspree/react';

const ContactPage = () => {
    const [state, handleSubmit] = useForm("xbddyvzd");
    
    if (state.succeeded) {
        return (
             <div className="bg-[#fcf2e9] dark:bg-[#1f1710] min-h-screen transition-colors flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-[#2c1b13] p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10"
                    >
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <HiOutlineCheckCircle className="text-green-500 text-4xl" />
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-4">
                            Message Sent!
                        </h2>
                        <p className="text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 mb-8">
                            Thanks for reaching out! We've received your message and our team will get back to you within 24-48 hours.
                        </p>
                        <a 
                            href="/" 
                            className="inline-block bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Back to Home
                        </a>
                    </motion.div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="bg-[#fcf2e9] dark:bg-[#1f1710] min-h-screen transition-colors flex flex-col">
            <Header />
            
            <main className="pt-24 pb-20 flex-1">
                <section className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20">
                        {/* Contact Info & Intro */}
                        <div className="md:w-1/2 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h1 className="text-4xl md:text-6xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-6">
                                    Let's <span className="text-orange-600 dark:text-orange-400">Talk</span>
                                </h1>
                                <p className="text-lg text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 leading-relaxed mb-8">
                                    Have a question, feedback, or just want to say hi? We're here to help! Whether you're a student looking for a room or a hostel owner wanting to partner up, drop us a line.
                                </p>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-[#2c1b13] p-8 rounded-3xl border border-[#2c1b13]/5 dark:border-[#fcf2e9]/5 shadow-sm"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center shrink-0">
                                        <HiOutlineMail className="text-orange-500 text-2xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#2c1b13] dark:text-[#fcf2e9] text-xl mb-1">Email Us</h3>
                                        <p className="text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 mb-2">For general inquiries & support</p>
                                        <p className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">hjamal9865@gmail.com</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-500/10">
                                    <p className="text-sm text-orange-800 dark:text-orange-200 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                                        Typical response time: 24-48 hours
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Contact Form */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="md:w-1/2"
                        >
                            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#2c1b13] p-8 md:p-10 rounded-3xl border border-[#2c1b13]/5 dark:border-[#fcf2e9]/5 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"/>
                                
                                <h3 className="text-2xl font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-8">Send a Message</h3>

                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-bold text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 mb-2 ml-1">Full Name</label>
                                        <div className="relative">
                                            <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c1b13]/30 dark:text-[#fcf2e9]/30 text-xl" />
                                            <input
                                                id="name"
                                                type="text" 
                                                name="name"
                                                required
                                                placeholder="John Doe"
                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#fcf2e9]/50 dark:bg-[#1f1710] border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-[#2c1b13]/30 dark:placeholder:text-[#fcf2e9]/30"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 mb-2 ml-1">Email Address</label>
                                        <div className="relative">
                                            <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c1b13]/30 dark:text-[#fcf2e9]/30 text-xl" />
                                            <input
                                                id="email"
                                                type="email" 
                                                name="email"
                                                required
                                                placeholder="john@example.com"
                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#fcf2e9]/50 dark:bg-[#1f1710] border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-[#2c1b13]/30 dark:placeholder:text-[#fcf2e9]/30"
                                            />
                                        </div>
                                        <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-sm mt-1" />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-bold text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 mb-2 ml-1">Subject (Optional)</label>
                                        <div className="relative">
                                            <HiOutlineChat className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c1b13]/30 dark:text-[#fcf2e9]/30 text-xl" />
                                            <input
                                                id="subject"
                                                type="text" 
                                                name="subject"
                                                placeholder="Partnership Inquiry..."
                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#fcf2e9]/50 dark:bg-[#1f1710] border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-[#2c1b13]/30 dark:placeholder:text-[#fcf2e9]/30"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-bold text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 mb-2 ml-1">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={5}
                                            placeholder="How can we help you today?"
                                            className="w-full px-4 py-4 rounded-xl bg-[#fcf2e9]/50 dark:bg-[#1f1710] border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-[#2c1b13]/30 dark:placeholder:text-[#fcf2e9]/30 resize-none"
                                        />
                                        <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={state.submitting}
                                        className="w-full bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span>Send Message</span>
                                        <HiOutlinePaperAirplane className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    
                                    <p className="text-xs text-center text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 mt-4">
                                        Your privacy is important to us. We'll never share your data.
                                    </p>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;
