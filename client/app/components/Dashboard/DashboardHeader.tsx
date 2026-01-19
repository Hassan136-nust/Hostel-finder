"use client";

import React, { FC, useState, useEffect } from "react";
import { HiOutlineMenuAlt2, HiOutlineBell, HiOutlineStar, HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { useGetHostelReviewsQuery } from "@/redux/features/review/reviewApi";
import { useGetHostelQuestionsQuery } from "@/redux/features/questions/questionApi";
import { useGetMyHostelQuery } from "@/redux/features/hostel/hostelApi";

interface DashboardHeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

interface Notification {
  id: string;
  type: "review" | "question";
  message: string;
  userName: string;
  time: Date;
  read: boolean;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ setSidebarOpen }) => {
  const { user } = useSelector((state: any) => state.auth);
  const { data: hostelData } = useGetMyHostelQuery(undefined);
  const hostel = hostelData?.hostel;

  const { data: reviewsData } = useGetHostelReviewsQuery(hostel?._id, {
    skip: !hostel?._id,
    pollingInterval: 30000 // Poll every 30 seconds
  });

  const { data: questionsData } = useGetHostelQuestionsQuery(hostel?._id, {
    skip: !hostel?._id,
    pollingInterval: 30000
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastReviewCount, setLastReviewCount] = useState<number | null>(null);
  const [lastQuestionCount, setLastQuestionCount] = useState<number | null>(null);

  // Play notification sound using Web Audio API
  const playSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (e) {
      // Audio not supported
    }
  };

  // Check for new reviews
  useEffect(() => {
    const reviews = reviewsData?.reviews || [];
    if (lastReviewCount !== null && reviews.length > lastReviewCount) {
      const newReviews = reviews.slice(0, reviews.length - lastReviewCount);
      newReviews.forEach((review: any) => {
        const notification: Notification = {
          id: `review-${review._id}`,
          type: "review",
          message: `New ${review.rating}-star review`,
          userName: review.user?.name || "Anonymous",
          time: new Date(review.createdAt),
          read: false
        };
        setNotifications(prev => [notification, ...prev.slice(0, 19)]);
        playSound();
      });
    }
    setLastReviewCount(reviews.length);
  }, [reviewsData]);

  // Check for new questions
  useEffect(() => {
    const questions = questionsData?.questions || [];
    if (lastQuestionCount !== null && questions.length > lastQuestionCount) {
      const newQuestions = questions.slice(0, questions.length - lastQuestionCount);
      newQuestions.forEach((question: any) => {
        const notification: Notification = {
          id: `question-${question._id}`,
          type: "question",
          message: question.question?.substring(0, 50) + (question.question?.length > 50 ? "..." : ""),
          userName: question.user?.name || "Anonymous",
          time: new Date(question.createdAt),
          read: false
        };
        setNotifications(prev => [notification, ...prev.slice(0, 19)]);
        playSound();
      });
    }
    setLastQuestionCount(questions.length);
  }, [questionsData]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 py-4 bg-[#fcf2e9]/80 dark:bg-[#1f1710]/80 backdrop-blur-xl border-b border-[#2c1b13]/10 dark:border-white/10 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-xl text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-black/5 dark:hover:bg-white/5 lg:hidden transition-colors"
        >
          <HiOutlineMenuAlt2 size={24} />
        </button>

        <div className="hidden md:block">
          <h2 className="text-lg font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9]">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h2>
          <p className="text-sm text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">
            {hostel?.name || "Your Dashboard"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        
        <div className="relative">
          <button 
            onClick={() => {
              setShowDropdown(!showDropdown);
              if (!showDropdown) markAllAsRead();
            }}
            className="relative p-2 rounded-full text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <HiOutlineBell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 top-12 w-80 max-h-96 bg-white dark:bg-[#2c1b13] rounded-2xl shadow-2xl border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 z-50 overflow-hidden">
                <div className="p-4 border-b border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 flex items-center justify-between">
                  <h3 className="font-bold text-[#2c1b13] dark:text-[#fcf2e9]">Notifications</h3>
                  {notifications.length > 0 && (
                    <button onClick={clearAll} className="text-xs text-red-500 hover:underline">
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <HiOutlineBell size={32} className="mx-auto text-[#2c1b13]/20 dark:text-[#fcf2e9]/20 mb-2" />
                      <p className="text-sm text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#2c1b13]/5 dark:divide-[#fcf2e9]/5">
                      {notifications.map((notification) => (
                        <Link
                          key={notification.id}
                          href={notification.type === "review" ? "/hostel-dashboard/reviews" : "/hostel-dashboard/questions"}
                          onClick={() => setShowDropdown(false)}
                          className={`flex items-start gap-3 p-4 hover:bg-[#2c1b13]/5 dark:hover:bg-[#fcf2e9]/5 transition-colors ${
                            !notification.read ? "bg-blue-50 dark:bg-blue-900/10" : ""
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            notification.type === "review" 
                              ? "bg-yellow-100 dark:bg-yellow-900/30" 
                              : "bg-blue-100 dark:bg-blue-900/30"
                          }`}>
                            {notification.type === "review" ? (
                              <HiOutlineStar size={20} className="text-yellow-600" />
                            ) : (
                              <HiOutlineQuestionMarkCircle size={20} className="text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#2c1b13] dark:text-[#fcf2e9]">
                              {notification.type === "review" ? "New Review" : "New Question"}
                            </p>
                            <p className="text-xs text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 truncate">
                              {notification.userName}: {notification.message}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-8 w-[1px] bg-[#2c1b13]/10 dark:bg-white/10 mx-2 hidden sm:block" />

        <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold font-heading text-[#2c1b13] dark:text-[#fcf2e9]">{user?.name}</p>
                <p className="text-xs font-body text-[#2c1b13]/60 dark:text-[#fcf2e9]/60">Manager</p>
            </div>
            
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#2c1b13]/10 dark:border-white/10 shadow-sm">
                 {user?.avatar?.url ? (
                    <Image
                        src={user.avatar.url}
                        alt={user.name}
                        fill
                        className="object-cover"
                    />
                 ) : (
                    <div className="w-full h-full bg-[#2c1b13] flex items-center justify-center text-[#fcf2e9] font-bold text-sm">
                        {user?.name?.charAt(0)}
                    </div>
                 )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
