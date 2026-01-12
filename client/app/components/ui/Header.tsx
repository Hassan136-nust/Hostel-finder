"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { BiMoon, BiSun } from "react-icons/bi";
import Image from "next/image";
import logo from "../../assets/logo.png";

const Header = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Scroll logic ko handle karne ke liye simple useEffect
  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme icons ko safely render karne ke liye helper function
  const renderThemeChanger = () => {
    // Agar theme detect nahi hui toh khali space dikhao (Hydration error se bachne ke liye)
    if (!resolvedTheme) return <div className="p-2 w-[38px] h-[38px]" />;

    return (
      <button
        aria-label="Toggle Theme"
        className="cursor-pointer p-2 rounded-full hover:bg-brand-card/30 dark:hover:bg-dark-card transition-all"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {resolvedTheme === "light" ? (
          <BiMoon size={22} className="text-brand-primary" />
        ) : (
          <BiSun size={22} className="text-dark-primary" />
        )}
      </button>
    );
  };

  return (
    <header
      className={`w-full min-h-[70px] flex items-center justify-between px-4 md:px-10 sticky top-0 z-[999] transition-all duration-300 ${
        active
          ? "bg-brand-bg/80 dark:bg-dark-bg/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >

      <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="Hostel Finder Logo"
            width={100}
            height={100}
            className="object-contain"
          />
          <span className="font-heading font-bold text-xl hidden sm:block text-brand-primary dark:text-dark-text">
            HOSTELITE<span className="text-brand-text dark:text-dark-primary"></span>
          </span>
        </Link>

      {/* Navigation Links - Desktop */}
      <nav className="hidden md:flex items-center gap-8">
        {["Home", "Hostels", "About Us", "Contact"].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase().replace(" ", "")}`}
            className="text-[16px] font-body font-[500] hover:text-brand-primary dark:hover:text-dark-primary transition-colors"
          >
            {item}
          </Link>
        ))}
      </nav>

      {/* Right Side Icons & Auth */}
      <div className="flex items-center gap-5">
        {/* Theme Toggler Call */}
        {renderThemeChanger()}

        {/* Auth Button */}
        <div className="hidden md:block">
          <button className="bg-brand-primary dark:bg-dark-primary text-brand-bg dark:text-dark-bg px-6 py-2 rounded-full font-body font-[600] text-[14px] hover:opacity-90 transition-opacity">
            Login
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden cursor-pointer" onClick={() => setOpen(!open)}>
          <HiOutlineMenuAlt3 size={25} className="text-brand-primary dark:text-dark-text" />
        </div>
      </div>
    </header>
  );
};

export default Header;