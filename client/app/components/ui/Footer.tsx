"use client";

import React from "react";
import Link from "next/link";
import { 
    HiOutlineLocationMarker, 
    HiOutlineMail, 
    HiOutlinePhone,
    HiOutlineArrowRight
} from "react-icons/hi";
import { 
    FaFacebookF, 
    FaTwitter, 
    FaInstagram, 
    FaLinkedinIn,
    FaWhatsapp
} from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        explore: [
            { name: "Find Hostels", href: "/hostels" },
            { name: "Browse by City", href: "/cities" },
            { name: "Popular Areas", href: "/areas" },
            { name: "Map View", href: "/map" },
        ],
        forManagers: [
            { name: "List Your Hostel", href: "/hostel-dashboard" },
            { name: "Manager Dashboard", href: "/hostel-dashboard" },
            { name: "Pricing Plans", href: "/pricing" },
            { name: "Success Stories", href: "/stories" },
        ],
        support: [
            { name: "Help Center", href: "/help" },
            { name: "Contact Us", href: "/contact" },
            { name: "FAQs", href: "/faqs" },
            { name: "Terms of Service", href: "/terms" },
        ],
    };

    const socialLinks = [
        { icon: FaFacebookF, href: "#", label: "Facebook" },
        { icon: FaTwitter, href: "#", label: "Twitter" },
        { icon: FaInstagram, href: "#", label: "Instagram" },
        { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
        { icon: FaWhatsapp, href: "#", label: "WhatsApp" },
    ];

    return (
        <footer className="bg-[#1a0f0a] dark:bg-[#fcf2e9] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fcf2e9]/20 dark:via-[#2c1b13]/20 to-transparent" />
            <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-[#2c1b13]/30 rounded-full blur-[100px]" />
            <div className="absolute -bottom-40 -left-40 w-[300px] h-[300px] bg-[#2c1b13]/20 rounded-full blur-[80px]" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-20 pb-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-block mb-6">
                            <h2 className="text-2xl font-heading font-bold text-[#fcf2e9] dark:text-[#2c1b13]">
                                Hostelites<span className="text-[#fcf2e9]/50 dark:text-[#2c1b13]/50"></span>
                            </h2>
                        </Link>
                        <p className="text-[#fcf2e9]/60 dark:text-[#2c1b13]/60 mb-6 max-w-sm leading-relaxed">
                            Pakistan's #1 platform for finding and listing quality hostels. Connecting students and professionals with their perfect accommodation.
                        </p>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[#fcf2e9]/60 dark:text-[#2c1b13]/60">
                                <HiOutlineLocationMarker size={18} />
                                <span className="text-sm">Islamabad, Pakistan</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#fcf2e9]/60 dark:text-[#2c1b13]/60">
                                <HiOutlineMail size={18} />
                                <span className="text-sm">contact@hostelfinder.pk</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#fcf2e9]/60 dark:text-[#2c1b13]/60">
                                <HiOutlinePhone size={18} />
                                <span className="text-sm">+92 300 1234567</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#fcf2e9] dark:text-[#2c1b13] mb-6">
                            Explore
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.explore.map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        href={link.href}
                                        className="text-[#fcf2e9]/60 dark:text-[#2c1b13]/60 hover:text-[#fcf2e9] dark:hover:text-[#2c1b13] transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#fcf2e9] dark:text-[#2c1b13] mb-6">
                            For Managers
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.forManagers.map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        href={link.href}
                                        className="text-[#fcf2e9]/60 dark:text-[#2c1b13]/60 hover:text-[#fcf2e9] dark:hover:text-[#2c1b13] transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#fcf2e9] dark:text-[#2c1b13] mb-6">
                            Stay Updated
                        </h3>
                        <p className="text-[#fcf2e9]/60 dark:text-[#2c1b13]/60 text-sm mb-4">
                            Subscribe to get the latest hostels and exclusive deals.
                        </p>
                        <div className="flex gap-2">
                            <input 
                                type="email" 
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-xl bg-[#fcf2e9]/5 dark:bg-[#2c1b13]/5 border border-[#fcf2e9]/10 dark:border-[#2c1b13]/10 text-[#fcf2e9] dark:text-[#2c1b13] placeholder:text-[#fcf2e9]/40 dark:placeholder:text-[#2c1b13]/40 focus:outline-none focus:border-[#fcf2e9]/30 dark:focus:border-[#2c1b13]/30 transition-colors text-sm"
                            />
                            <button className="px-4 py-3 rounded-xl bg-[#fcf2e9] dark:bg-[#2c1b13] text-[#2c1b13] dark:text-[#fcf2e9] hover:scale-105 active:scale-95 transition-transform">
                                <HiOutlineArrowRight size={18} />
                            </button>
                        </div>

                        <div className="flex gap-3 mt-8">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="p-3 rounded-xl bg-[#fcf2e9]/5 dark:bg-[#2c1b13]/5 text-[#fcf2e9]/60 dark:text-[#2c1b13]/60 hover:bg-[#fcf2e9]/10 dark:hover:bg-[#2c1b13]/10 hover:text-[#fcf2e9] dark:hover:text-[#2c1b13] transition-all"
                                >
                                    <social.icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-[#fcf2e9]/10 dark:border-[#2c1b13]/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-[#fcf2e9]/40 dark:text-[#2c1b13]/40 text-sm">
                            © {currentYear} Hostelites. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-[#fcf2e9]/40 dark:text-[#2c1b13]/40 hover:text-[#fcf2e9]/70 dark:hover:text-[#2c1b13]/70 text-sm transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-[#fcf2e9]/40 dark:text-[#2c1b13]/40 hover:text-[#fcf2e9]/70 dark:hover:text-[#2c1b13]/70 text-sm transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/cookies" className="text-[#fcf2e9]/40 dark:text-[#2c1b13]/40 hover:text-[#fcf2e9]/70 dark:hover:text-[#2c1b13]/70 text-sm transition-colors">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
