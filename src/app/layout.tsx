import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import { Toaster } from "sonner";
import BottomContactBar from "@/components/bottom-contact-bar";

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
        <Toaster />
        <BottomContactBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
