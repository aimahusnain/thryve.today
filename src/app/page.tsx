"use client";

import ContactSection from "@/components/contact/contact_section";
import CoursesSection from "@/components/courses-section";
import Goy from "@/components/goy";
import TeamofEducators from "@/components/team-of-educators";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SpinningText } from "@/components/ui/spinning-text";
import WhyChooseUsSection from "@/components/why-choose-us";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/header";
export default function Home() {
  return (
    <>
      <Navbar />
      <main
        id="home"
        className="overflow-hidden min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-black"
      >
        <div className="max-w-7xl mx-auto mt-14">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center lg:p-0 p-5">
            {/* Left Column - Image and Mentors */}
            <motion.div
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Video Call Card */}
              {/* <motion.div
              className="absolute top-4 left-4 z-10 w-1/3 sm:w-1/4 lg:w-48 max-w-[200px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
            <Card className="p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-zinc-900">
                <div className="aspect-video relative bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                  <Image
                  draggable={false}
                    src="/nursing-herosection-image-2.webp"
                    alt="Medical training session with healthcare professionals"
                    fill
                    className="object-cover rounded-lg transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Card>
            </motion.div> */}

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
                  className="font-bold leading-none text-primary text-black dark:text-black"
                >
                  {`THRYVE.TODAY TRAINING CENTER • `}
                </SpinningText>
              </motion.div>

              {/* Main Image */}
              {/* <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[750px]">
              <Image
              src="/nursing-herosection-image-transparent.png"
              alt="Nursing Herosection Image"
              draggable={false}
              fill
              className="object-contain lg:object-cover rounded-2xl rounded-br-[5.25rem]"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div> */}

              {/* Heroimages */}
              <div className="mb-12 flex w-full h-fit sm:h-[450px] md:mb-16 relative">
                <div className="relative left-2 top-12 z-10 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 shadow-lg md:left-12 md:top-12 -ml-16">
                  <Image
                    src="/nursing-herosection-image-transparent.png"
                    alt="Nursing Herosection Image 2"
                    className="h-full w-full object-cover object-center"
                    width={1200}
                    height={500}
                  />
                </div>
                <div className="overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 shadow-lg">
                  <Image
                    src="/nursing-herosection-image-2.webp"
                    alt="Nursing Herosection Image 1"
                    className="h-full w-full object-cover object-center"
                    width={1200}
                    height={500}
                  />
                </div>
              </div>

              {/* Mentors Card */}
              {/* <motion.div
              className="absolute bottom-4 left-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Card className="p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-zinc-900">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <Avatar
                        key={i}
                        className="border-2 border-white dark:border-zinc-900 w-8 h-8 sm:w-10 sm:h-10 transition-transform hover:scale-110 duration-200"
                      >
                        <AvatarImage
                          src={`https://i.pravatar.cc/40?img=${i}`}
                        />
                        <AvatarFallback>M{i}</AvatarFallback>
                      </Avatar>
                    ))}
                    </div>
                    <div className="text-xs sm:text-sm">
                    <p className="font-semibold dark:text-white">99+</p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Certified Mentor
                    </p>
                  </div>
                </div>
              </Card>
              </motion.div> */}
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
                  className="px-3 py-2 bg-white dark:bg-zinc-900 w-fit rounded-xl text-sm sm:text-md font-medium text-zinc-600 dark:text-zinc-400 mb-1 shadow-sm"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  Training Center
                </motion.h2>
                <motion.h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-semibold mb-4 sm:mb-6 text-black dark:text-white"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  Transform Your Life with Quality <br />{" "}
                  <span className="text-[#2db188] font-bold">
                    - Medical Training
                  </span>
                </motion.h1>
                <motion.p
                  className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  Empower yourself with medical skills guided by experienced
                  instructors who care about your growth.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <Goy id="contact">
                    <button className="group relative inline-flex h-12 items-center justify-center rounded-md bg-neutral-950 dark:bg-white px-6 font-medium text-neutral-200 dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-zinc-200 transition-colors duration-200">
                      <span>Get Started Today</span>
                      <div className="relative ml-1 h-5 w-5 overflow-hidden">
                        <div className="absolute transition-all duration-200 group-hover:-translate-y-5 group-hover:translate-x-4">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                          >
                            <path
                              d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 -translate-x-4"
                          >
                            <path
                              d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </button>
                  </Goy>
                </motion.div>
              </div>

              {/* Reviews Section */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-base sm:text-lg dark:text-white">
                    Reviews
                  </h3>
                  <Button
                    variant="link"
                    className="text-primary dark:text-[#2db188] text-sm sm:text-base hover:text-primary/80 dark:hover:text-[#2db188] transition-colors duration-200"
                  >
                    View all
                  </Button>
                </div>
                <ScrollArea className="h-[200px] sm:h-[250px] pr-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 sm:gap-4 mb-4 last:mb-0 bg-white/50 dark:bg-zinc-800/50 p-3 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                    >
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-primary/20 dark:border-[#2db188]/20">
                        <AvatarImage
                          src={`https://i.pravatar.cc/124?img=${i + 1}`}
                        />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <p className="font-semibold text-sm sm:text-base mr-2 dark:text-white">
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
                        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
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
    </>
  );
}
