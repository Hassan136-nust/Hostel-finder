import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Providers } from "./Provider";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ComparisonBar from "./components/Comparison/ComparisonBar";
import ComparisonModal from "./components/Comparison/ComparisonModal";

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
          <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <ComparisonBar />
            <ComparisonModal />
            <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={12}
              containerStyle={{
                top: 40,
              }}
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#ffff",
                  color: "#000000",
                  borderRadius: "16px",
                  padding: "16px 24px",
                  fontWeight: "600",
                  fontSize: "14px",
                  boxShadow: "0 20px 40px rgba(44, 27, 19, 0.3)",
                  border: "1px solid rgba(252, 242, 233, 0.1)",
                  backdropFilter: "blur(10px)",
                  maxWidth: "400px",
                },
                success: {
                  iconTheme: {
                    primary: "#22c55e",
                    secondary: "#fcf2e9",
                  },
                  style: {
                    background: "#2c1b13",
                    color: "#fcf2e9",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fcf2e9",
                  },
                  style: {
                    background: "#2c1b13",
                    color: "#fcf2e9",
                  },
                },
              }}
            />
          </ThemeProvider>
          </Providers>
      </body>
    </html>
  );
}
