import Image from "next/image";
import { PhoneCall } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Goy from "./goy";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const TeamofEducators = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Natalie Carter",
      role: "Educator",
      image: "/natalie-carter.jpg",
    },
    {
      name: "Auron Austin",
      role: "Educator",
      image: "/auron-austin.jpg",
    },
    {
      name: "Charlie River",
      role: "Educator",
      image: "/charlie-river.jpg",
    },
    {
      name: "Ethan Alan",
      role: "Educator",
      image: "/ethan-alan.jpg",
    },
    {
      name: "Lily",
      role: "Educator",
      image: "/lily.jpg",
    },
  ];

  return (
    <section id="instructors" className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-2 md:mb-4">
        <span className="text-primary mb-4 inline-block">OUR TEAM</span>
        <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-tight mb-6">
          Our Team of{" "}
          <span className="font-thryez text-[#2db188]">Instructors</span>
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Goy id="contact">
            <Button variant="secondary" className="gap-2 w-full sm:w-auto">
              <PhoneCall className="h-4 w-4" />
              Book a Call
            </Button>
          </Goy>
          <Goy id="courses">
            <Button className="w-full sm:w-auto">Book a Demo</Button>
          </Goy>
        </div>
      </div>

      <div className="w-full">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {teamMembers.map((member, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 py-5"
              >
                <div className="group cursor-pointer transition-all duration-300 hover:-translate-y-4">
                  <Card className="rounded-2xl transition-all duration-300 hover:shadow-lg bg-transparent border-none">
                    <CardContent className="p-0 relative">
                      <div className="relative w-full aspect-[4/5]">
                        <Image
                          src={`/team${member.image}`}
                          alt={member.name}
                          fill
                          className="object-cover rounded-xl grayscale transition-all duration-300 group-hover:grayscale-0"
                        />
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 p-3 backdrop-blur-xl bg-white/60 rounded-lg text-black">
                        <h3 className="font-semibold text-2xl md:text-base">
                          {member.name}
                        </h3>
                        <p className="text-md md:text-sm">{member.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default TeamofEducators;
