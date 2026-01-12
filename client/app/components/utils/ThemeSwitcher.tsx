"use client";

import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="p-2 rounded-full hover:bg-brand-card/20 dark:hover:bg-dark-card transition-all duration-300 flex items-center justify-center outline-none min-w-[40px] min-h-[40px]"
      aria-label="Toggle Theme"
    >
      <span className="inline-block">
        {resolvedTheme === "dark" ? (
          <BiSun size={22} className="text-dark-primary" />
        ) : (
          <BiMoon size={22} className="text-brand-primary" />
        )}
      </span>
    </button>
  );
};