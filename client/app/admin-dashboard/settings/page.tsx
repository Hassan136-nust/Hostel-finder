"use client";

import React, { useState, useEffect } from "react";
import { 
    useGetLayoutQuery, 
    useEditLayoutMutation, 
    useCreateLayoutMutation 
} from "@/redux/features/layout/layoutApi";
import {
    HiOutlineQuestionMarkCircle,
    HiOutlinePlus,
    HiOutlineTrash,
    HiOutlineSave
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const AdminSettingsPage = () => {
    const [activeTab, setActiveTab] = useState("FAQ");
    const { data, isLoading, refetch } = useGetLayoutQuery(activeTab, {
        refetchOnMountOrArgChange: true
    });
    const [editLayout, { isLoading: isEditing }] = useEditLayoutMutation();
    const [createLayout, { isLoading: isCreating }] = useCreateLayoutMutation();

    const [faqItems, setFaqItems] = useState<any[]>([]);
    const [textContent, setTextContent] = useState("");

    useEffect(() => {
        if (data?.layout) {
            if (activeTab === "FAQ" && data.layout.faq) {
                setFaqItems([...data.layout.faq]);
            } else if ((activeTab === "Terms" || activeTab === "Privacy") && data.layout.content) {
                setTextContent(data.layout.content);
            } else {
                // Reset if no data found for type (creation mode implied)
                if (activeTab === "FAQ") setFaqItems([]);
                else setTextContent("");
            }
        } else {
             if (activeTab === "FAQ") setFaqItems([]);
             else setTextContent("");
        }
    }, [data, activeTab]);

    const handleAddFaq = () => {
        setFaqItems([...faqItems, { question: "", answer: "" }]);
    };

    const handleRemoveFaq = (index: number) => {
        const newFaq = [...faqItems];
        newFaq.splice(index, 1);
        setFaqItems(newFaq);
    };

    const handleChangeFaq = (index: number, field: string, value: string) => {
        const newFaq = [...faqItems];
        newFaq[index] = { ...newFaq[index], [field]: value };
        setFaqItems(newFaq);
    };

    const handleSave = async () => {
        try {
            if (activeTab === "FAQ") {
                const isValid = faqItems.every(item => item.question && item.answer);
                if (!isValid) return toast.error("Please fill all FAQ fields");
                
                await editLayout({ type: "FAQ", faq: faqItems }).unwrap();
            } else {
                await editLayout({ type: activeTab, content: textContent }).unwrap();
            }
            
            toast.success(`${activeTab} updated successfully!`);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to update ${activeTab}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const tabs = ["FAQ", "Terms", "Privacy"];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white">
                        Platform Settings
                    </h1>
                    <p className="text-white/60 mt-1">
                        Manage website content and global settings
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isEditing || isCreating}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                    <HiOutlineSave size={20} />
                    {isEditing || isCreating ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10 pb-1">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-bold relative transition-colors ${
                            activeTab === tab ? "text-purple-400" : "text-white/60 hover:text-white"
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-[-5px] left-0 w-full h-[2px] bg-purple-400"
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="bg-[#1a1a2e] rounded-2xl border border-white/10 p-6 min-h-[500px]">
                {activeTab === "FAQ" && (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <HiOutlineQuestionMarkCircle className="text-purple-400" />
                                Common Questions (FAQ)
                            </h2>
                            <button
                                onClick={handleAddFaq}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
                            >
                                <HiOutlinePlus size={16} />
                                Add Question
                            </button>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {faqItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-black/20 rounded-xl p-5 border border-white/5 group"
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex-1 space-y-4">
                                                <input
                                                    type="text"
                                                    value={item.question}
                                                    onChange={(e) => handleChangeFaq(index, "question", e.target.value)}
                                                    placeholder="Question..."
                                                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 text-white focus:border-purple-500 focus:outline-none placeholder-white/20"
                                                />
                                                <textarea
                                                    value={item.answer}
                                                    onChange={(e) => handleChangeFaq(index, "answer", e.target.value)}
                                                    placeholder="Answer..."
                                                    rows={3}
                                                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 text-white focus:border-purple-500 focus:outline-none placeholder-white/20 resize-none"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFaq(index)}
                                                className="h-fit p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Remove Question"
                                            >
                                                <HiOutlineTrash size={20} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {faqItems.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                                    <p className="text-white/40">No FAQ items yet. Add one to get started.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {(activeTab === "Terms" || activeTab === "Privacy") && (
                    <div className="h-full flex flex-col">
                        <h2 className="text-xl font-bold text-white mb-4">
                            Edit {activeTab} Content
                        </h2>
                        <textarea
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            placeholder={`Enter ${activeTab} content here...`}
                            className="flex-1 w-full min-h-[400px] px-6 py-6 rounded-xl bg-[#1a1a2e] border border-white/10 text-white focus:border-purple-500 focus:outline-none placeholder-white/20 resize-none font-mono text-sm leading-relaxed"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSettingsPage;
