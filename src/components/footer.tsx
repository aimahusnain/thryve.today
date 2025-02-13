import Link from "next/link";
import { Button } from "./ui/button";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full pt-8 md:pt-12 pb-6 md:pb-[40px] px-10 sm:px-6 md:px-[72px] bg-white">
      <div className="max-w-[1296px] mx-auto">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0 mb-8 md:mb-[64px]">
          {/* Left Section */}
          <div className="space-y-8 w-full md:w-auto">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#96F80F]"></div>
              <span className="text-[20px] font-semibold text-[#101828]">
                Thryve.Today
              </span>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-4 sm:gap-6">
              <div>
                <p className="text-[14px] text-zinc-900 mb-1">Email</p>
                <Link
                  href="mailto:hello@thryve.today"
                  className="text-[14px] text-zinc-700"
                >
                  info@thryve.today
                </Link>
              </div>
              <div>
                <p className="text-[14px] text-zinc-900 mb-1">Phone Number</p>
                <Link
                  href="tel:9794847983"
                  className="text-[14px] text-zinc-700"
                >
                  +1 (979) 484-7983
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[14px] text-zinc-900 mb-1">Address</p>
              <Link href="https://maps.app.goo.gl/mxPw5STmLyFV6qtv6" target="_blank" className="text-[14px] text-zinc-700">
                1800 Roswell Road Suite 2100, Marietta, Georgia 30062, US
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-auto">
            <h3 className="text-[20px] font-semibold text-[#101828] mb-4 md:mb-6">
              Begin your journey to your
              <br className="hidden md:block" /> {` `}
              best self today.
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="w-full sm:w-auto px-5 py-[10px] bg-[#96F80F] rounded-[100px] text-[#101828] font-semibold text-[14px]">
                Apply Now
              </button>
              <button className="w-full sm:w-auto px-5 py-[10px] border border-[#D0D5DD] rounded-[100px] text-[#101828] font-semibold text-[14px]">
                Explore Courses
              </button>
            </div>
          </div>
        </div>

        {/* Platform Support */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 pt-5 border-t">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-[#101828] whitespace-nowrap">
              Copyright © {year} Thryve.Today - All Rights Reserved.
            </span>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {[
              { name: "Home", link: "/home" },
              { name: "Courses", link: "/cources" },
              {
                name: "Apply Now",
                link: "/apply-now",
              },
              { name: "Checkout", link: "/checkout" },
            ].map((platform) => (
              <Link
                href={platform.link}
                key={platform.name}
                className="rounded-[100px] flex items-center gap-2 text-[14px] text-[#101828]"
              >
                <Button variant="link" className="m-0">
                  <span className="whitespace-nowrap">{platform.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
