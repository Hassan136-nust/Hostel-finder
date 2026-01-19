"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../assets/logo.png";
import { HiOutlineMenuAlt3, HiOutlineUserCircle, HiX, HiOutlineHeart, HiHeart, HiOutlineKey, HiOutlineTrash, HiOutlineLocationMarker } from "react-icons/hi";
import { navItems } from "../utils/navItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import Login from "../Auth/Login";
import SignUp from "../Auth/Signup";
import Verification from "../Auth/Verification";
import { useSelector } from "react-redux";
import { useGetFavoritesQuery, useRemoveFromFavoritesMutation } from "@/redux/features/favorites/favoritesApi";
import { toast } from "react-hot-toast";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const Header = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [route, setRoute] = useState("Login");
  const [showFavorites, setShowFavorites] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const { data: favoritesData, refetch: refetchFavorites } = useGetFavoritesQuery(undefined, { skip: !user });
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const favorites = favoritesData?.favorites || [];

  const handleRemoveFavorite = async (e: React.MouseEvent, roomId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeFromFavorites(roomId).unwrap();
      toast.success("Removed from favorites");
      refetchFavorites();
    } catch (error) {
      toast.error("Failed to remove");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open || openAuth) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open, openAuth]);

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
              width={68}
              height={68}
              className="object-contain invert dark:invert-0"
            />
          </div>
          <div className="flex flex-col">
          <span className="font-bold text-2xl tracking-tight text-brand-primary dark:text-dark-text">
            HOSTELITE
          </span>
           <span className="text-1xl tracking-tight text-brand-primary dark:text-dark-text">
            <i>Beyond Ordinary</i>
          </span>
          </div>
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

          {user && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className="relative p-2 rounded-full hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10 transition-colors"
              >
                {favorites.length > 0 ? (
                  <HiHeart size={24} className="text-red-500" />
                ) : (
                  <HiOutlineHeart size={24} className="text-[#2c1b13] dark:text-[#fcf2e9]" />
                )}
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>

              {showFavorites && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowFavorites(false)} />
                  <div className="absolute right-0 top-14 w-96 bg-white dark:bg-[#1a0f0a] rounded-3xl shadow-2xl border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 z-50 overflow-hidden">
                    <div className="p-5 bg-gradient-to-r from-red-500 to-pink-500">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <HiHeart size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">My Favorites</h3>
                          <p className="text-white/80 text-sm">{favorites.length} room{favorites.length !== 1 ? 's' : ''} saved</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {favorites.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 flex items-center justify-center">
                            <HiOutlineHeart size={32} className="text-[#2c1b13]/30 dark:text-[#fcf2e9]/30" />
                          </div>
                          <p className="font-medium text-[#2c1b13] dark:text-[#fcf2e9] mb-1">No favorites yet</p>
                          <p className="text-sm text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">Browse rooms and tap the heart to save them here</p>
                        </div>
                      ) : (
                        <div className="p-3 space-y-2">
                          {favorites.map((room: any) => (
                            <div
                              key={room._id}
                              className="group relative bg-[#fcf2e9] dark:bg-[#2c1b13] rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                            >
                              <Link
                                href={`/hostels/${room.hostel?._id}/rooms/${room._id}`}
                                onClick={() => setShowFavorites(false)}
                                className="flex gap-4 p-3"
                              >
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#2c1b13]/10 shrink-0">
                                  {room.images?.[0] ? (
                                    <img src={room.images[0].url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <HiOutlineKey size={24} className="opacity-30" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 py-1">
                                  <p className="font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-1">{room.type} Room</p>
                                  <p className="text-xs text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 flex items-center gap-1 mb-2">
                                    <HiOutlineLocationMarker size={12} />
                                    {room.hostel?.name || 'Hostel'}
                                  </p>
                                  <p className="text-lg font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
                                    PKR {room.price?.toLocaleString()}
                                    <span className="text-xs font-normal opacity-60">/mo</span>
                                  </p>
                                </div>
                              </Link>
                              <button
                                onClick={(e) => handleRemoveFavorite(e, room._id)}
                                className="absolute top-3 right-3 p-2 rounded-full bg-white dark:bg-[#1a0f0a] shadow-md opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                title="Remove from favorites"
                              >
                                <HiOutlineTrash size={16} className="text-red-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="hidden md:block cursor-pointer">
            {user ? (
              <Link href={"/profile"}>
                {user.avatar?.url ? (
                  <Image
                    src={user.avatar.url}
                    alt="user"
                    width={35}
                    height={35}
                    className="rounded-full border-2 border-brand-primary dark:border-dark-primary"
                  />
                ) : (
                  <div className="w-[35px] h-[35px] rounded-full bg-[#2c1b13] dark:bg-[#fcf2e9] flex items-center justify-center text-[#fcf2e9] dark:text-[#2c1b13] text-sm font-bold border-2 border-brand-primary dark:border-dark-primary">
                    {getInitials(user.name)}
                  </div>
                )}
              </Link>
            ) : (
              <div
                onClick={() => {
                  setRoute("Login");
                  setOpenAuth(true);
                }}
              >
                <HiOutlineUserCircle
                  size={32}
                  className="text-black dark:text-[#fff8f2] hover:opacity-80 transition-opacity"
                />
              </div>
            )}
          </div>

          <button
            className="md:hidden ml-2 text-brand-primary dark:text-dark-text outline-none"
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
            <div className="cursor-pointer">
              {user ? (
                <Link href={"/profile"} onClick={() => setOpen(false)}>
                  {user.avatar?.url ? (
                    <Image
                      src={user.avatar.url}
                      alt="user"
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-brand-primary dark:border-dark-primary"
                    />
                  ) : (
                    <div className="w-[40px] h-[40px] rounded-full bg-[#2c1b13] dark:bg-[#fcf2e9] flex items-center justify-center text-[#fcf2e9] dark:text-[#2c1b13] text-base font-bold border-2 border-brand-primary dark:border-dark-primary">
                      {getInitials(user.name)}
                    </div>
                  )}
                </Link>
              ) : (
                <div
                  onClick={() => {
                    setRoute("Login");
                    setOpenAuth(true);
                    setOpen(false);
                  }}
                >
                  <HiOutlineUserCircle
                    size={40}
                    className="text-black dark:text-[#fff8f2]"
                  />
                </div>
              )}
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
                style={{ transitionDelay: open ? `${index * 100}ms` : "0ms" }}
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

      {/* Auth Modals */}
      {route === "Login" && (
        <Login open={openAuth} setOpen={setOpenAuth} setRoute={setRoute} />
      )}
      {route === "Sign-Up" && (
        <SignUp open={openAuth} setOpen={setOpenAuth} setRoute={setRoute} />
      )}
      {route === "Verification" && (
        <Verification open={openAuth} setOpen={setOpenAuth} setRoute={setRoute} />
      )}
    </header>
  );
};

export default Header;