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
    if (open || openAuth || showFavorites) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open, openAuth, showFavorites]);

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
      </header>

      {/* Mobile Menu - Modern Slide-in Sidebar */}
      {open && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <div className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#fcf2e9] dark:bg-[#2c1b13] shadow-2xl transform transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#2c1b13]/10 dark:border-[#fcf2e9]/10">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] flex items-center justify-center">
                    <Image
                      src={Logo}
                      alt="Logo"
                      width={50}
                      height={50}
                      className="object-contain invert dark:invert-0"
                    />
                  </div>
                  <span className="font-bold text-xl text-[#2c1b13] dark:text-[#fcf2e9]">HOSTELITE</span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10 transition-colors"
                >
                  <HiX size={24} className="text-[#2c1b13] dark:text-[#fcf2e9]" />
                </button>
              </div>

              {/* Profile Section */}
              <div className="p-6 border-b border-[#2c1b13]/10 dark:border-[#fcf2e9]/10">
                {user ? (
                  <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10 transition-all">
                    {user.avatar?.url ? (
                      <Image
                        src={user.avatar.url}
                        alt="user"
                        width={56}
                        height={56}
                        className="rounded-full border-2 border-[#2c1b13] dark:border-[#fcf2e9]"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-[#2c1b13] dark:bg-[#fcf2e9] flex items-center justify-center text-[#fcf2e9] dark:text-[#2c1b13] text-lg font-bold border-2 border-[#2c1b13] dark:border-[#fcf2e9]">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#2c1b13] dark:text-[#fcf2e9] truncate">{user.name}</p>
                      <p className="text-sm text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 truncate">{user.email}</p>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setRoute("Login");
                      setOpenAuth(true);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    <HiOutlineUserCircle size={28} />
                    <span className="font-bold text-lg">Login / Sign Up</span>
                  </button>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-6 space-y-2">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 hover:bg-[#2c1b13] dark:hover:bg-[#fcf2e9] hover:text-[#fcf2e9] dark:hover:text-[#2c1b13] text-[#2c1b13] dark:text-[#fcf2e9] font-semibold transition-all group"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#2c1b13] dark:bg-[#fcf2e9] group-hover:bg-[#fcf2e9] dark:group-hover:bg-[#2c1b13] group-hover:scale-150 transition-all" />
                    <span className="text-lg">{item.name}</span>
                  </Link>
                ))}
                
                {/* Favorites Button */}
                {user && (
                  <button
                    onClick={() => {
                      setShowFavorites(true);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 hover:bg-red-500 hover:text-white text-[#2c1b13] dark:text-[#fcf2e9] font-semibold transition-all group"
                  >
                    <HiHeart className="group-hover:scale-110 transition-transform" size={20} />
                    <span className="text-lg">My Favorites</span>
                    {favorites.length > 0 && (
                      <span className="ml-auto px-2.5 py-1 rounded-full bg-red-500 text-white text-sm font-bold">
                        {favorites.length}
                      </span>
                    )}
                  </button>
                )}
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 space-y-4">
                {/* Theme Switcher */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5">
                  <span className="text-sm font-semibold text-[#2c1b13] dark:text-[#fcf2e9]">Theme</span>
                  <ThemeSwitcher />
                </div>
                
                <p className="text-xs text-center text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 tracking-wider">
                  © {new Date().getFullYear()} HOSTELITE
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Favorites Modal */}
      {showFavorites && (
        <>
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 z-[99998] bg-black/40 backdrop-blur-md" 
            onClick={() => setShowFavorites(false)} 
          />
          
          {/* Centered Modal */}
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none">
            <div 
              className="w-full max-w-2xl bg-white dark:bg-[#1a0f0a] rounded-3xl shadow-2xl border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 overflow-hidden max-h-[85vh] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 bg-gradient-to-r from-red-500 to-pink-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <HiHeart size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">My Favorites</h3>
                      <p className="text-white/80 text-sm">{favorites.length} room{favorites.length !== 1 ? 's' : ''} saved</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowFavorites(false)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <HiX size={20} className="text-white" />
                  </button>
                </div>
              </div>
              
              <div className="max-h-[calc(85vh-120px)] overflow-y-auto">
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
          </div>
        </>
      )}

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
    </>
  );
};

export default Header;