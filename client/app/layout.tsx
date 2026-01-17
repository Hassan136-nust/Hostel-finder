import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Hostel Finder | Find Your Perfect Stay",
  description: "Premium Hostel Booking Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${jakarta.variable}`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#2c1b13",
                  color: "#fff8f2",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  fontWeight: "600",
                },
                success: {
                  iconTheme: {
                    primary: "#22c55e",
                    secondary: "#ffffff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#ffffff",
                  },
                },
              }}
            />
          </ThemeProvider>
      </body>
    </html>
  );
}
