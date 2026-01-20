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
    <section className="py-20 bg-[#fcf2e9] dark:bg-[#1f1710] relative overflow-hidden transition-colors">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-orange-500/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/5 rounded-full blur-3xl opacity-50" />
        </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-[#2c1b13] dark:text-[#fcf2e9] mb-6"
          >
            Frequently Asked <i>Questions</i>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#2c1b13]/70 dark:text-[#fcf2e9]/70"
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
                    ? "bg-[#2c1b13] border-orange-500 shadow-lg shadow-orange-500/10 dark:bg-[#fcf2e9] dark:border-orange-500"
                    : "bg-[#fcf2e9] border-[#2c1b13]/10 hover:border-orange-500/50 hover:bg-[#fff8f2] dark:bg-[#2c1b13] dark:border-[#fcf2e9]/10 dark:hover:bg-[#3a251b]"
                }`}
                onClick={() => toggleQuestion(index)}
              >
                <div className="flex justify-between items-start w-full gap-4">
                  <h3 className={`text-lg font-bold transition-colors ${
                      activeQuestion === index 
                      ? "text-orange-500 dark:text-orange-600" 
                      : "text-[#2c1b13] group-hover:text-orange-600 dark:text-[#fcf2e9] dark:group-hover:text-orange-400"
                  }`}>
                    {q.question}
                  </h3>
                  <div className={`mt-1 p-1 rounded-full shrink-0 transition-all duration-300 ${
                      activeQuestion === index 
                        ? "bg-orange-500 text-white rotate-180" 
                        : "text-[#2c1b13]/40 group-hover:text-orange-600 dark:text-[#fcf2e9]/40 dark:group-hover:text-orange-400"
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
                      <p className="pt-4 text-white dark:text-black leading-relaxed border-t border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 mt-4">
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
