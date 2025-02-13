import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle,
  Youtube,
  Phone,
  Video,
  ArrowUpRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-zinc-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Image and Mentors */}
          <div className="relative">
            {/* Video Call Card */}
            <div className="absolute top-4 left-4 z-10">
              <Card className="w-48 p-2">
                <div className="aspect-video relative bg-zinc-100 rounded-lg">
                  <Image
                    src="/nursing-herosection-image-2.webp"
                    alt="Medical training session with healthcare professionals"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </Card>
            </div>

            {/* Main Image */}
            <div className="relative h-[750px]">
              <Image
                src="/nursing-herosection-image-transparent.png"
                alt="Nursing Herosection Image"
                fill
                className="object-cover rounded-2xl"
                priority
              />
            </div>

            {/* Mentors Card */}
            <div className="absolute bottom-4 left-4">
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <Avatar key={i} className="border-2 border-white">
                        <AvatarImage
                          src={`https://i.pravatar.cc/32?img=${i}`}
                        />
                        <AvatarFallback>M{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">99+</p>
                    <p className="text-zinc-600">Certified Mentor</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="px-3 py-2 bg-white w-fit rounded-xl text-md font-medium text-zinc-600 mb-4">
                Training Center
              </h2>
              <h1 className="text-7xl font-bold mb-6 font-space-grotesk">
                Transform Your Life with Quality Medical Training
              </h1>
              <p className="text-zinc-600 text-lg mb-3">
                Empower yourself with medical skills guided by experienced
                educators who care about your growth.
              </p>

              <Button className="bg-primary group text-white p-6 rounded-2xl text-lg">
                Get Started Today{" "}
                <ArrowUpRight className="group-hover:rotate-0 transition-all rotate-45" />
              </Button>
            </div>

            {/* Experience Badge */}
            <div className="absolute right-10 top-1/2 rounded-full border-2 border-primary flex items-center justify-center">
              <div className="text-center">
                <div className="font-bold">1.5+</div>
                <div className="text-xs">YEARS</div>
                <div className="text-xs">EXPERIENCE</div>
              </div>
            </div>

            {/* Reviews Section */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Reviews</h3>
                <Button variant="link" className="text-primary">
                  View all
                </Button>
              </div>
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-4 mb-4">
                  <Avatar>
                    <AvatarImage
                      src={`https://i.pravatar.cc/40?img=${i + 3}`}
                    />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-600">
                      We are committed to continuous improvement and strive to
                      provide a learning environment.
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">4.8</span>
                    <span className="text-yellow-400">★</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
