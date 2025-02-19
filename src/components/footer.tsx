import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import Goy from "./goy";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full pt-8 md:pt-12 pb-6 md:pb-[17px] px-10 sm:px-6 md:px-[72px] bg-white dark:bg-zinc-900 border-b-4 border-[#2eb88e]">
      <div className="max-w-[1296px] mx-auto">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0 mb-8 md:mb-[64px]">
          {/* Left Section */}
          <div className="space-y-6 w-full md:w-auto">
            {/* Logo */}
            <Image src="/logo.svg"
 alt="Thryve Logo" width={140} height={140} />
            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4 sm:gap-6">
              <div>
                <p className="text-[14px] text-zinc-900 dark:text-zinc-100 mb-1">Email</p>
                <Link
                  href="mailto:hello@thryve.today"
                  className="text-[14px] text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  infor@thryve.today
                </Link>
              </div>
              <div>
                <p className="text-[14px] text-zinc-900 dark:text-zinc-100 mb-1">Phone Number</p>
                <Link
                  href="tel:9794847983"
                  className="text-[14px] text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  +1 (979) 484-7983
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[14px] text-zinc-900 dark:text-zinc-100 mb-1">Address</p>
              <Link
                href="https://maps.app.goo.gl/mxPw5STmLyFV6qtv6"
                target="_blank"
                className="text-[14px] text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                1800 Roswell Road Suite 2100, Marietta, Georgia 30062, US
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-auto">
            <h3 className="text-[20px] font-semibold text-[#101828] dark:text-white mb-4 md:mb-6">
              Begin your journey to your
              <br className="hidden md:block" /> {` `}
              best self today.
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Goy
                id="contact"
                className="w-full sm:w-auto px-5 py-[10px] bg-[#2eb88e] rounded-[100px] text-[#101828] dark:text-zinc-900 font-semibold text-[14px] hover:bg-[#85dc0e] transition-colors"
              >
                Apply Now
              </Goy>
              <Goy
                id="courses"
                className="w-full sm:w-auto px-5 py-[10px] border border-[#D0D5DD] dark:border-zinc-700 rounded-[100px] text-[#101828] dark:text-white font-semibold text-[14px] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Explore Courses
              </Goy>
            </div>
          </div>
        </div>

        {/* Platform Support */}
        <div className="mx-auto flex flex-col md:flex-row items-center justify-center sm:justify-between gap-4 md:gap-6 pt-5 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <span className="text-[14px] text-[#101828] dark:text-zinc-300 text-center">
              Copyright © {year} Thryve.today - All Rights Reserved.
            </span>
            <span className="text-[14px] text-[#101828] dark:text-zinc-300">
              | Designed by{" "}
              <Link
                href="https://devkins.dev/"
                target="_blank"
                className="border-b-[#2eb88e] border-b hover:border-b-2 transition-colors"
              >
                devkins.dev
              </Link>
            </span>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto items-center sm:justify-center justify-center">
            {[
              { name: "Home", link: "home" },
              { name: "Courses", link: "courses" },
              { name: "Apply Now", link: "contact" },
              { name: "Checkout", link: "checkout" },
            ].map((platform) => (
              <Goy
                id={platform.link}
                key={platform.name}
                className="rounded-[100px] flex items-center gap-2 text-[14px] text-[#101828] dark:text-zinc-300"
              >
                <Button variant="link" className="m-0 dark:text-zinc-300 dark:hover:text-white">
                  <span className="whitespace-nowrap">{platform.name}</span>
                </Button>
              </Goy>
            ))}
            <Link
              href="/enrollment"
              key="Enrollment"
              className="rounded-[100px] flex items-center gap-2 text-[14px] text-[#101828] dark:text-zinc-300"
            >
              <Button variant="link" className="m-0 dark:text-zinc-300 dark:hover:text-white">
                <span className="whitespace-nowrap">Enrollment</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;