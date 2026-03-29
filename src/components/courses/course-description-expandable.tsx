"use client";

import { useState } from "react";

/** Rough length past which we show More/Less instead of always showing full text */
const PREVIEW_CHAR_THRESHOLD = 160;

type CourseDescriptionExpandableProps = {
  description: string;
};

export function CourseDescriptionExpandable({
  description,
}: CourseDescriptionExpandableProps) {
  const [expanded, setExpanded] = useState(false);
  const needsToggle = description.trim().length > PREVIEW_CHAR_THRESHOLD;

  if (!needsToggle) {
    return (
      <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
        {description}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p
        className={`text-sm md:text-base text-zinc-600 dark:text-zinc-400 ${
          expanded ? "whitespace-pre-wrap" : "line-clamp-3"
        }`}
      >
        {description}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="text-sm font-medium text-[#2db188] hover:text-[#35dba8] underline-offset-4 hover:underline"
      >
        {expanded ? "Less" : "More"}
      </button>
    </div>
  );
}
