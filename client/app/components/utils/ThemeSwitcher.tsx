"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();


  return (
    <div className="flex items-center justify-center mx-4">
      <button
        aria-label="Toggle Dark Mode"
        type="button"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-card/20 dark:bg-dark-card/50 hover:bg-brand-card/40 dark:hover:bg-dark-card transition-all duration-300 focus:outline-none"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <BiSun
          size={22}
          className={`absolute transition-all duration-500 transform ${
            resolvedTheme === "dark" 
              ? "rotate-90 scale-0 opacity-0" 
              : "rotate-0 scale-100 opacity-100 text-brand-primary"
          }`}
        />
        
        <BiMoon
          size={22}
          className={`absolute transition-all duration-500 transform ${
            resolvedTheme === "light" 
              ? "-rotate-90 scale-0 opacity-0" 
              : "rotate-0 scale-100 opacity-100 text-dark-primary"
          }`}
        />
      </button>
    </div>
  );
};