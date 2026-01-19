"use client";

import React, { useState, useEffect } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { useGetLayoutQuery } from "@/redux/features/layout/layoutApi";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const { data } = useGetLayoutQuery("FAQ", {});
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data?.layout?.faq) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  if (!questions || questions.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#121226] relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl opacity-50" />
        </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-6"
          >
            Frequently Asked <span className="text-purple-500">Questions</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60"
          >
             Everything you need to know about finding your perfect hostel. Can't find the answer you're looking for? Feel free to contact us.
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((q: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group h-fit"
            >
              <button
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border ${
                  activeQuestion === index
                    ? "bg-[#1a1a2e] border-purple-500 shadow-lg shadow-purple-500/10"
                    : "bg-[#1a1a2e]/50 border-white/5 hover:border-white/10 hover:bg-[#1a1a2e]"
                }`}
                onClick={() => toggleQuestion(index)}
              >
                <div className="flex justify-between items-start w-full gap-4">
                  <h3 className={`text-lg font-bold transition-colors ${
                      activeQuestion === index ? "text-white" : "text-white/80 group-hover:text-white"
                  }`}>
                    {q.question}
                  </h3>
                  <div className={`mt-1 p-1 rounded-full shrink-0 transition-all duration-300 ${
                      activeQuestion === index 
                        ? "bg-purple-500 text-white rotate-180" 
                        : "text-white/40 group-hover:text-white"
                  }`}>
                    <HiOutlineChevronDown size={20} />
                  </div>
                </div>
                
                <AnimatePresence>
                  {activeQuestion === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-white/60 leading-relaxed border-t border-white/5 mt-4">
                        {q.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
