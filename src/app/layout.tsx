import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import { Toaster } from "sonner";
import BottomContactBar from "@/components/bottom-contact-bar";
import ThemeContextProvider from "@/context/ThemeContext";
import { AuthProvider } from "@/provider/auth-provider";
import Navbar from "@/components/header";
import { CartProvider } from '@/provider/cart-provider';

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Thryve - Quality Medical Training",
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
            {" "}
            <CartProvider>
              <Navbar />
              <Toaster />
              <BottomContactBar />
              {children}
              <Footer />
            </CartProvider>
          </ThemeContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
