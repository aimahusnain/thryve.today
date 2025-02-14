"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
    Check,
    ChevronRight,
    Copy,
    Mail,
    Menu,
    PhoneCall,
    X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface NavLink {
  title: string;
  href: string;
}

const navLinks: NavLink[] = [
  { title: "Home", href: "/" },
  { title: "Courses", href: "/courses" },
  { title: "Whyus", href: "/#why-us" },
  { title: "Educators", href: "/#educators" },
  { title: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showCTAInNav, setShowCTAInNav] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const copyEmail = async () => {
    const email = "info@thryve.today";
    await navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success("Email copied to clipboard!", {
      duration: 2000,
      position: "top-right",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const pageHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (position / pageHeight) * 100;

      setScrollPosition(position);
      setShowCTAInNav(scrollPercentage > 7.2);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 sm:top-4 left-0 right-0 z-[60] bg-transparent">
      <div className="container mx-auto px-4 md:px-6 lg:px-0">
        <div className="flex justify-between items-center gap-4">
          {/* Email Group - Visible only on large screens */}
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{
              y: scrollPosition > 20 ? -100 : 0,
              opacity: scrollPosition > 20 ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="hidden lg:flex bg-white rounded-full px-6 py-2.5 shadow-sm transition-shadow duration-300"
          >
            <div
              className="flex items-center space-x-2 text-zinc-700 cursor-pointer"
              onClick={copyEmail}
            >
              <Mail className="w-4 h-4" />
              <span>info@thryve.today</span>
              <AnimatePresence>
                {!copied ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="w-4 h-4 text-zinc-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-4 h-4 text-green-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Main Navigation Bar */}
          <motion.div
            initial={{ y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-none sm:rounded-full px-4 sm:px-6 shadow-sm relative flex-1 lg:flex-none w-full sm:w-auto"
            style={{
              height: "64px",
              borderRadius: isMenuOpen ? "9999px 9999px 9999px 9999px" : undefined,
            }}
          >
            <div className="flex items-center justify-between h-full">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold bg-gradient-to-r from-lime-500 to-emerald-600 bg-clip-text text-transparent">
                  Thryve
                </span>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center space-x-8 ml-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-zinc-700 hover:text-lime-500 transition-colors duration-200"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>

              {/* Tablet Navigation Links */}
              <div className="hidden md:flex lg:hidden items-center space-x-6 ml-6">
                {navLinks.slice(0, 3).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-zinc-700 hover:text-lime-500 transition-colors duration-200 text-sm"
                  >
                    {link.title}
                  </Link>
                ))}
                <button
                  className="text-zinc-700 hover:text-lime-500"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-50"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-zinc-700" />
                ) : (
                  <Menu className="w-5 h-5 text-zinc-700" />
                )}
              </button>

              {/* Desktop CTA Container */}
              <motion.div
                className="hidden lg:flex items-center space-x-4 pl-2 border-l border-zinc-200"
                animate={{
                  width: showCTAInNav ? "auto" : 0,
                  opacity: showCTAInNav ? 1 : 0,
                  marginLeft: showCTAInNav ? "2rem" : 0,
                }}
                initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.div
                  className="flex items-center space-x-4 whitespace-nowrap"
                  animate={{
                    x: showCTAInNav ? 0 : 50,
                    opacity: showCTAInNav ? 1 : 0,
                  }}
                  initial={{ x: 50, opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                    delay: showCTAInNav ? 0.2 : 0,
                  }}
                >
                  <Button variant="ghost" className="rounded-full">
                    Sign In
                  </Button>
                  <Button className="bg-lime-500 hover:bg-lime-600 rounded-full">
                    Get Started
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Desktop Original CTA Buttons */}
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{
              y: scrollPosition > 20 ? -100 : 0,
              opacity: scrollPosition > 20 ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="hidden lg:flex bg-white rounded-full px-6 py-2 shadow-sm transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="rounded-full duration-300">
                Sign In
              </Button>
              <Button className="bg-lime-500 hover:bg-lime-600 rounded-full transition-all duration-300">
                Get Started Today
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Mobile/Tablet Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "95vh" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-white/95 backdrop-blur-md md:hidden"
              style={{ top: "64px" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="h-full overflow-auto"
              >
                {/* Navigation Links with Animations */}
                <div className="px-6 py-8 space-y-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center justify-between group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex flex-col">
                          <span className="text-2xl font-medium text-zinc-800">
                            {link.title}
                          </span>
                          <span className="text-sm text-zinc-500 group-hover:text-lime-500 transition-colors">
                            Explore {link.title.toLowerCase()}
                          </span>
                        </div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="text-lime-500"
                        >
                          <ChevronRight />
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom Actions Section */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-zinc-100">
                  <div className="px-6 py-8 space-y-6">
                    <div className="grid grid-cols-2 gap-5">
                      {/* Contact Info */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-3 text-zinc-600"
                        onClick={copyEmail}
                      >
                        <div className="w-10 h-10 rounded-full bg-lime-50 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-lime-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Email Us</span>
                          <span className="text-xs">info@thryve.today</span>
                        </div>
                        {copied ? (
                          <Check className="w-5 h-5 text-green-500 ml-auto" />
                        ) : (
                          <Copy className="w-5 h-5 text-zinc-400 ml-auto" />
                        )}
                      </motion.div>
                      {/* Contact Info */}
                      <motion.a
                        href="tel:+19794847983"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-3 text-zinc-600"
                      >
                        <div className="w-10 h-10 rounded-full bg-lime-50 flex items-center justify-center">
                          <PhoneCall className="w-5 h-5 text-lime-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Phone No.</span>
                          <span className="text-xs">+1 (979) 484-7983</span>
                        </div>
                      </motion.a>
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-3"
                    >
                      <Button
                        variant="ghost"
                        className="w-full rounded-full h-12 text-base"
                      >
                        Sign In
                      </Button>
                      <Button className="w-full rounded-full h-12 text-base bg-lime-500 hover:bg-lime-600">
                        Get Started Today
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
