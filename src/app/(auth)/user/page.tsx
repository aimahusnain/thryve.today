"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-gray-600">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-96 shadow-lg rounded-2xl overflow-hidden bg-white p-6">
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar
              className="w-24 h-24 rounded-full border-4 border-blue-500"
              src={session.user?.image || "https://via.placeholder.com/150"}
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              {session.user?.name}
            </h2>
            <p className="text-gray-500">{session.user?.email}</p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
