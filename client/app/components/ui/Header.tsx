"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from '../../assets/logo.png'
import { HiOutlineMenuAlt3, HiOutlineUserCircle, HiX } from "react-icons/hi";
import { navItems } from "../utils/navItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import Login from "../Auth/Login";
import SignUp from "../Auth/Signup";

const Header = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [route, setRoute] = useState("Login");

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open || openLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open, openLogin]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[999] transition-all duration-500 ${
          active
            ? "bg-brand-bg/80 dark:bg-dark-bg/80 backdrop-blur-xl py-3 shadow-lg"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 md:px-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-14 h-14 overflow-hidden rounded-xl bg-brand-primary dark:bg-dark-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src={Logo}
                alt="Logo"
                width={68}
                height={68}
                className="object-contain invert dark:invert-0"
              />
            </div>
            <div className="flex flex-col leading-tight">

            <span className="font-heading font-bold text-2xl tracking-tight text-brand-primary dark:text-dark-text">
              HOSTELITES
            </span>
            <span className=" font text-sm tracking-tight text-brand-primary dark:text-dark-text ">
             <i>
               Beyond Ordinary
              </i>
            </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className="text-[14px] uppercase tracking-widest font-body font-semibold text-nav-text hover:opacity-70 transition-all relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-nav-text transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />

            <div onClick={() => setOpenLogin(true)} className="hidden md:block">
              <HiOutlineUserCircle
                size={32}
                className="text-nav-text cursor-pointer hover:opacity-80 transition-opacity"
              />
            </div>

            <button
              className="md:hidden ml-2 text-nav-text outline-none"
              onClick={() => setOpen(!open)}
            >
              <HiOutlineMenuAlt3 size={30} />
            </button>
          </div>
        </div>

        <div
          className={`fixed inset-0 h-screen w-full bg-brand-bg/60 dark:bg-dark-bg/60 backdrop-blur-lg z-[1000] transition-all duration-500 ease-in-out md:hidden ${
            open
              ? "opacity-100 pointer-events-auto translate-y-0"
              : "opacity-0 pointer-events-none -translate-y-full"
          }`}
        >
          <div className="flex flex-col h-full p-8">
            <div className="flex justify-between items-center mb-12">
              <div
                onClick={() => {
                  setOpen(false);
                  setOpenLogin(true);
                }}
              >
                <HiOutlineUserCircle
                  size={40}
                  className="text-black dark:text-[#fff8f2] cursor-pointer"
                />
              </div>
              <HiX
                size={35}
                className="text-brand-primary dark:text-dark-text cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>

            <nav className="flex flex-col items-center justify-center gap-8 flex-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className={`text-4xl font-heading font-bold text-brand-primary dark:text-dark-text transition-all duration-500 ${
                    open
                      ? "translate-y-0 opacity-100 scale-100"
                      : "translate-y-10 opacity-0 scale-90"
                  }`}
                  style={{
                    transitionDelay: open ? `${index * 100}ms` : "0ms",
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto text-center font-body text-xs tracking-widest uppercase opacity-40 text-brand-text dark:text-dark-text">
              ©{new Date().getFullYear()} Hostelite. Premium Hostel Finder
            </div>
          </div>
        </div>
      </header>

      {/* Modal Logic */}
{openLogin && (
  <>
    {route === "Login" && (
      <Login
        open={openLogin}
        setOpen={setOpenLogin}
        setRoute={setRoute}
      />
    )}

    {route === "Sign-Up" && (
      <SignUp
        open={openLogin}
        setOpen={setOpenLogin}
        setRoute={setRoute}
      />
    )}
  </>
)}
    </>
  );
};

export default Header;