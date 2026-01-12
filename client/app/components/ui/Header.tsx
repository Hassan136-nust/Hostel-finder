"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { navItems } from "../utils/navItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import Logo from "../../assets/logo.png"; 

const Header = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[999] transition-all duration-500 ${
        active 
          ? "bg-brand-bg/80 dark:bg-dark-bg/80 backdrop-blur-xl py-3 shadow-lg" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 md:px-12">
        
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-brand-primary dark:bg-dark-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <Image 
              src={Logo}
              alt="Logo"
              width={28}
              height={28}
              className="object-contain invert dark:invert-0"
            />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-brand-primary dark:text-dark-text">
            Stay<span className="text-brand-text dark:text-dark-primary">Hub</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              className="text-[14px] uppercase tracking-widest font-body font-semibold text-brand-text/70 hover:text-brand-primary dark:text-dark-text/60 dark:hover:text-dark-primary transition-all relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-primary dark:bg-dark-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          
          <Link href="/auth" className="hidden sm:block">
            <button className="relative px-8 py-3 rounded-full font-body font-bold text-xs uppercase tracking-widest overflow-hidden group bg-brand-primary text-brand-bg dark:bg-dark-primary dark:text-dark-bg transition-all hover:shadow-2xl hover:shadow-brand-primary/20">
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </Link>

          {/* Mobile Menu Icon */}
          <button className="md:hidden ml-2 p-2 text-brand-primary dark:text-dark-text">
            <HiOutlineMenuAlt3 size={28} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;