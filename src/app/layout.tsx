import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import { Toaster } from "sonner";
import BottomContactBar from "@/components/bottom-contact-bar";
import ThemeContextProvider from "@/context/ThemeContext";
import { AuthProvider } from "@/provider/auth-provider";
import Navbar from "@/components/header";
import { CartProvider } from "@/provider/cart-provider";
import { Cart2Provider } from "@/components/cart/cart-provider";
import CrispChat from "@/components/CrispChat";

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
      <head>
        {/* No Crisp script here - it's handled by the CrispChat component */}
      </head>
      <body className={`${spaceGrotesk.variable} font-sans`}>
        <AuthProvider>
          <ThemeContextProvider>
            {" "}
            <Cart2Provider>
              <CartProvider>
                <Navbar />
                <Toaster />
                <BottomContactBar />
                {children}
                <Footer />
                {/* CrispChat component will conditionally load the script */}
                <CrispChat />
              </CartProvider>
            </Cart2Provider>
          </ThemeContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}