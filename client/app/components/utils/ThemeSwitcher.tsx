"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mx-4">
        <div className="h-9 w-9 rounded-full bg-brand-card/20 dark:bg-dark-card/50" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center mx-4">
      <button
        aria-label="Toggle Dark Mode"
        type="button"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2c1b13]/10 dark:bg-[#fcf2e9]/10 hover:bg-[#2c1b13]/20 dark:hover:bg-[#fcf2e9]/20 transition-all duration-300 focus:outline-none"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <BiSun
          size={22}
          className={`absolute transition-all duration-500 transform ${
            theme === "dark"
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100 text-[#2c1b13]"
          }`}
        />
        <BiMoon
          size={22}
          className={`absolute transition-all duration-500 transform ${
            theme === "light"
              ? "-rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100 text-[#fcf2e9]"
          }`}
        />
      </button>
    </div>
  );
};