type CourseDescriptionExpandableProps = {
  description: string;
};

export function CourseDescriptionExpandable({
  description,
}: CourseDescriptionExpandableProps) {
  return (
    <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
      {description}
    </p>
  );
}
