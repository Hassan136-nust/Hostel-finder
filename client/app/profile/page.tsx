"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft, HiPencil, HiLogout, HiCamera, HiX, HiCheck, HiOfficeBuilding, HiCog, HiSparkles } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useLogoutQuery } from "@/redux/features/auth/authApi";
import UserActivitySection from "../components/Profile/UserActivitySection";
import {
  useUpdateUserInfoMutation,
  useUpdateAvatarMutation,
  useRequestHostelAccessMutation,
} from "@/redux/features/user/userApi";
import { toast } from "react-hot-toast";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  onSave: (value: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  title,
  value,
  onSave,
  isLoading,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSave(inputValue.trim());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] rounded-[2rem] p-8 shadow-2xl border border-white/10 dark:border-black/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
              >
                <HiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className="w-full px-5 py-4 rounded-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 focus:border-[#fcf2e9] dark:focus:border-[#2c1b13] focus:outline-none transition-colors font-body"
                autoFocus
              />
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3.5 rounded-xl border border-white/20 dark:border-black/20 hover:bg-white/10 dark:hover:bg-black/10 transition-colors font-body font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-[#fcf2e9] dark:bg-[#2c1b13] text-[#2c1b13] dark:text-[#fcf2e9] font-body font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : (
                    <>
                      <HiCheck size={18} />
                      Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProfilePage = () => {
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editPhoneOpen, setEditPhoneOpen] = useState(false);
  const [shouldLogout, setShouldLogout] = useState(false);

  const { isSuccess: logoutSuccess } = useLogoutQuery(undefined, {
    skip: !shouldLogout,
  });

  const [updateUserInfo, { isLoading: isUpdatingInfo }] = useUpdateUserInfoMutation();
  const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation();
  const [requestHostelAccess, { isLoading: isRequesting }] = useRequestHostelAccessMutation();

  useEffect(() => {
    if (logoutSuccess) {
      toast.success("Logged out successfully");
      router.push("/");
    }
  }, [logoutSuccess, router]);

  const handleLogout = () => {
    setShouldLogout(true);
  };

  const handleUpdateName = async (name: string) => {
    try {
      await updateUserInfo({ name }).unwrap();
      toast.success("Name updated successfully");
      setEditNameOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update name");
    }
  };

  const handleUpdatePhone = async (phone: string) => {
    try {
      await updateUserInfo({ phone }).unwrap();
      toast.success("Phone number updated successfully");
      setEditPhoneOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update phone");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await updateAvatar({ avatar: reader.result as string }).unwrap();
        toast.success("Avatar updated successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update avatar");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRequestHostelAccess = async () => {
    try {
      await requestHostelAccess({}).unwrap();
      toast.success("Request sent successfully! Please wait for admin approval.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send request");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6 px-4 relative overflow-hidden">
        <div className="absolute top-[20%] left-[-5%] w-[300px] h-[300px] bg-[#2c1b13]/20 dark:bg-[#fcf2e9]/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-[20%] right-[-5%] w-[250px] h-[250px] bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/5 rounded-full blur-[80px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">Access Denied</h1>
          <p className="text-lg opacity-70 font-body">Please login to view your profile</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/"
            className="px-8 py-4 rounded-[1.5rem] bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-body font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl inline-block"
          >
            Go back home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-[#2c1b13]/20 dark:bg-[#fcf2e9]/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[10%] right-[-5%] w-[300px] h-[300px] bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-[50%] right-[20%] w-[200px] h-[200px] bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 rounded-full blur-[80px] -z-10" />

      <div className="pt-8 md:pt-16 pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-8 opacity-70 hover:opacity-100 transition-opacity group font-body"
            >
              <HiOutlineArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2c1b13]/30 to-[#2c1b13]/10 dark:from-[#fcf2e9]/20 dark:to-[#fcf2e9]/5 rounded-[2.5rem] blur opacity-50" />
            
            <div className="relative bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/10 dark:border-black/10">
              <div className="flex flex-col lg:flex-row lg:items-start gap-10">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-white/20 to-white/5 dark:from-black/20 dark:to-black/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/20 dark:border-black/20 shadow-2xl">
                      {user.avatar?.url ? (
                        <img
                          src={user.avatar.url}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#fcf2e9] dark:bg-[#2c1b13] flex items-center justify-center text-[#2c1b13] dark:text-[#fcf2e9] text-4xl md:text-5xl font-heading font-bold">
                          {getInitials(user.name)}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUpdatingAvatar}
                      className="absolute bottom-1 right-1 p-3 rounded-full bg-[#fcf2e9] dark:bg-[#2c1b13] text-[#2c1b13] dark:text-[#fcf2e9] shadow-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isUpdatingAvatar ? (
                        <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      ) : (
                        <HiCamera size={20} />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>

                  <div className="mt-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fcf2e9] dark:bg-[#2c1b13] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fcf2e9] dark:bg-[#2c1b13]"></span>
                      </span>
                      <span className="text-xs font-body font-bold uppercase tracking-widest">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-5">
                  <div className="group p-5 rounded-2xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300 cursor-pointer"
                    onClick={() => setEditNameOpen(true)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-body font-bold mb-2">
                          Full Name
                        </p>
                        <p className="font-heading font-bold text-2xl truncate">{user.name}</p>
                      </div>
                      <div className="p-3 rounded-full bg-white/10 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <HiPencil size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="group p-5 rounded-2xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300 cursor-pointer"
                    onClick={() => setEditPhoneOpen(true)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-body font-bold mb-2">
                          Phone Number
                        </p>
                        <p className="font-heading font-bold text-2xl truncate">
                          {user.phone || "Add phone number"}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-white/10 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <HiPencil size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-body font-bold mb-2">
                          Email Address
                        </p>
                        <p className="font-heading font-bold text-2xl truncate">{user.email}</p>
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-white/10 dark:bg-black/10 text-[10px] font-body font-bold uppercase tracking-widest opacity-50">
                        Verified
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 dark:border-black/10">
                {user.role === "user" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 dark:from-black/10 dark:to-black/5 border border-white/10 dark:border-black/10 mb-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-white/10 dark:bg-black/10">
                          <HiSparkles size={24} />
                        </div>
                        <div>
                          <p className="font-heading font-bold text-lg mb-1">Become a Hostel Manager</p>
                          <p className="text-sm opacity-70 font-body">
                            {user.hostelRequestStatus === "pending"
                              ? "Your request is being reviewed"
                              : user.hostelRequestStatus === "rejected"
                              ? "Your previous request was declined"
                              : "List and manage your own hostel"}
                          </p>
                        </div>
                      </div>
                      {user.hostelRequestStatus === "pending" ? (
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 dark:bg-black/20 text-sm font-body font-bold whitespace-nowrap">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                          </span>
                          Pending
                        </span>
                      ) : (
                        <button
                          onClick={handleRequestHostelAccess}
                          disabled={isRequesting}
                          className="px-6 py-3 rounded-xl bg-[#fcf2e9] dark:bg-[#2c1b13] text-[#2c1b13] dark:text-[#fcf2e9] font-body font-bold hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap flex items-center justify-center gap-2"
                        >
                          {isRequesting ? (
                            <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                          ) : (
                            "Request Access"
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {user.role === "manager" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      href="/hostel-dashboard"
                      className="block p-6 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 dark:from-black/10 dark:to-black/5 border border-white/10 dark:border-black/10 hover:from-white/15 hover:to-white/10 dark:hover:from-black/15 dark:hover:to-black/10 transition-all duration-300 group mb-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-white/10 dark:bg-black/10 group-hover:scale-110 transition-transform">
                            <HiOfficeBuilding size={24} />
                          </div>
                          <div>
                            <p className="font-heading font-bold text-lg mb-1">Hostel Dashboard</p>
                            <p className="text-sm opacity-70 font-body">
                              Manage your listings and bookings
                            </p>
                          </div>
                        </div>
                        <div className="px-5 py-2.5 rounded-xl bg-[#fcf2e9] dark:bg-[#2c1b13] text-[#2c1b13] dark:text-[#fcf2e9] font-body font-bold group-hover:scale-105 transition-transform">
                          Open
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {user.role === "admin" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      href="/admin-dashboard"
                      className="block p-6 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 dark:from-black/10 dark:to-black/5 border border-white/10 dark:border-black/10 hover:from-white/15 hover:to-white/10 dark:hover:from-black/15 dark:hover:to-black/10 transition-all duration-300 group mb-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-white/10 dark:bg-black/10 group-hover:scale-110 transition-transform">
                            <HiCog size={24} />
                          </div>
                          <div>
                            <p className="font-heading font-bold text-lg mb-1">Admin Dashboard</p>
                            <p className="text-sm opacity-70 font-body">
                              Manage users and platform settings
                            </p>
                          </div>
                        </div>
                        <div className="px-5 py-2.5 rounded-xl bg-[#fcf2e9] dark:bg-[#2c1b13] text-[#2c1b13] dark:text-[#fcf2e9] font-body font-bold group-hover:scale-105 transition-transform">
                          Open
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                <UserActivitySection />

                <div className="flex justify-center">
                  <button
                    onClick={handleLogout}
                    className="px-8 py-3.5 rounded-xl border-2 border-white/20 dark:border-black/20 font-body font-bold hover:bg-white/10 dark:hover:bg-black/10 transition-all flex items-center gap-3 group"
                  >
                    <HiLogout size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <EditModal
        isOpen={editNameOpen}
        onClose={() => setEditNameOpen(false)}
        title="Edit Name"
        value={user?.name || ""}
        onSave={handleUpdateName}
        isLoading={isUpdatingInfo}
        placeholder="Enter your full name"
      />

      <EditModal
        isOpen={editPhoneOpen}
        onClose={() => setEditPhoneOpen(false)}
        title="Edit Phone Number"
        value={user?.phone || ""}
        onSave={handleUpdatePhone}
        isLoading={isUpdatingInfo}
        placeholder="Enter your phone number"
      />
    </div>
  );
};

export default ProfilePage;