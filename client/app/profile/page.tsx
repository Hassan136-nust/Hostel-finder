"use client";

import React from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi";

const ProfilePage = () => {
  const { user } = useSelector((state: any) => state.auth);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">Please login to view your profile</h1>
        <Link href="/" className="text-brand-primary underline">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg text-brand-text dark:text-dark-text pt-28 px-6">
      <div className="max-w-[800px] mx-auto">
        <Link href="/" className="flex items-center gap-2 mb-8 opacity-70 hover:opacity-100 transition-opacity w-fit">
          <HiOutlineArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white/5 dark:bg-black/5 rounded-[2.5rem] p-8 md:p-12 border border-white/10 dark:border-black/10">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-brand-primary">
              
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-heading font-bold">{user.name}</h1>
              <p className="opacity-60">{user.email}</p>
              <span className="inline-block mt-4 px-4 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest">
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1">Phone Number</p>
              <p className="font-medium">{user.phone || "Not provided"}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1">Request Status</p>
              <p className="font-medium capitalize">{user.hostelRequestStatus || "No Active Requests"}</p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm opacity-50 italic text-center">
              This is a dummy profile page. Full profile management features coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;