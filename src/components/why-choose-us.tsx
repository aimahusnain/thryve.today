"use client";

import React from "react";
import { Heart, GraduationCap, BookOpen, Hand, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const WhyChooseUsSection = () => {
  const features = [
    {
      icon: <Heart className="w-8 h-8 text-lime-500" />,
      title: "Personalized Learning",
      description:
        "Experience one-on-one training delivered with love and compassion. Our personalized approach ensures that each student receives the attention and support they need to succeed in their medical education journey.",
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-lime-500" />,
      title: "Expert Educators",
      description:
        "Learn directly from experienced and respected medical professionals who bring real-world expertise to your education. Our educators are committed to maintaining the highest standards of medical training.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-lime-500" />,
      title: "Diverse Offerings",
      description:
        "Access comprehensive training programs tailored to various medical disciplines and skill levels. Whether you're starting your medical career or advancing your expertise, we have the right program for you.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-lime-200 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-lime-200 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm uppercase tracking-wider text-lime-500 font-bold mb-3">
            WHY CHOOSE US?
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900">
            Why <span className="text-lime-500">thryve.today</span> is The Right
            Choice for You
          </h3>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Feature Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  index === 2 ? "md:col-span-2" : ""
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-lime-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-6">{feature.icon}</div>
                  <h4 className="text-xl font-bold mb-4 text-zinc-900">
                    {feature.title}
                  </h4>
                  <p className="text-zinc-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Community Impact Card */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-zinc-900 text-white rounded-2xl p-8 h-full group">
              <div className="relative h-full flex flex-col">
                <div className="mb-6">
                  <Hand className="w-8 h-8 text-lime-500" />
                </div>
                <h4 className="text-xl font-bold mb-4">Community Impact</h4>
                <p className="text-zinc-300 leading-relaxed mb-6">
                  Founded by nurses with a vision to make a difference, Thryve
                  is built on the foundation of community service and excellence
                  in medical education.
                </p>
                <p className="text-zinc-300 leading-relaxed mb-8">
                  Our commitment to helping the community drives everything we
                  do, ensuring that our students not only excel in their careers
                  but also contribute meaningfully to healthcare.
                </p>
                <button className="mt-auto w-full bg-lime-500 text-zinc-900 px-8 py-4 rounded-xl font-semibold hover:bg-lime-400 transition-colors duration-300 flex items-center justify-center group/button">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover/button:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
