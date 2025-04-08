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
        {/* <script type="text/javascript">window.$crisp=[];window.CRISP_WEBSITE_ID="3a26cdac-030d-4bb1-80eb-00a1c5176077";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script> */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
          window.$crisp=[];
          window.CRISP_WEBSITE_ID="3a26cdac-030d-4bb1-80eb-00a1c5176077";
        (function(){
          var d = document;
         var  s=d.createElement("script");
          s.src="https://client.crisp.chat/l.js";
          s.async=1;
          d.getElementsByTagName("head")[0].appendChild(s);})();
            `,
          }}
        ></script>
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
              </CartProvider>
            </Cart2Provider>
          </ThemeContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
