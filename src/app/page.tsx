"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight, Star } from "lucide-react";
import { SpinningText } from "@/components/ui/spinning-text";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContactSection from "@/components/contact/contact_section";
import WhyChooseUsSection from "@/components/why-choose-us";
import TeamofEducators from "@/components/team-of-educators";
import CoursesSection from "@/components/couses-section";

export default function Home() {
  return (
    <main className="overflow-hidden min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 bg-gradient-to-br from-zinc-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center lg:p-0 p-5">
          {/* Left Column - Image and Mentors */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Video Call Card */}
            <motion.div
              className="absolute top-4 left-4 z-10 w-1/3 sm:w-1/4 lg:w-48 max-w-[200px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Card className="p-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video relative bg-zinc-100 rounded-lg overflow-hidden">
                  <Image
                    draggable={false}
                    src="/nursing-herosection-image-2.webp"
                    alt="Medical training session with healthcare professionals"
                    fill
                    className="object-cover rounded-lg transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Card>
            </motion.div>

            {/* Experience Badge */}
            <motion.div
              className="hidden lg:flex absolute right-10 top-[65%] w-28 h-28 rounded-full items-center justify-center z-50"
              initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <SpinningText
                radius={6}
                fontSize={1}
                className="font-medium leading-none text-primary text-white"
              >
                {`13+ YEARS EXPERIENCE • `}
              </SpinningText>
            </motion.div>

            {/* Main Image */}
            <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[750px]">
              <Image
                src="/nursing-herosection-image-transparent.png"
                alt="Nursing Herosection Image"
                draggable={false}
                fill
                className="object-contain lg:object-cover rounded-2xl rounded-br-[5.25rem]"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Mentors Card */}
            <motion.div
              className="absolute bottom-4 left-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Card className="p-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <Avatar
                        key={i}
                        className="border-2 border-white w-8 h-8 sm:w-10 sm:h-10 transition-transform hover:scale-110 duration-200"
                      >
                        <AvatarImage
                          src={`https://i.pravatar.cc/40?img=${i}`}
                        />
                        <AvatarFallback>M{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div className="text-xs sm:text-sm">
                    <p className="font-semibold">99+</p>
                    <p className="text-zinc-600">Certified Mentor</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            className="space-y-6 sm:space-y-8 order-1 lg:order-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <motion.h2
                className="px-3 py-2 bg-white w-fit rounded-xl text-sm sm:text-md font-medium text-zinc-600 mb-1 shadow-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Training Center
              </motion.h2>
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-semibold mb-4 sm:mb-6 text-black"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                Transform Your Life with Quality <br />{" "}
                <span className="text-lime-500 font-bold">
                  - Medical Training
                </span>
              </motion.h1>
              <motion.p
                className="text-zinc-600 text-base sm:text-lg mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                Empower yourself with medical skills guided by experienced
                educators who care about your growth.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <Button className="group px-6 py-3 sm:px-5 sm:py-5 w-full sm:w-auto transition-all duration-75">
                  Get Started Today{" "}
                  <ArrowUpRight className="ml-2 group-hover:rotate-45 transition-all duration-300" />
                </Button>
              </motion.div>
            </div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-base sm:text-lg">Reviews</h3>
                <Button
                  variant="link"
                  className="text-primary text-sm sm:text-base hover:text-primary/80 transition-colors duration-200"
                >
                  View all
                </Button>
              </div>
              <ScrollArea className="h-[200px] sm:h-[250px] pr-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3 sm:gap-4 mb-4 last:mb-0 bg-white/50 p-3 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                  >
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-primary/20">
                      <AvatarImage
                        src={`https://i.pravatar.cc/124?img=${i + 1}`}
                      />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <p className="font-semibold text-sm sm:text-base mr-2">
                          User {i}
                        </p>
                        <div className="flex">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-zinc-600">
                        The quality of education and support from mentors is
                        exceptional. This program has truly transformed my
                        career in healthcare.
                      </p>
                    </div>
                  </motion.div>
                ))}
              </ScrollArea>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <WhyChooseUsSection />
      <CoursesSection />
      <TeamofEducators />
      <ContactSection />
    </main>
  );
}
