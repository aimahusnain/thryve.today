"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X, Mail, Copy, Check, ChevronRight, PhoneCall, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggler"
import { UserNav } from "./user-nav"
import Goy from "@/components/goy"
import CoursesDropdown from "./courses-button"

interface NavLink {
  title: string
  href: string
}

const navLinks: NavLink[] = [
  { title: "Home", href: "home" },
  { title: "Why Us", href: "why-us" },
  { title: "Contact", href: "contact" },
]

export default function Navbar() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [showCTAInNav, setShowCTAInNav] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const isLoading = status === "loading"
  const pathname = usePathname()
  const isHomePage = pathname === "/" || pathname === "/home"
  const [cartItemsCount, setCartItemsCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = (position / pageHeight) * 100

      setScrollPosition(position)
      setShowCTAInNav(scrollPercentage > 7.2)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchCartItemsCount = async () => {
      if (session?.user) {
        try {
          const response = await fetch("/api/cart/count")
          const data = await response.json()
          setCartItemsCount(data.count)
        } catch (error) {
          console.error("Failed to fetch cart count:", error)
        }
      }
    }

    // Initial fetch
    fetchCartItemsCount()

    // Set up interval to check every second
    const intervalId = setInterval(fetchCartItemsCount, 1000)

    // Set up event listener for cart updates
    window.addEventListener("cart-updated", fetchCartItemsCount)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener("cart-updated", fetchCartItemsCount)
    }
  }, [session])

  // Hide navbar on /dashboard/* routes
  // if (pathname.startsWith("/dashboard")) return null;
  if (pathname.startsWith("/admin-dashboard")) return null

  const copyEmail = async () => {
    const email = "info@thryve.today"
    await navigator.clipboard.writeText(email)
    setCopied(true)
    toast.success("Email copied to clipboard!", {
      duration: 2000,
      position: "top-right",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  // Render either Goy component (for home page) or Link to home page section (for other pages)
  const renderNavLink = (link: { href: string; title: string }) => {
    if (isHomePage) {
      return (
        <Goy
          id={link.href}
          key={link.href}
          className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#2DB188] after:transition-transform after:duration-300 after:ease-&lsqb;cubic-bezier(0.65_0.05_0.36_1)&rsqb; hover:after:origin-bottom-left hover:after:scale-x-100"
        >
          {link.title}
        </Goy>
      )
    } else {
      return (
        <Link
          key={link.href}
          href={`/#${link.href}`}
          className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#2DB188] after:transition-transform after:duration-300 after:ease-&lsqb;cubic-bezier(0.65_0.05_0.36_1)&rsqb; hover:after:origin-bottom-left hover:after:scale-x-100"
        >
          {link.title}
        </Link>
      )
    }
  }

  const renderMobileNavLink = (link: { href: string; title: string }, index: number) => {
    if (isHomePage) {
      return (
        <motion.div
          key={link.href}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Goy id={link.href} className="w-full">
            <div className="flex items-center justify-between group w-full" onClick={() => setIsMenuOpen(false)}>
              <div className="flex flex-col items-start">
                <span className="text-2xl font-medium text-foreground">{link.title}</span>
                <span className="text-sm text-muted-foreground group-hover:text-[#2db188] transition-colors">
                  Explore {link.title.toLowerCase()}
                </span>
              </div>
              <motion.div whileHover={{ x: 5 }} className="text-[#2db188]">
                <ChevronRight />
              </motion.div>
            </div>
          </Goy>
        </motion.div>
      )
    } else {
      return (
        <motion.div
          key={link.href}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/#${link.href}`} className="w-full">
            <div className="flex items-center justify-between group w-full" onClick={() => setIsMenuOpen(false)}>
              <div className="flex flex-col items-start">
                <span className="text-2xl font-medium text-foreground">{link.title}</span>
                <span className="text-sm text-muted-foreground group-hover:text-[#2db188] transition-colors">
                  Explore {link.title.toLowerCase()}
                </span>
              </div>
              <motion.div whileHover={{ x: 5 }} className="text-[#2db188]">
                <ChevronRight />
              </motion.div>
            </div>
          </Link>
        </motion.div>
      )
    }
  }

  return (
    <div className="fixed top-0 sm:top-4 left-0 right-0 z-[60]">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center gap-4">
          {/* Email Contact - Desktop Only */}
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{
              y: scrollPosition > 20 ? -100 : 0,
              opacity: scrollPosition > 20 ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="hidden lg:flex bg-background rounded-full px-6 py-2.5 shadow-sm"
          >
            <div className="flex items-center space-x-2 text-foreground cursor-pointer" onClick={copyEmail}>
              <Mail className="w-4 h-4" />
              <span>info@thryve.today</span>
              <AnimatePresence>
                {!copied ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
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
            className="bg-background rounded-none sm:rounded-full px-4 sm:px-6 shadow-sm relative flex-1 lg:flex-none w-full sm:w-auto"
            style={{ height: "64px" }}
          >
            <div className="flex items-center justify-between h-full">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image src="/logo (3).png" className="z-30" alt="Thryve Logo" width={90} height={90} />
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center space-x-8 ml-8">
                {navLinks.map((link) => renderNavLink(link))}
                <CoursesDropdown />
              </div>

              {/* Tablet Navigation Links */}
              <div className="hidden md:flex lg:hidden items-center space-x-6 ml-6">
                {navLinks.slice(0, 3).map((link) =>
                  isHomePage ? (
                    <Goy
                      key={link.href}
                      id={link.href}
                      className="text-foreground hover:text-[#2db188] transition-colors duration-200 text-sm"
                    >
                      {link.title}
                    </Goy>
                  ) : (
                    <Link
                      key={link.href}
                      href={`/#${link.href}`}
                      className="text-foreground hover:text-[#2db188] transition-colors duration-200 text-sm"
                    >
                      {link.title}
                    </Link>
                  ),
                )}
                <Link
                  href="/courses"
                  className="text-foreground hover:text-[#2db188] transition-colors duration-200 text-sm"
                >
                  Courses
                </Link>
                <button className="text-foreground hover:text-[#2db188]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <Menu className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-accent"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
              </button>

              {/* Desktop CTA Container - Appears on scroll */}
              <motion.div
                className="hidden lg:flex items-center space-x-4 pl-4 border-l border-border"
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
                  {isLoading ? (
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  ) : session ? (
                    <>
                      <Link href={session.user.role === "ADMIN" ? "/admin-dashboard" : "/dashboard"}>
                        <Button variant="default">Dashboard</Button>
                      </Link>
                      <Link href="/cart">
                        <Button className="relative" size="sm">
                          <ShoppingCart />
                          {cartItemsCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center z-50 transform scale-110">
                              {cartItemsCount}
                            </span>
                          )}
                        </Button>
                      </Link>
                      <UserNav />
                    </>
                  ) : (
                    <>
                      <Link href="/log-in" className="text-foreground mx-2 hover:text-[#2db188] transition-colors">
                        Sign In
                      </Link>
                      <Link href="/signup">
                        <Button className="bg-[#2db188] hover:bg-[#35dba8] text-white hover:text-black rounded-full">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                  <ThemeToggle />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Desktop Original CTA Buttons - Visible before scroll */}
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{
              y: scrollPosition > 20 ? -100 : 0,
              opacity: scrollPosition > 20 ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="hidden lg:flex bg-background rounded-full px-4 py-2 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {isLoading ? (
                <div className="h-9 w-20 rounded-full bg-muted animate-pulse" />
              ) : session ? (
                <>
                  <UserNav />

                  <Link href="/cart" className="relative">
                    <Button>
                      <ShoppingCart />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center z-50 transform scale-110">
                          {cartItemsCount}
                        </span>
                      )}
                    </Button>
                  </Link>

                  <Link href={session.user.role === "ADMIN" ? "/admin-dashboard" : "/dashboard"}>
                    <Button variant="default">Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/signup">
                    <Button className="bg-[#2db188] text-white hover:bg-[#35dba8] rounded-full">Get Started</Button>
                  </Link>
                  <Link href="/log-in">
                    <Button variant="ghost" className="rounded-full">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Mobile/Tablet Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "90vh" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-background/95 backdrop-blur-md md:hidden"
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
                <div className="px-8 py-8 space-y-6">
                  {/* Main navigation links (using Goy or Link based on current page) */}
                  {navLinks.map((link, index) => renderMobileNavLink(link, index))}

                  {/* Courses link (direct link) */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                  >
                    <Link href="/courses" className="w-full">
                      <div
                        className="flex items-center justify-between group w-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-2xl font-medium text-foreground">Courses</span>
                          <span className="text-sm text-muted-foreground group-hover:text-[#2db188] transition-colors">
                            Explore our courses
                          </span>
                        </div>
                        <motion.div whileHover={{ x: 5 }} className="text-[#2db188]">
                          <ChevronRight />
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                </div>

                {/* Bottom Actions Section */}
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border">
                  <div className="px-6 py-8 grid grid-cols-2 gap-5">
                    <div className="flex flex-col w-full items-start justify-center gap-3">
                      {/* Contact Info */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-3 text-foreground"
                        onClick={copyEmail}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-[#2db188]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Email Us</span>
                          <span className="text-xs">info@thryve.today</span>
                        </div>
                        {copied ? (
                          <Check className="w-5 h-5 text-green-500 ml-auto" />
                        ) : (
                          <Copy className="w-5 h-5 text-muted-foreground ml-auto" />
                        )}
                      </motion.div>

                      {/* Phone Contact */}
                      <motion.a
                        href="tel:+19794847983"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-3 text-foreground"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <PhoneCall className="w-5 h-5 text-[#2db188]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Phone</span>
                          <span className="text-xs">+1 (979) 484-7983</span>
                        </div>
                      </motion.a>
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col w-full items-center justify-center gap-3"
                    >
                      {isLoading ? (
                        <div className="h-12 w-full rounded-full bg-muted animate-pulse" />
                      ) : session ? (
                        <div className="flex gap-4 items-center justify-center w-full">
                          <Link href={session.user.role === "ADMIN" ? "/admin-dashboard" : "/dashboard"}>
                            <Button>Dashboard</Button>
                          </Link>
                          <Link href="/cart">
                            <Button className="relative" size="sm">
                              <ShoppingCart />
                              {cartItemsCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center z-50 transform scale-110">
                                  {cartItemsCount}
                                </span>
                              )}
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <>
                          <Link href="/log-in" className="w-full">
                            <Button
                              onClick={() => setIsMenuOpen(false)}
                              variant="ghost"
                              className="w-full rounded-full h-12 text-base"
                            >
                              Sign In
                            </Button>
                          </Link>
                          <Link href="/signup" className="w-full">
                            <Button
                              onClick={() => setIsMenuOpen(false)}
                              className="w-full rounded-full h-12 text-white text-base bg-[#2db188] hover:bg-[#35dba8]"
                            >
                              Get Started
                            </Button>
                          </Link>
                        </>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
