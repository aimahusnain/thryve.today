import { NursingEnrollmentForm } from "@/components/nursing-enrollment-form";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { ArrowLeft, Calendar, CheckCircle, Clock, DollarSign, GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CoursePage(props: { params: Promise<{ id: string }> }) {
  const { params } = props;
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const course = await prisma.courses.findFirst({
    where: { id, status: "ACTIVE" },
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="mt-[50px] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2db188] hover:text-[#35dba8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all courses
        </Link>

        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 md:p-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              {course.name}
            </h1>
            {course.startingDates && (
              <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                <Calendar className="w-4 h-4 mr-2 text-[#2db188] shrink-0" />
                <span className="text-[#2db188] font-medium">
                  Schedule dates: {course.startingDates}
                </span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-[#35dba8] dark:text-[#2db188] bg-lime-50 dark:bg-[#2db188]/10 px-3 py-1.5 rounded-full">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">{course.price.toFixed(2)}</span>
              </div>
              {course.duration && (
                <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-300/10 px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{course.duration}</span>
                </div>
              )}
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Course description
            </h2>
            <div className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {course.description}
            </div>
          </section>

          {(course.classroom || course.Lab || course.Clinic) && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Hours breakdown
              </h2>
              <ul className="grid gap-2 text-zinc-600 dark:text-zinc-300">
                {course.classroom ? (
                  <li>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">Classroom:</span>{" "}
                    {course.classroom}
                  </li>
                ) : null}
                {course.Lab ? (
                  <li>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">Lab:</span>{" "}
                    {course.Lab}
                  </li>
                ) : null}
                {course.Clinic ? (
                  <li>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">Clinical:</span>{" "}
                    {course.Clinic}
                  </li>
                ) : null}
              </ul>
            </section>
          )}

          {course.WhoShouldAttend && course.WhoShouldAttend.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#35dba8] dark:text-[#2db188]" />
                Who should attend
              </h2>
              <ul className="space-y-2">
                {course.WhoShouldAttend.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-zinc-600 dark:text-zinc-300"
                  >
                    <CheckCircle className="w-4 h-4 text-[#35dba8] dark:text-[#2db188] shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.ProgramHighlights && course.ProgramHighlights.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#35dba8] dark:text-[#2db188]" />
                Program highlights
              </h2>
              <ul className="space-y-3">
                {course.ProgramHighlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-zinc-600 dark:text-zinc-300"
                  >
                    <CheckCircle className="w-5 h-5 text-[#35dba8] dark:text-[#2db188] shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.Note && (
            <section className="rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/30 px-4 py-3">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Note</p>
              <p className="text-sm text-amber-800 dark:text-amber-100/90 mt-1 whitespace-pre-wrap">
                {course.Note}
              </p>
            </section>
          )}
        </div>

        <div className="container mx-auto max-w-4xl">
          <NursingEnrollmentForm
            courseId={course.id}
            courseName={course.name}
            coursePrice={course.price}
            courseDuration={course.duration}
            session={session}
          />
        </div>
      </div>
    </div>
  );
}
