"use client";

import React, { useState } from "react";
import { useGetAdminUsersQuery } from "@/redux/features/admin/adminApi";
import {
    HiOutlineUsers,
    HiOutlineSearch,
    HiOutlineMail
} from "react-icons/hi";
import { motion } from "framer-motion";
import Image from "next/image";

const AdminUsersPage = () => {
    const { data, isLoading } = useGetAdminUsersQuery(undefined);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const users = data?.users || [];

    const filteredUsers = users.filter((user: any) => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white">
                        All Users
                    </h1>
                    <p className="text-white/60 mt-1">
                        {users.length} registered user{users.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <div className="flex gap-3">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Users</option>
                        <option value="manager">Managers</option>
                        <option value="admin">Admins</option>
                    </select>

                    <div className="relative">
                        <HiOutlineSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users..."
                            className="w-full sm:w-48 pl-12 pr-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 text-white placeholder-white/40 focus:border-purple-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-[#1a1a2e] rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">User</th>
                                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Email</th>
                                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Role</th>
                                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Request Status</th>
                                <th className="text-left py-4 px-6 text-white/60 font-medium text-sm">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user: any) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                                                {user.avatar?.url ? (
                                                    <Image
                                                        src={user.avatar.url}
                                                        alt={user.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                        {user.name?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="font-medium text-white">{user.name}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-white/60 flex items-center gap-1">
                                            <HiOutlineMail size={14} />
                                            {user.email}
                                        </p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            user.role === "admin" ? "bg-purple-500/20 text-purple-400" :
                                            user.role === "manager" ? "bg-blue-500/20 text-blue-400" :
                                            "bg-white/10 text-white/60"
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            user.hostelRequestStatus === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                                            user.hostelRequestStatus === "approved" ? "bg-green-500/20 text-green-400" :
                                            user.hostelRequestStatus === "rejected" ? "bg-red-500/20 text-red-400" :
                                            "bg-white/10 text-white/40"
                                        }`}>
                                            {user.hostelRequestStatus || "none"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-white/50 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="py-12 text-center">
                        <HiOutlineUsers size={48} className="mx-auto text-white/20 mb-4" />
                        <p className="text-white/60">No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;
