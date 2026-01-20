"use client";

import React from "react";
import { useGetLayoutQuery } from "@/redux/features/layout/layoutApi";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";

const TermsPage = () => {
    const { data, isLoading } = useGetLayoutQuery("Terms");

    return (
        <div className="bg-[#fcf2e9] dark:bg-[#1f1710] min-h-screen transition-colors flex flex-col">
            <Header />
            
            <main className="pt-24 pb-20 flex-1">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-8">
                        Terms of Service
                    </h1>
                    
                    {isLoading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-4 bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 rounded w-3/4"></div>
                            <div className="h-4 bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 rounded w-full"></div>
                            <div className="h-4 bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 rounded w-5/6"></div>
                        </div>
                    ) : (
                        <div className="prose dark:prose-invert max-w-none text-[#2c1b13]/80 dark:text-[#fcf2e9]/80 whitespace-pre-wrap leading-relaxed">
                            {data?.layout?.content || (
                                <p className="italic opacity-60">Terms of Service content has not been added yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsPage;
