"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft, HiCog } from "react-icons/hi";
import { motion } from "framer-motion";

const AdminDashboardPage = () => {
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Access Denied</h1>
          <p className="text-lg opacity-70">
            You need to be an Admin to access this page
          </p>
        </div>
        <Link
          href="/"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all"
        >
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 md:pt-16 pb-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 mb-8 opacity-70 hover:opacity-100 transition-opacity group"
        >
          <HiOutlineArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Back to Profile</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-foreground/5 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 border border-foreground/10 backdrop-blur-sm text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-600/20 flex items-center justify-center">
            <HiCog size={48} className="text-purple-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-lg opacity-70 max-w-md mx-auto mb-8">
            Welcome, {user.name}! This is where you will manage users, hostels, and platform settings.
          </p>
          <div className="inline-block px-6 py-3 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-medium">
            Coming Soon
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
