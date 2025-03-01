import BottomContactBar from "@/components/bottom-contact-bar";
import ThemeContextProvider from "@/context/ThemeContext";
import { AuthProvider } from "@/provider/auth-provider";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Thryve.Today - Admin Dashboard",
  description: "Built by nurses, inspired by care, and driven by education.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans`}>
        <AuthProvider>
          <ThemeContextProvider>
            <Toaster />
            <BottomContactBar />
            {children}
          </ThemeContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}