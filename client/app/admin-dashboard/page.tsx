"use client";

import React from "react";
import { useGetAdminStatsQuery, useGetPendingRequestsQuery } from "@/redux/features/admin/adminApi";
import {
    HiOutlineUsers,
    HiOutlineOfficeBuilding,
    HiOutlineStar,
    HiOutlineQuestionMarkCircle,
    HiOutlineBell,
    HiOutlineHome
} from "react-icons/hi";
import { motion } from "framer-motion";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const AdminOverviewPage = () => {
    const { data, isLoading } = useGetAdminStatsQuery(undefined);
    const { data: requestsData } = useGetPendingRequestsQuery(undefined);
    const pendingCount = requestsData?.requests?.length || 0;

    const stats = data?.stats || {};
    const usersByMonth = data?.usersByMonth || [];
    const hostelsByType = data?.hostelsByType || [];

    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers || 0,
            icon: HiOutlineUsers,
            color: "from-blue-500 to-cyan-500"
        },
        {
            title: "Total Hostels",
            value: stats.totalHostels || 0,
            icon: HiOutlineOfficeBuilding,
            color: "from-purple-500 to-indigo-500"
        },
        {
            title: "Active Hostels",
            value: stats.activeHostels || 0,
            icon: HiOutlineHome,
            color: "from-green-500 to-emerald-500"
        },
        {
            title: "Total Reviews",
            value: stats.totalReviews || 0,
            icon: HiOutlineStar,
            color: "from-yellow-500 to-orange-500"
        },
        {
            title: "Total Questions",
            value: stats.totalQuestions || 0,
            icon: HiOutlineQuestionMarkCircle,
            color: "from-pink-500 to-rose-500"
        },
        {
            title: "Pending Requests",
            value: pendingCount,
            icon: HiOutlineBell,
            color: "from-red-500 to-orange-500"
        }
    ];

    // Chart data for users by month
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const userChartData = {
        labels: usersByMonth.map((item: any) => monthNames[item._id.month - 1]),
        datasets: [
            {
                label: 'New Users',
                data: usersByMonth.map((item: any) => item.count),
                backgroundColor: 'rgba(147, 51, 234, 0.5)',
                borderColor: 'rgb(147, 51, 234)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }
        ]
    };

    // Chart data for hostels by type
    const hostelChartData = {
        labels: hostelsByType.map((item: any) => item._id),
        datasets: [
            {
                data: hostelsByType.map((item: any) => item.count),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(236, 72, 153)',
                    'rgb(34, 197, 94)',
                ],
                borderWidth: 2
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            }
        },
        scales: {
            x: {
                ticks: { color: 'rgba(255, 255, 255, 0.5)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y: {
                ticks: { color: 'rgba(255, 255, 255, 0.5)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    padding: 20
                }
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-white">
                    Dashboard Overview
                </h1>
                <p className="text-white/60 mt-1">
                    Monitor your platform performance
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                                <card.icon size={28} className="text-white" />
                            </div>
                            <div>
                                <p className="text-white/60 text-sm">{card.title}</p>
                                <p className="text-3xl font-bold text-white">{card.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/10"
                >
                    <h3 className="text-lg font-bold text-white mb-4">User Growth (Last 6 Months)</h3>
                    <div className="h-72">
                        {usersByMonth.length > 0 ? (
                            <Line data={userChartData} options={chartOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-white/40">
                                No data available
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/10"
                >
                    <h3 className="text-lg font-bold text-white mb-4">Hostels by Type</h3>
                    <div className="h-72">
                        {hostelsByType.length > 0 ? (
                            <Doughnut data={hostelChartData} options={doughnutOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-white/40">
                                No data available
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminOverviewPage;
